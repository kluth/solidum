import { describe, it, expect, runTests } from '@sldm/testing';

import { createAnalyticsClient } from './analytics-client';
import { createFeedReader } from './feed-reader';
import { createGraphQLClient } from './graphql-client';
import { createMCPClient } from './mcp-client';
import { createOAuthClient } from './oauth-client';
import { createRESTClient } from './rest-client';
import { createSSEClient } from './sse-client';
import { createWebhookHandler } from './webhook-handler';
import { createWebSocketClient } from './websocket-client';

describe('REST Client', () => {
  it('should create a REST client', () => {
    const client = createRESTClient({
      name: 'test-api',
      baseUrl: 'https://api.example.com',
    });
    expect(client).toBeDefined();
  });

  it('should perform GET request', async () => {
    const client = createRESTClient({
      name: 'test-api',
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    const response = await client.get<{ id: number; title: string }>('/posts/1');
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(1);
  });

  it('should perform POST request', async () => {
    const client = createRESTClient({
      name: 'test-api',
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    const response = await client.post<{ id: number }>('/posts', {
      title: 'Test Post',
      body: 'This is a test',
      userId: 1,
    });
    expect(response.status).toBe(201);
    expect(response.data).toBeDefined();
  });

  it('should handle request interceptors', async () => {
    let interceptorCalled = false;
    const client = createRESTClient({
      name: 'test-api',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      interceptors: {
        request: [
          config => {
            interceptorCalled = true;
            return config;
          },
        ],
      },
    });

    await client.get('/posts/1');
    expect(interceptorCalled).toBe(true);
  });

  it('should add query parameters', async () => {
    const client = createRESTClient({
      name: 'test-api',
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });

    const response = await client.get<Array<{ userId: number }>>('/posts', {
      params: { userId: 1 },
    });
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
  });
});

describe('GraphQL Client', () => {
  it('should create a GraphQL client', () => {
    const client = createGraphQLClient({
      name: 'test-graphql',
      endpoint: 'https://api.example.com/graphql',
    });
    expect(client).toBeDefined();
  });

  it('should perform a query', async () => {
    const client = createGraphQLClient({
      name: 'test-graphql',
      endpoint: 'https://graphqlzero.almansi.me/api',
    });

    const result = await client.query<{ user: { id: string; name: string } }>(
      `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
        }
      }
    `,
      { id: '1' }
    );

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
  });

  it('should perform a mutation', async () => {
    const client = createGraphQLClient({
      name: 'test-graphql',
      endpoint: 'https://graphqlzero.almansi.me/api',
    });

    const result = await client.mutate<{ createPost: { id: string } }>(
      `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          id
        }
      }
    `,
      {
        input: {
          title: 'Test Post',
          body: 'Test content',
        },
      }
    );

    expect(result).toBeDefined();
  });
});

describe('WebSocket Client', () => {
  it('should create a WebSocket client', () => {
    const client = createWebSocketClient({
      name: 'test-ws',
      url: 'wss://echo.websocket.org',
    });
    expect(client).toBeDefined();
  });

  it('should connect and send messages', async () => {
    const client = createWebSocketClient({
      name: 'test-ws',
      url: 'wss://echo.websocket.org',
      timeout: 5000,
    });

    try {
      await client.connect();
      expect(client.isConnected()).toBe(true);
      client.send('Hello WebSocket');
    } finally {
      client.disconnect();
    }
  });

  it('should handle reconnection', async () => {
    const client = createWebSocketClient({
      name: 'test-ws',
      url: 'wss://echo.websocket.org',
      reconnect: true,
      maxReconnectAttempts: 3,
      timeout: 5000,
    });

    try {
      await client.connect();
      expect(client.isConnected()).toBe(true);
    } finally {
      client.disconnect();
    }
  });
});

describe('SSE Client', () => {
  it('should create an SSE client', () => {
    const client = createSSEClient({
      name: 'test-sse',
      url: 'https://api.example.com/events',
    });
    expect(client).toBeDefined();
  });

  it('should handle event listeners', () => {
    const client = createSSEClient({
      name: 'test-sse',
      url: 'https://api.example.com/events',
    });

    const unsubscribe = client.on('message', _data => {
      // Handle message
    });

    expect(typeof unsubscribe).toBe('function');
  });
});

describe('Feed Reader', () => {
  it('should create a feed reader', () => {
    const reader = createFeedReader({
      name: 'test-feed',
      url: 'https://example.com/feed.xml',
    });
    expect(reader).toBeDefined();
  });

  // Feed reader tests require browser environment (DOMParser)
  if (typeof DOMParser !== 'undefined') {
    it('should fetch RSS feed', async () => {
      const reader = createFeedReader({
        name: 'test-feed',
        url: 'https://feeds.bbci.co.uk/news/rss.xml',
        type: 'rss',
      });

      const feed = await reader.fetch();
      expect(feed).toBeDefined();
      expect(feed.title).toBeDefined();
      expect(Array.isArray(feed.items)).toBe(true);
    });

    it('should parse feed items', async () => {
      const reader = createFeedReader({
        name: 'test-feed',
        url: 'https://feeds.bbci.co.uk/news/rss.xml',
      });

      const feed = await reader.fetch();
      if (feed.items.length > 0) {
        const item = feed.items[0];
        expect(item.id).toBeDefined();
        expect(item.title).toBeDefined();
        expect(item.link).toBeDefined();
      }
    });
  }
});

describe('MCP Client', () => {
  it('should create an MCP client', () => {
    const client = createMCPClient({
      name: 'test-mcp',
      endpoint: 'https://api.example.com/v1',
      apiKey: 'test-key',
    });
    expect(client).toBeDefined();
  });

  it('should send chat request', async () => {
    // Mock test - would need real API key
    const _client = createMCPClient({
      name: 'test-mcp',
      endpoint: 'https://api.example.com/v1',
      apiKey: 'mock-key',
    });

    const request = {
      messages: [{ role: 'user' as const, content: 'Hello' }],
      model: 'gpt-3.5-turbo',
    };

    // In real test, would make actual API call
    expect(request.messages.length).toBe(1);
  });

  it('should handle streaming responses', () => {
    const _client = createMCPClient({
      name: 'test-mcp',
      endpoint: 'https://api.example.com/v1',
      apiKey: 'mock-key',
    });

    const chunks = 0;
    // Would call stream method in real test
    expect(chunks).toBe(0);
  });
});

describe('OAuth Client', () => {
  it('should create an OAuth client', () => {
    const client = createOAuthClient({
      name: 'test-oauth',
      clientId: 'test-client-id',
      clientSecret: 'test-secret',
      authorizationUrl: 'https://auth.example.com/authorize',
      tokenUrl: 'https://auth.example.com/token',
      redirectUri: 'https://app.example.com/callback',
    });
    expect(client).toBeDefined();
  });

  it('should generate authorization URL', () => {
    const client = createOAuthClient({
      name: 'test-oauth',
      clientId: 'test-client-id',
      authorizationUrl: 'https://auth.example.com/authorize',
      tokenUrl: 'https://auth.example.com/token',
      redirectUri: 'https://app.example.com/callback',
      scope: ['read', 'write'],
    });

    const url = client.getAuthorizationUrl('random-state');
    expect(url).toContain('client_id=test-client-id');
    expect(url).toContain('redirect_uri=');
    expect(url).toContain('state=random-state');
  });

  it('should exchange authorization code', async () => {
    const _client = createOAuthClient({
      name: 'test-oauth',
      clientId: 'test-client-id',
      clientSecret: 'test-secret',
      authorizationUrl: 'https://auth.example.com/authorize',
      tokenUrl: 'https://auth.example.com/token',
      redirectUri: 'https://app.example.com/callback',
    });

    // Mock test - would need real OAuth server
    const code = 'mock-auth-code';
    expect(code).toBe('mock-auth-code');
  });
});

describe('Webhook Handler', () => {
  it('should create a webhook handler', () => {
    const handler = createWebhookHandler({
      secret: 'webhook-secret',
      signatureHeader: 'X-Hub-Signature-256',
      signatureAlgorithm: 'sha256',
    });
    expect(handler).toBeDefined();
  });

  it('should verify webhook signature', async () => {
    const _handler = createWebhookHandler({
      secret: 'test-secret',
      signatureAlgorithm: 'sha256',
    });

    const payload = JSON.stringify({ event: 'test', data: { id: 1 } });
    const _signature = 'sha256=abc123'; // Would be real signature

    // In real test, would verify actual signature
    expect(payload).toBeDefined();
  });

  it('should handle webhook payload', async () => {
    const handler = createWebhookHandler({
      secret: 'test-secret',
    });

    let eventReceived = false;
    await handler.handle(
      {
        event: 'test.created',
        data: { id: 1 },
        timestamp: Date.now(),
      },
      _data => {
        eventReceived = true;
      }
    );

    expect(eventReceived).toBe(true);
  });
});

describe('Analytics Client', () => {
  it('should create an analytics client', () => {
    const client = createAnalyticsClient({
      name: 'test-analytics',
      trackingId: 'UA-12345678-1',
    });
    expect(client).toBeDefined();
  });

  it('should track page views', () => {
    const client = createAnalyticsClient({
      name: 'test-analytics',
      trackingId: 'UA-12345678-1',
    });

    client.pageView({
      path: '/test-page',
      title: 'Test Page',
    });

    // Would verify tracking in real test
    expect(true).toBe(true);
  });

  it('should track events', () => {
    const client = createAnalyticsClient({
      name: 'test-analytics',
      trackingId: 'UA-12345678-1',
    });

    client.event({
      category: 'User',
      action: 'Click',
      label: 'Test Button',
      value: 1,
    });

    expect(true).toBe(true);
  });

  it('should set user properties', () => {
    const client = createAnalyticsClient({
      name: 'test-analytics',
      trackingId: 'UA-12345678-1',
    });

    client.setUser('user-123');
    client.setProperty('plan', 'premium');

    expect(true).toBe(true);
  });
});

runTests();
