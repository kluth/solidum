import type { WebhookHandler, WebhookConfig, WebhookPayload } from './types';

export function createWebhookHandler(config: WebhookConfig): WebhookHandler {
  const { secret, signatureAlgorithm = 'sha256' } = config;

  async function computeSignature(
    payload: string,
    secret: string,
    algorithm: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: algorithm.toUpperCase() },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  return {
    async verify(payload: string, signature: string, verifySecret: string): Promise<boolean> {
      if (!signature) {
        return false;
      }

      // Remove algorithm prefix if present (e.g., "sha256=")
      const actualSignature = signature.includes('=') ? signature.split('=')[1] : signature;

      // Compute expected signature
      const expectedSignature = await computeSignature(payload, verifySecret, signatureAlgorithm);

      // Timing-safe comparison
      return timingSafeEqual(actualSignature, expectedSignature);
    },

    async handle<T>(
      payload: WebhookPayload<T>,
      handler: (data: T) => void | Promise<void>
    ): Promise<void> {
      // Verify signature if secret is provided and payload has signature
      if (secret && payload.signature) {
        const payloadString = JSON.stringify({
          event: payload.event,
          data: payload.data,
          timestamp: payload.timestamp,
        });

        const isValid = await this.verify(payloadString, payload.signature, secret);

        if (!isValid) {
          throw new Error('Invalid webhook signature');
        }
      }

      // Execute handler
      await handler(payload.data);
    },
  };
}
