import type { OAuthClient, OAuthConfig, OAuthTokenResponse } from './types';

export function createOAuthClient(config: OAuthConfig): OAuthClient {
  const {
    clientId,
    clientSecret,
    authorizationUrl,
    tokenUrl,
    redirectUri,
    scope = [],
    state: defaultState,
  } = config;

  return {
    getAuthorizationUrl(state?: string): string {
      const url = new URL(authorizationUrl);

      url.searchParams.append('client_id', clientId);
      url.searchParams.append('redirect_uri', redirectUri);
      url.searchParams.append('response_type', 'code');

      if (scope.length > 0) {
        url.searchParams.append('scope', scope.join(' '));
      }

      if (state || defaultState) {
        url.searchParams.append('state', state || defaultState || '');
      }

      return url.toString();
    },

    async exchangeCode(code: string): Promise<OAuthTokenResponse> {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret || '',
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OAuth error: ${error.error_description || error.error || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        scope: data.scope,
      };
    },

    async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OAuth refresh error: ${error.error_description || error.error || response.statusText}`
        );
      }

      const data = await response.json();

      return {
        accessToken: data.access_token,
        tokenType: data.token_type,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        scope: data.scope,
      };
    },

    async revokeToken(token: string): Promise<void> {
      // Not all OAuth providers support token revocation
      // This is a basic implementation
      const response = await fetch(tokenUrl.replace('/token', '/revoke'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token,
          client_id: clientId,
          client_secret: clientSecret || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token revocation failed: ${response.statusText}`);
      }
    },
  };
}
