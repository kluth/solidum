import type { MCPClient, MCPConfig, MCPRequest, MCPResponse } from './types';

export function createMCPClient(config: MCPConfig): MCPClient {
  const {
    endpoint,
    apiKey,
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 1000,
    timeout = 60000,
  } = config;

  return {
    async chat(request: MCPRequest): Promise<MCPResponse> {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || model,
          messages: request.messages,
          temperature: request.temperature ?? temperature,
          max_tokens: request.maxTokens ?? maxTokens,
          tools: request.tools,
          tool_choice: request.toolChoice,
        }),
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`MCP Error: ${error.error?.message || response.statusText}`);
      }

      return response.json();
    },

    async stream(request: MCPRequest, onChunk: (chunk: string) => void): Promise<void> {
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || model,
          messages: request.messages,
          temperature: request.temperature ?? temperature,
          max_tokens: request.maxTokens ?? maxTokens,
          stream: true,
        }),
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new Error(`MCP Stream Error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content;

                if (content) {
                  onChunk(content);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}
