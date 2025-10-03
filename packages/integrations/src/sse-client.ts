import type { SSEClient, SSEConfig } from './types';

export function createSSEClient(config: SSEConfig): SSEClient {
  const { url, withCredentials = false, eventSourceInitDict } = config;

  let eventSource: EventSource | null = null;
  const eventHandlers: Map<string, Set<(data: MessageEvent) => void>> = new Map();

  return {
    connect(): void {
      if (eventSource) {
        return;
      }

      eventSource = new EventSource(url, {
        withCredentials,
        ...eventSourceInitDict,
      });

      // Set up existing handlers
      eventHandlers.forEach((handlers, event) => {
        handlers.forEach(handler => {
          eventSource?.addEventListener(event, handler as EventListener);
        });
      });
    },

    disconnect(): void {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    },

    on(event: string, handler: (data: MessageEvent) => void): () => void {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }

      eventHandlers.get(event)!.add(handler);

      if (eventSource) {
        eventSource.addEventListener(event, handler as EventListener);
      }

      return () => {
        eventHandlers.get(event)?.delete(handler);
        if (eventSource) {
          eventSource.removeEventListener(event, handler as EventListener);
        }
      };
    },

    isConnected(): boolean {
      return eventSource !== null && eventSource.readyState === EventSource.OPEN;
    },
  };
}
