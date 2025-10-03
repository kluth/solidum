# @sldm/integrations

Comprehensive integration adapters for REST APIs, GraphQL, WebSockets, feeds, authentication, and third-party services.

## Installation

```bash
npm install @sldm/integrations
# or
pnpm add @sldm/integrations
```

## Features

- ✅ **REST API Client** - Full-featured HTTP client with interceptors
- ✅ **GraphQL Client** - Query, mutation, and subscription support
- ✅ **WebSocket Client** - Real-time communication with auto-reconnection
- ✅ **Server-Sent Events (SSE)** - Unidirectional server streaming
- ✅ **Feed Readers** - RSS, Atom, and JSON feed parsing
- ✅ **Model Context Protocol (MCP)** - AI/LLM integration client
- ✅ **OAuth 2.0** - Complete authorization flow implementation
- ✅ **Webhook Handlers** - HMAC signature verification
- ✅ **Analytics** - Google Analytics integration
- ⚠️  **gRPC** - Stub implementation (requires additional setup)

## Quick Start

### REST API Client

```typescript
import { createRESTClient } from '@sldm/integrations';

const api = createRESTClient({
  name: 'my-api',
  baseUrl: 'https://api.example.com',
  defaultHeaders: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  interceptors: {
    request: [(config) => {
      console.log('Making request:', config.url);
      return config;
    }],
    response: [(response) => {
      console.log('Received response:', response.status);
      return response;
    }]
  }
});

// Make requests
const response = await api.get<User>('/users/123');
console.log(response.data);

await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### GraphQL Client

```typescript
import { createGraphQLClient } from '@sldm/integrations';

const graphql = createGraphQLClient({
  name: 'my-graphql',
  endpoint: 'https://api.example.com/graphql',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

// Queries
const user = await graphql.query<{ user: User }>(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`, { id: '123' });

// Mutations
const result = await graphql.mutate<{ createUser: User }>(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`, { input: { name: 'John', email: 'john@example.com' } });
```

### WebSocket Client

```typescript
import { createWebSocketClient } from '@sldm/integrations';

const ws = createWebSocketClient({
  name: 'my-websocket',
  url: 'wss://api.example.com/ws',
  reconnect: true,
  maxReconnectAttempts: 5,
  reconnectInterval: 1000
});

// Handle events
ws.on('open', () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
});

ws.on('message', (data) => {
  console.log('Received:', data);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Disconnected');
});

// Connect
await ws.connect();

// Later: disconnect
ws.disconnect();
```

### Server-Sent Events (SSE)

```typescript
import { createSSEClient } from '@sldm/integrations';

const sse = createSSEClient({
  name: 'my-sse',
  url: 'https://api.example.com/events'
});

// Listen for events
const unsubscribe = sse.on('message', (event) => {
  console.log('New event:', event.data);
});

// Connect to stream
sse.connect();

// Later: disconnect
sse.disconnect();
```

### Feed Reader (RSS/Atom/JSON)

```typescript
import { createFeedReader } from '@sldm/integrations';

const reader = createFeedReader({
  name: 'tech-news',
  url: 'https://example.com/feed.xml',
  type: 'rss' // or 'atom' or 'json'
});

// Fetch feed once
const feed = await reader.fetch();
console.log(`${feed.title}: ${feed.items.length} items`);

feed.items.forEach(item => {
  console.log(`- ${item.title} (${item.pubDate})`);
});

// Subscribe to feed updates (polls every 60 seconds)
const unsubscribe = reader.subscribe((newItems) => {
  console.log(`${newItems.length} new items:`);
  newItems.forEach(item => console.log(`- ${item.title}`));
}, 60000);

// Later: stop polling
unsubscribe();
```

### Model Context Protocol (MCP) Client

```typescript
import { createMCPClient } from '@sldm/integrations';

const mcp = createMCPClient({
  name: 'ai-assistant',
  endpoint: 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000
});

// Chat completion
const response = await mcp.chat({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is TypeScript?' }
  ]
});

console.log(response.choices[0].message.content);

// Streaming response
await mcp.stream({
  messages: [
    { role: 'user', content: 'Write a haiku about programming' }
  ]
}, (chunk) => {
  process.stdout.write(chunk);
});
```

### OAuth 2.0 Client

```typescript
import { createOAuthClient } from '@sldm/integrations';

const oauth = createOAuthClient({
  name: 'github-oauth',
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  redirectUri: 'http://localhost:3000/callback',
  scope: ['user', 'repo']
});

// Step 1: Redirect user to authorization URL
const authUrl = oauth.getAuthorizationUrl('random-state-string');
console.log('Redirect to:', authUrl);

