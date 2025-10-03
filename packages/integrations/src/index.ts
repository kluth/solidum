/**
 * @sldm/integrations - Integration adapters for APIs and services
 *
 * Provides ready-to-use clients for:
 * - REST APIs
 * - GraphQL
 * - gRPC (stub - requires additional library)
 * - WebSockets
 * - Server-Sent Events (SSE)
 * - Feed readers (RSS/Atom/JSON)
 * - Model Context Protocol (MCP)
 * - OAuth 2.0
 * - Webhooks
 * - Analytics
 *
 * @packageDocumentation
 */

// Types
export type {
  // Base types
  IntegrationConfig,
  IntegrationResponse,
  IntegrationError,
  IntegrationType,
  Integration,

  // REST
  RESTClient,
  RESTConfig,
  RequestConfig,
  HTTPMethod,
  RequestInterceptor,
  ResponseInterceptor,

  // GraphQL
  GraphQLClient,
  GraphQLConfig,
  GraphQLRequest,
  GraphQLResponse,
  GraphQLError,

  // gRPC
  GRPCClient,
  GRPCConfig,
  GRPCCredentials,

  // WebSocket
  WebSocketClient,
  WebSocketConfig,
  WebSocketEventType,

  // SSE
  SSEClient,
  SSEConfig,

  // Feeds
  FeedReader,
  FeedConfig,
  Feed,
  FeedItem,
  FeedEnclosure,
  FeedType,

  // MCP
  MCPClient,
  MCPConfig,
  MCPRequest,
  MCPResponse,
  MCPMessage,
  MCPTool,

  // OAuth
  OAuthClient,
  OAuthConfig,
  OAuthTokenResponse,

  // Webhooks
  WebhookHandler,
  WebhookConfig,
  WebhookPayload,

  // Analytics
  AnalyticsClient,
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsPageView,
} from './types';

// Clients
export { createRESTClient } from './rest-client';
export { createGraphQLClient } from './graphql-client';
export { createGRPCClient } from './grpc-client';
export { createWebSocketClient } from './websocket-client';
export { createSSEClient } from './sse-client';
export { createFeedReader } from './feed-reader';
export { createMCPClient } from './mcp-client';
export { createOAuthClient } from './oauth-client';
export { createWebhookHandler } from './webhook-handler';
export { createAnalyticsClient } from './analytics-client';
