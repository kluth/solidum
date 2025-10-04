import { atom, computed } from '@sldm/core';
import type { Atom, Computed } from '@sldm/core';

import { WebAIClient } from './client';
import type { AISessionConfig, SummarizerOptions, WriterOptions, RewriterOptions } from './types';

/**
 * Reactive Web AI hook
 */
export interface UseWebAIResult {
  isAvailable: Computed<boolean>;
  isLoading: Atom<boolean>;
  error: Atom<Error | null>;
  result: Atom<string | null>;
  generate: (prompt: string, config?: AISessionConfig) => Promise<void>;
  summarize: (text: string, options?: SummarizerOptions) => Promise<void>;
  write: (prompt: string, options?: WriterOptions) => Promise<void>;
  rewrite: (text: string, options?: RewriterOptions) => Promise<void>;
  clear: () => void;
}

/**
 * Use Web AI with Solidum reactivity
 */
export function useWebAI(): UseWebAIResult {
  const client = new WebAIClient();
  const isLoading = atom(false);
  const error = atom<Error | null>(null);
  const result = atom<string | null>(null);

  const isAvailable = computed(() => client.isAvailable());

  const generate = async (prompt: string, config?: AISessionConfig) => {
    isLoading(true);
    error(null);
    result(null);

    try {
      const text = await client.generate(prompt, config);
      result(text);
    } catch (err) {
      error(err instanceof Error ? err : new Error(String(err)));
    } finally {
      isLoading(false);
    }
  };

  const summarize = async (text: string, options?: SummarizerOptions) => {
    isLoading(true);
    error(null);
    result(null);

    try {
      const summary = await client.summarize(text, options);
      result(summary);
    } catch (err) {
      error(err instanceof Error ? err : new Error(String(err)));
    } finally {
      isLoading(false);
    }
  };

  const write = async (prompt: string, options?: WriterOptions) => {
    isLoading(true);
    error(null);
    result(null);

    try {
      const written = await client.write(prompt, options);
      result(written);
    } catch (err) {
      error(err instanceof Error ? err : new Error(String(err)));
    } finally {
      isLoading(false);
    }
  };

  const rewrite = async (text: string, options?: RewriterOptions) => {
    isLoading(true);
    error(null);
    result(null);

    try {
      const rewritten = await client.rewrite(text, options);
      result(rewritten);
    } catch (err) {
      error(err instanceof Error ? err : new Error(String(err)));
    } finally {
      isLoading(false);
    }
  };

  const clear = () => {
    result(null);
    error(null);
    isLoading(false);
  };

  return {
    isAvailable,
    isLoading,
    error,
    result,
    generate,
    summarize,
    write,
    rewrite,
    clear,
  };
}

/**
 * Streaming result handler
 */
export interface UseWebAIStreamingResult {
  isAvailable: Computed<boolean>;
  isStreaming: Atom<boolean>;
  error: Atom<Error | null>;
  chunks: Atom<string[]>;
  fullText: Computed<string>;
  generateStreaming: (prompt: string, config?: AISessionConfig) => Promise<void>;
  clear: () => void;
}

/**
 * Use Web AI with streaming support
 */
export function useWebAIStreaming(): UseWebAIStreamingResult {
  const client = new WebAIClient();
  const isStreaming = atom(false);
  const error = atom<Error | null>(null);
  const chunks = atom<string[]>([]);

  const isAvailable = computed(() => client.isAvailable());
  const fullText = computed(() => chunks().join(''));

  const generateStreaming = async (prompt: string, config?: AISessionConfig) => {
    isStreaming(true);
    error(null);
    chunks([]);

    try {
      const stream = await client.generateStreaming(prompt, config);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks([...chunks(), value]);
      }
    } catch (err) {
      error(err instanceof Error ? err : new Error(String(err)));
    } finally {
      isStreaming(false);
    }
  };

  const clear = () => {
    chunks([]);
    error(null);
    isStreaming(false);
  };

  return {
    isAvailable,
    isStreaming,
    error,
    chunks,
    fullText,
    generateStreaming,
    clear,
  };
}
