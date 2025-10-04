/**
 * Google Web AI (Gemini Nano) Types
 * Based on the Chrome Built-in AI API
 */

/**
 * AI capabilities available in the browser
 */
export interface AICapabilities {
  available: 'readily' | 'after-download' | 'no';
  supportsLanguage?: (language: string) => Promise<'readily' | 'after-download' | 'no'>;
}

/**
 * AI session configuration
 */
export interface AISessionConfig {
  temperature?: number;
  topK?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * AI session for text generation
 */
export interface AISession {
  prompt(text: string): Promise<string>;
  promptStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}

/**
 * AI text session options
 */
export interface AITextSessionOptions {
  temperature?: number;
  topK?: number;
}

/**
 * Summarizer capabilities
 */
export interface SummarizerCapabilities {
  available: 'readily' | 'after-download' | 'no';
  supportsType?: (type: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsFormat?: (format: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsLength?: (length: string) => Promise<'readily' | 'after-download' | 'no'>;
}

/**
 * Summarizer options
 */
export interface SummarizerOptions {
  type?: 'tl;dr' | 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}

/**
 * Summarizer session
 */
export interface Summarizer {
  summarize(text: string): Promise<string>;
  summarizeStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}

/**
 * Writer capabilities
 */
export interface WriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
  supportsTone?: (tone: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsFormat?: (format: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsLength?: (length: string) => Promise<'readily' | 'after-download' | 'no'>;
}

/**
 * Writer options
 */
export interface WriterOptions {
  tone?: 'formal' | 'neutral' | 'casual';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}

/**
 * Writer session
 */
export interface Writer {
  write(text: string): Promise<string>;
  writeStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}

/**
 * Rewriter capabilities
 */
export interface RewriterCapabilities {
  available: 'readily' | 'after-download' | 'no';
  supportsTone?: (tone: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsFormat?: (format: string) => Promise<'readily' | 'after-download' | 'no'>;
  supportsLength?: (length: string) => Promise<'readily' | 'after-download' | 'no'>;
}

/**
 * Rewriter options
 */
export interface RewriterOptions {
  tone?: 'as-is' | 'more-formal' | 'more-casual';
  format?: 'as-is' | 'plain-text' | 'markdown';
  length?: 'as-is' | 'shorter' | 'longer';
  sharedContext?: string;
}

/**
 * Rewriter session
 */
export interface Rewriter {
  rewrite(text: string): Promise<string>;
  rewriteStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}

/**
 * Chrome AI API interface
 */
export interface ChromeAI {
  // Language Model
  languageModel?: {
    capabilities(): Promise<AICapabilities>;
    create(options?: AISessionConfig): Promise<AISession>;
  };

  // Summarizer
  summarizer?: {
    capabilities(): Promise<SummarizerCapabilities>;
    create(options?: SummarizerOptions): Promise<Summarizer>;
  };

  // Writer
  writer?: {
    capabilities(): Promise<WriterCapabilities>;
    create(options?: WriterOptions): Promise<Writer>;
  };

  // Rewriter
  rewriter?: {
    capabilities(): Promise<RewriterCapabilities>;
    create(options?: RewriterOptions): Promise<Rewriter>;
  };
}

/**
 * Extended window interface with AI
 */
declare global {
  interface Window {
    ai?: ChromeAI;
  }
}
