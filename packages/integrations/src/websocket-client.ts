import type { WebSocketClient, WebSocketConfig, WebSocketEventType } from './types';

export function createWebSocketClient(config: WebSocketConfig): WebSocketClient {
  const {
    url,
    protocols,
    reconnect = false,
    reconnectInterval = 1000,
    maxReconnectAttempts = Infinity,
  } = config;

  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  const eventHandlers: Map<WebSocketEventType, Set<(data?: unknown) => void>> = new Map();

  function setupWebSocket(socket: WebSocket): void {
    socket.onopen = () => {
      reconnectAttempts = 0;
      triggerEvent('open');
    };

    socket.onmessage = event => {
      triggerEvent('message', event.data);
    };

    socket.onerror = event => {
      triggerEvent('error', event);
    };

    socket.onclose = () => {
      triggerEvent('close');
      ws = null;

      if (reconnect && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        reconnectTimeout = setTimeout(() => {
          connect();
        }, reconnectInterval * reconnectAttempts);
      }
    };
  }

  function triggerEvent(event: WebSocketEventType, data?: unknown): void {
    const handlers = eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  async function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url, protocols);
        setupWebSocket(ws);

        const openHandler = () => {
          ws?.removeEventListener('open', openHandler);
          ws?.removeEventListener('error', errorHandler);
          resolve();
        };

        const errorHandler = (_event: Event) => {
          ws?.removeEventListener('open', openHandler);
          ws?.removeEventListener('error', errorHandler);
          reject(new Error('WebSocket connection failed'));
        };

        ws.addEventListener('open', openHandler);
        ws.addEventListener('error', errorHandler);
      } catch (error) {
        reject(error);
      }
    });
  }

  return {
    connect,

    disconnect(): void {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }

      if (ws) {
        ws.close();
        ws = null;
      }
    },

    send(data: string | ArrayBuffer | Blob): void {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket is not connected');
      }

      ws.send(data);
    },

    on(event: WebSocketEventType, handler: (data?: unknown) => void): () => void {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }

      eventHandlers.get(event)!.add(handler);

      return () => {
        eventHandlers.get(event)?.delete(handler);
      };
    },

    isConnected(): boolean {
      return ws !== null && ws.readyState === WebSocket.OPEN;
    },
  };
}
