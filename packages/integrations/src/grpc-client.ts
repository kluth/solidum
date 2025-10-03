import type { GRPCClient, GRPCConfig } from './types';

/**
 * gRPC client implementation
 *
 * Note: This is a stub implementation. For full gRPC support in the browser,
 * you would need to use grpc-web with a proxy server, or use a library like
 * @improbable-eng/grpc-web or @grpc/grpc-js (Node.js only).
 *
 * For production use, integrate with your preferred gRPC library:
 * - Browser: @improbable-eng/grpc-web with Envoy proxy
 * - Node.js: @grpc/grpc-js with proto-loader
 */
export function createGRPCClient(_config: GRPCConfig): GRPCClient {
  return {
    async unary<TRequest, TResponse>(_method: string, _request: TRequest): Promise<TResponse> {
      throw new Error(
        'gRPC client not implemented. Please integrate @grpc/grpc-js or @improbable-eng/grpc-web for full support.'
      );
    },

    serverStream<TRequest, TResponse>(
      _method: string,
      _request: TRequest,
      _onData: (data: TResponse) => void
    ): () => void {
      throw new Error(
        'gRPC client not implemented. Please integrate @grpc/grpc-js or @improbable-eng/grpc-web for full support.'
      );
    },

    clientStream<TRequest, TResponse>(
      _method: string,
      _onEnd: (response: TResponse) => void
    ): (data: TRequest) => void {
      throw new Error(
        'gRPC client not implemented. Please integrate @grpc/grpc-js or @improbable-eng/grpc-web for full support.'
      );
    },

    bidiStream<TRequest, TResponse>(
      _method: string,
      _onData: (data: TResponse) => void
    ): (data: TRequest) => void {
      throw new Error(
        'gRPC client not implemented. Please integrate @grpc/grpc-js or @improbable-eng/grpc-web for full support.'
      );
    },
  };
}

/**
 * Example usage with @grpc/grpc-js (Node.js):
 *
 * ```typescript
 * import * as grpc from '@grpc/grpc-js';
 * import * as protoLoader from '@grpc/proto-loader';
 *
 * const packageDefinition = protoLoader.loadSync('path/to/proto', {
 *   keepCase: true,
 *   longs: String,
 *   enums: String,
 *   defaults: true,
 *   oneofs: true
 * });
 *
 * const proto = grpc.loadPackageDefinition(packageDefinition);
 * const client = new proto.YourService('localhost:50051', grpc.credentials.createInsecure());
 * ```
 *
 * Example usage with @improbable-eng/grpc-web (Browser):
 *
 * ```typescript
 * import { grpc } from '@improbable-eng/grpc-web';
 * import { YourService } from './generated/proto_pb_service';
 *
 * const client = new YourService('https://your-api.com');
 *
 * grpc.unary(YourService.YourMethod, {
 *   request: yourRequest,
 *   host: 'https://your-api.com',
 *   onEnd: (response) => {
 *     // Handle response
 *   }
 * });
 * ```
 */
