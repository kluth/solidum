import type { LogEntry, LogSubscriber, DebugMessage } from './types';

/**
 * Debug stream for real-time log monitoring
 */
export class DebugStream {
  private subscribers: Set<LogSubscriber> = new Set();
  private buffer: LogEntry[] = [];
  private maxBufferSize: number;
  private flushInterval?: number;
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(options: { maxBufferSize?: number; flushInterval?: number } = {}) {
    this.maxBufferSize = options.maxBufferSize ?? 100;
    this.flushInterval = options.flushInterval;

    if (this.flushInterval) {
      this.startAutoFlush();
    }
  }

  /**
   * Subscribe to the stream
   */
  subscribe(subscriber: LogSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  /**
   * Unsubscribe from the stream
   */
  unsubscribe(subscriber: LogSubscriber): void {
    this.subscribers.delete(subscriber);
  }

  /**
   * Push a log entry to the stream
   */
  push(entry: LogEntry): void {
    this.buffer.push(entry);

    // Notify subscribers immediately
    this.subscribers.forEach(subscriber => subscriber(entry));

    // Limit buffer size
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
  }

  /**
   * Push multiple entries
   */
  pushBatch(entries: LogEntry[]): void {
    entries.forEach(entry => this.push(entry));
  }

  /**
   * Get buffered entries
   */
  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  /**
   * Clear the buffer
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Flush buffer to all subscribers
   */
  flush(): void {
    if (this.buffer.length === 0) return;

    const entries = [...this.buffer];
    this.subscribers.forEach(subscriber => {
      entries.forEach(entry => subscriber(entry));
    });
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop auto-flush timer
   */
  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * Destroy the stream
   */
  destroy(): void {
    this.stopAutoFlush();
    this.subscribers.clear();
    this.buffer = [];
  }
}

/**
 * Server-Sent Events (SSE) stream for browser clients
 */
export class SSEDebugStream {
  private stream: DebugStream;
  private encoder = new TextEncoder();

  constructor(stream: DebugStream) {
    this.stream = stream;
  }

  /**
   * Create a ReadableStream for SSE
   */
  createStream(): ReadableStream<Uint8Array> {
    const encoder = this.encoder;
    const stream = this.stream;

    return new ReadableStream({
      start(controller) {
        // Send initial connection message
        const msg = `data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`;
        controller.enqueue(encoder.encode(msg));

        // Subscribe to log stream
        const unsubscribe = stream.subscribe((entry: LogEntry) => {
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
      cancel() {
        // Cleanup when stream is cancelled
      },
    });
  }
}

/**
 * WebSocket stream for bidirectional communication
 */
export class WebSocketDebugStream {
  private ws?: WebSocket;
  private stream: DebugStream;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(stream: DebugStream) {
    this.stream = stream;
  }

  /**
   * Connect to WebSocket server
   */
  connect(url: string): void {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;

      // Subscribe to stream and send logs
      this.stream.subscribe((entry: LogEntry) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const message: DebugMessage = {
            type: 'log',
            payload: entry,
            timestamp: Date.now(),
          };
          this.ws.send(JSON.stringify(message));
        }
      });
    };

    this.ws.onclose = () => {
      this.attemptReconnect(url);
    };

    this.ws.onerror = _error => {
      // WebSocket error - connection will be retried
    };

    this.ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data) as DebugMessage;
        this.handleMessage(message);
      } catch {
        // Failed to parse message
      }
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      setTimeout(() => {
        this.connect(url);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(_message: DebugMessage): void {
    // Handle commands from server
    // Could be extended to support server commands
  }
}
