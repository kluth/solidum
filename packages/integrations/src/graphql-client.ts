import type { GraphQLClient, GraphQLConfig, GraphQLRequest, GraphQLResponse } from './types';

export function createGraphQLClient(config: GraphQLConfig): GraphQLClient {
  const { endpoint, headers = {}, timeout = 30000 } = config;

  async function executeRequest<T>(request: GraphQLRequest): Promise<T> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(`GraphQL HTTP ${response.status}: ${response.statusText}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL Error: ${result.errors[0].message}`);
    }

    if (!result.data) {
      throw new Error('GraphQL response has no data');
    }

    return result.data;
  }

  return {
    async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
      return executeRequest<T>({
        query,
        variables,
        operationName: extractOperationName(query),
      });
    },

    async mutate<T>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
      return executeRequest<T>({
        query: mutation,
        variables,
        operationName: extractOperationName(mutation),
      });
    },

    subscribe<T>(
      _subscription: string,
      _variables?: Record<string, unknown>,
      _callback?: (data: T) => void
    ): () => void {
      // WebSocket-based subscriptions would be implemented here
      // For now, return a no-op unsubscribe function
      return () => {
        // Cleanup subscription
      };
    },
  };
}

function extractOperationName(query: string): string | undefined {
  const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/);
  return match?.[1];
}
