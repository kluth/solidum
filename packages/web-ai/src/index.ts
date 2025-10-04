/**
 * @sldm/web-ai - Google Web AI (Gemini Nano) integration for Solidum
 *
 * Provides easy access to Chrome's built-in AI capabilities including:
 * - Language Model (text generation)
 * - Summarizer (text summarization)
 * - Writer (content generation)
 * - Rewriter (text rewriting)
 *
 * @example
 * ```ts
 * import { createWebAIClient } from '@sldm/web-ai';
 *
 * const client = createWebAIClient();
 *
 * if (client.isAvailable()) {
 *   const result = await client.generate('Write a haiku about coding');
 *   console.log(result);
 * }
 * ```
 *
 * @example Reactive usage
 * ```ts
 * import { useWebAI } from '@sldm/web-ai';
 *
 * const ai = useWebAI();
 *
 * await ai.generate('Explain quantum computing');
 * console.log(ai.result()); // Generated text
 * ```
 */

// Client
export { WebAIClient, createWebAIClient, isWebAIAvailable, getChromeAI } from './client';

// Reactive hooks
export { useWebAI, useWebAIStreaming } from './reactive';
export type { UseWebAIResult, UseWebAIStreamingResult } from './reactive';

// Types
export type {
  ChromeAI,
  AICapabilities,
  AISession,
  AISessionConfig,
  SummarizerCapabilities,
  SummarizerOptions,
  Summarizer,
  WriterCapabilities,
  WriterOptions,
  Writer,
  RewriterCapabilities,
  RewriterOptions,
  Rewriter,
} from './types';