// Step 2: Exchange authorization code for tokens
const tokens = await oauth.exchangeCode('authorization-code-from-callback');
console.log('Access token:', tokens.accessToken);

// Step 3: Refresh token when needed
const refreshed = await oauth.refreshToken(tokens.refreshToken!);
console.log('New access token:', refreshed.accessToken);

// Step 4: Revoke token when done
await oauth.revokeToken(tokens.accessToken);
```

### Webhook Handler

```typescript
import { createWebhookHandler } from '@sldm/integrations';

const handler = createWebhookHandler({
  secret: process.env.WEBHOOK_SECRET!,
  signatureHeader: 'X-Hub-Signature-256',
  signatureAlgorithm: 'sha256'
});

// In your HTTP server
app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  // Verify signature
  const isValid = await handler.verify(payload, signature, process.env.WEBHOOK_SECRET!);
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Handle webhook
  await handler.handle({
    event: req.body.event,
    data: req.body.data,
    timestamp: Date.now()
  }, (data) => {
    console.log('Webhook received:', data);
  });

  res.status(200).send('OK');
});
```

### Analytics Client

```typescript
import { createAnalyticsClient } from '@sldm/integrations';

const analytics = createAnalyticsClient({
  name: 'my-analytics',
  trackingId: 'UA-XXXXX-Y',
  debug: process.env.NODE_ENV === 'development',
  anonymizeIp: true
});

// Track page views
analytics.pageView({
  path: '/home',
  title: 'Home Page',
  referrer: document.referrer
});

// Track events
analytics.event({
  category: 'User',
  action: 'Login',
  label: 'OAuth',
  value: 1
});

// Set user properties
analytics.setUser('user-123');
analytics.setProperty('plan', 'premium');
```

## Advanced Usage

### REST Client with Retry Logic

```typescript
import { createRESTClient } from '@sldm/integrations';

const api = createRESTClient({
  name: 'retry-api',
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  interceptors: {
    request: [
      async (config) => {
        // Add retry logic
        let attempt = 0;
        while (attempt < 3) {
          try {
            return config;
          } catch (error) {
            attempt++;
            if (attempt === 3) throw error;
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }
        return config;
      }
    ]
  }
});
```

### WebSocket with Custom Protocols

```typescript
import { createWebSocketClient } from '@sldm/integrations';

const ws = createWebSocketClient({
  name: 'protocol-ws',
  url: 'wss://api.example.com/ws',
  protocols: ['v1.protocol.example.com'],
  reconnect: true,
  reconnectInterval: 2000,
  maxReconnectAttempts: 10
});

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: 'YOUR_TOKEN'
  }));
});
```

### Feed Reader with Multiple Feeds

```typescript
import { createFeedReader } from '@sldm/integrations';

const feeds = [
  'https://example.com/feed1.xml',
  'https://example.com/feed2.xml',
  'https://example.com/feed3.xml'
].map(url => createFeedReader({ name: url, url, type: 'rss' }));

// Fetch all feeds in parallel
const results = await Promise.all(feeds.map(f => f.fetch()));
const allItems = results.flatMap(feed => feed.items);

// Sort by date
allItems.sort((a, b) =>
  (b.pubDate?.getTime() || 0) - (a.pubDate?.getTime() || 0)
);

console.log('Latest items:');
allItems.slice(0, 10).forEach(item => {
  console.log(`- ${item.title} (${item.pubDate})`);
});
```

## Type Definitions

All clients are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  RESTClient,
  RESTConfig,
  GraphQLClient,
  WebSocketClient,
  SSEClient,
  FeedReader,
  MCPClient,
  OAuthClient,
  WebhookHandler,
  AnalyticsClient
} from '@sldm/integrations';
```

## Browser vs Node.js

Most integrations work in both browser and Node.js environments:

- ✅ REST, GraphQL, WebSocket, MCP, OAuth, Analytics: **Universal**
- ⚠️ **Feed Reader**: Requires `DOMParser` (browser only, or use a polyfill in Node.js)
- ⚠️ **SSE**: Requires `EventSource` (browser only, or use `eventsource` package in Node.js)

## gRPC Setup

The gRPC client is a stub implementation. For full support:

**Browser:**
```bash
npm install @improbable-eng/grpc-web
```

**Node.js:**
```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

See `packages/integrations/src/grpc-client.ts` for integration examples.

## Testing

All integrations include comprehensive tests. Run them with:

```bash
pnpm --filter @sldm/integrations test
```

## License

MIT

## Contributing

Contributions welcome! Please see the main repository for contribution guidelines.
