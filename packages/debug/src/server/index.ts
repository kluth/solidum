/**
 * Debug API server for external tools
 *
 * Note: This is a browser-compatible implementation.
 * For Node.js server, you would need to use http/https modules.
 */

import { Logger } from '../logger';
import { DebugStream } from '../stream';
import type { LogEntry, DebugMessage } from '../types';

/**
 * Debug API configuration
 */
export interface DebugAPIConfig {
  port?: number;
  cors?: boolean;
  allowedOrigins?: string[];
}

/**
 * Debug API server
 * Provides HTTP endpoints for external debugging tools
 */
export class DebugAPI {
  private logger: Logger;
  private stream: DebugStream;
  private config: Required<DebugAPIConfig>;

  constructor(logger: Logger, stream: DebugStream, config: DebugAPIConfig = {}) {
    this.logger = logger;
    this.stream = stream;
    this.config = {
      port: config.port ?? 9229,
      cors: config.cors ?? true,
      allowedOrigins: config.allowedOrigins ?? ['*'],
    };
  }

  /**
   * Create a fetch handler for the debug API
   * Can be used with service workers or server frameworks
   */
  createHandler() {
    return async (request: Request): Promise<Response> => {
      const url = new URL(request.url);
      const path = url.pathname;

      // CORS headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.config.cors) {
        headers['Access-Control-Allow-Origin'] = this.config.allowedOrigins[0];
        headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
      }

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
      }

      try {
        // Route handlers
        if (path === '/logs') {
          return this.handleLogs(request, headers);
        } else if (path === '/logs/stream') {
          return this.handleLogsStream(headers);
        } else if (path === '/logs/clear') {
          return this.handleLogsClear(headers);
        } else if (path === '/health') {
          return this.handleHealth(headers);
        } else {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers,
          });
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: error instanceof Error ? error.message : 'Internal server error',
          }),
          { status: 500, headers }
        );
      }
    };
  }

  /**
   * Handle GET /logs - Get all logs
   */
  private handleLogs(request: Request, headers: HeadersInit): Response {
    const url = new URL(request.url);
    const level = url.searchParams.get('level');
    const namespace = url.searchParams.get('namespace');
    const limit = parseInt(url.searchParams.get('limit') ?? '100');

    let entries = this.logger.getEntries();

    if (level !== null) {
      entries = entries.filter(e => e.level >= parseInt(level));
    }

    if (namespace) {
      entries = entries.filter(e => e.namespace.includes(namespace));
    }

    entries = entries.slice(-limit);

    return new Response(JSON.stringify({ logs: entries }), { headers });
  }

  /**
   * Handle GET /logs/stream - Stream logs via SSE
   */
  private handleLogsStream(headers: HeadersInit): Response {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start: controller => {
        // Send initial message
        const initMsg = `data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`;
        controller.enqueue(encoder.encode(initMsg));

        // Subscribe to log stream
        const unsubscribe = this.stream.subscribe((entry: LogEntry) => {
          const message: DebugMessage = {
            type: 'log',
            payload: entry,
            timestamp: Date.now(),
          };
          const data = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(encoder.encode(data));
        });

        // Cleanup on close
        return () => {
          unsubscribe();
        };
      },
    });

    return new Response(stream, {
      headers: {
        ...headers,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  /**
   * Handle POST /logs/clear - Clear all logs
   */
  private handleLogsClear(headers: HeadersInit): Response {
    this.logger.clear();
    return new Response(JSON.stringify({ success: true }), { headers });
  }

  /**
   * Handle GET /health - Health check
   */
  private handleHealth(headers: HeadersInit): Response {
    return new Response(
      JSON.stringify({
        status: 'ok',
        timestamp: Date.now(),
        version: '0.1.0',
      }),
      { headers }
    );
  }
}

/**
 * Create a debug API instance
 */
export function createDebugAPI(
  logger: Logger,
  stream: DebugStream,
  config?: DebugAPIConfig
): DebugAPI {
  return new DebugAPI(logger, stream, config);
}
