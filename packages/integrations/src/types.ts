/**
 * Core integration types and interfaces
 */

// ============================================================================
// Base Integration Types
// ============================================================================

export interface IntegrationConfig {
  name: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface IntegrationResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: number;
}

export interface IntegrationError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

// ============================================================================
// REST API Types
// ============================================================================

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface RESTConfig extends IntegrationConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = <T>(
  response: IntegrationResponse<T>
) => IntegrationResponse<T> | Promise<IntegrationResponse<T>>;

export interface RequestConfig {
  method: HTTPMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  timeout?: number;
}

export interface RESTClient {
  get<T>(url: string, config?: Partial<RequestConfig>): Promise<IntegrationResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<IntegrationResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<IntegrationResponse<T>>;
  patch<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>
  ): Promise<IntegrationResponse<T>>;
  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<IntegrationResponse<T>>;
  request<T>(config: RequestConfig): Promise<IntegrationResponse<T>>;
}

// ============================================================================
// GraphQL Types
// ============================================================================

export interface GraphQLConfig extends IntegrationConfig {
  endpoint: string;
  headers?: Record<string, string>;
  wsEndpoint?: string;
}

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLClient {
  query<T>(_query: string, _variables?: Record<string, unknown>): Promise<T>;
  mutate<T>(_mutation: string, _variables?: Record<string, unknown>): Promise<T>;
  subscribe<T>(
    _subscription: string,
    _variables?: Record<string, unknown>,
    _callback?: (data: T) => void
  ): () => void;
}

// ============================================================================
// gRPC Types
// ============================================================================

export interface GRPCConfig extends IntegrationConfig {
  protoPath?: string;
  packageName?: string;
  serviceName?: string;
  credentials?: GRPCCredentials;
}

export interface GRPCCredentials {
  type: 'insecure' | 'ssl' | 'custom';
  cert?: string;
  key?: string;
  ca?: string;
}

export interface GRPCClient {
  unary<TRequest, TResponse>(_method: string, _request: TRequest): Promise<TResponse>;
  serverStream<TRequest, TResponse>(
    _method: string,
    _request: TRequest,
    _onData: (data: TResponse) => void
  ): () => void;
  clientStream<TRequest, TResponse>(
    _method: string,
    _onEnd: (response: TResponse) => void
  ): (data: TRequest) => void;
  bidiStream<TRequest, TResponse>(
    _method: string,
    _onData: (data: TResponse) => void
  ): (data: TRequest) => void;
}

// ============================================================================
// WebSocket Types
// ============================================================================

export interface WebSocketConfig extends IntegrationConfig {
  url: string;
  protocols?: string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export type WebSocketEventType = 'open' | 'message' | 'error' | 'close';

export interface WebSocketClient {
  connect(): Promise<void>;
  disconnect(): void;
  send(data: string | ArrayBuffer | Blob): void;
  on(event: WebSocketEventType, handler: (data?: unknown) => void): () => void;
  isConnected(): boolean;
}

// ============================================================================
// Server-Sent Events (SSE) Types
// ============================================================================

export interface SSEConfig extends IntegrationConfig {
  url: string;
  withCredentials?: boolean;
  eventSourceInitDict?: EventSourceInit;
}

export interface SSEClient {
  connect(): void;
  disconnect(): void;
  on(event: string, handler: (data: MessageEvent) => void): () => void;
  isConnected(): boolean;
}

// ============================================================================
// Feed Types (RSS/Atom/JSON)
// ============================================================================

export type FeedType = 'rss' | 'atom' | 'json';

export interface FeedConfig extends IntegrationConfig {
  url: string;
  type?: FeedType;
  pollInterval?: number;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description?: string;
  content?: string;
  author?: string;
  pubDate?: Date;
  categories?: string[];
  enclosures?: FeedEnclosure[];
  guid?: string;
}

export interface FeedEnclosure {
  url: string;
  type?: string;
  length?: number;
}

export interface Feed {
  title: string;
  link: string;
  description?: string;
  items: FeedItem[];
  lastBuildDate?: Date;
  language?: string;
  image?: {
    url: string;
    title?: string;
    link?: string;
  };
}

export interface FeedReader {
  fetch(): Promise<Feed>;
  subscribe(callback: (items: FeedItem[]) => void, pollInterval?: number): () => void;
}

// ============================================================================
// MCP (Model Context Protocol) Types
// ============================================================================

export interface MCPConfig extends IntegrationConfig {
  endpoint: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MCPMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface MCPRequest {
  messages: MCPMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: MCPTool[];
  toolChoice?: 'auto' | 'required' | { type: 'function'; function: { name: string } };
}

export interface MCPTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface MCPResponse {
  id: string;
  choices: Array<{
    message: MCPMessage;
    finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
    index: number;
  }>;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface MCPClient {
  chat(request: MCPRequest): Promise<MCPResponse>;
  stream(request: MCPRequest, onChunk: (chunk: string) => void): Promise<void>;
}

// ============================================================================
// OAuth 2.0 Types
// ============================================================================

export interface OAuthConfig extends IntegrationConfig {
  clientId: string;
  clientSecret?: string;
  authorizationUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

export interface OAuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
}

export interface OAuthClient {
  getAuthorizationUrl(state?: string): string;
  exchangeCode(code: string): Promise<OAuthTokenResponse>;
  refreshToken(refreshToken: string): Promise<OAuthTokenResponse>;
  revokeToken(token: string): Promise<void>;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookConfig {
  secret?: string;
  signatureHeader?: string;
  signatureAlgorithm?: 'sha1' | 'sha256' | 'sha512';
}

export interface WebhookPayload<T = unknown> {
  event: string;
  data: T;
  timestamp: number;
  signature?: string;
}

export interface WebhookHandler {
  verify(payload: string, signature: string, secret: string): Promise<boolean>;
  handle<T>(payload: WebhookPayload<T>, handler: (data: T) => void | Promise<void>): Promise<void>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsConfig extends IntegrationConfig {
  trackingId: string;
  debug?: boolean;
  anonymizeIp?: boolean;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface AnalyticsPageView {
  path: string;
  title?: string;
  referrer?: string;
}

export interface AnalyticsClient {
  pageView(page: AnalyticsPageView): void;
  event(event: AnalyticsEvent): void;
  setUser(userId: string): void;
  setProperty(name: string, value: string | number | boolean): void;
}

// ============================================================================
// Integration Registry
// ============================================================================

export type IntegrationType =
  | 'rest'
  | 'graphql'
  | 'grpc'
  | 'websocket'
  | 'sse'
  | 'feed'
  | 'mcp'
  | 'oauth'
  | 'webhook'
  | 'analytics';

export interface Integration<T = unknown> {
  type: IntegrationType;
  name: string;
  config: T;
  client: unknown;
}
