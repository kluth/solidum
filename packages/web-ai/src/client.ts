import type {
  ChromeAI,
  AICapabilities,
  AISession,
  AISessionConfig,
  Summarizer,
  SummarizerOptions,
  Writer,
  WriterOptions,
  Rewriter,
  RewriterOptions,
} from './types';

/**
 * Check if Web AI is available in the browser
 */
export function isWebAIAvailable(): boolean {
  return typeof window !== 'undefined' && 'ai' in window && window.ai !== undefined;
}

/**
 * Get the Chrome AI API instance
 */
export function getChromeAI(): ChromeAI | null {
  if (!isWebAIAvailable()) {
    return null;
  }
  return window.ai ?? null;
}

/**
 * Web AI Client for Google's built-in AI
 */
export class WebAIClient {
  private ai: ChromeAI | null;

  constructor() {
    this.ai = getChromeAI();
  }

  /**
   * Check if the API is available
   */
  isAvailable(): boolean {
    return this.ai !== null;
  }

  /**
   * Check language model capabilities
   */
  async getLanguageModelCapabilities(): Promise<AICapabilities | null> {
    if (!this.ai?.languageModel) {
      return null;
    }
    return await this.ai.languageModel.capabilities();
  }

  /**
   * Create a language model session
   */
  async createLanguageModelSession(config?: AISessionConfig): Promise<AISession | null> {
    if (!this.ai?.languageModel) {
      throw new Error('Language model is not available');
    }

    const capabilities = await this.ai.languageModel.capabilities();
    if (capabilities.available === 'no') {
      throw new Error('Language model is not available in this browser');
    }

    if (capabilities.available === 'after-download') {
      console.warn('Language model will be downloaded before use');
    }

    return await this.ai.languageModel.create(config);
  }

  /**
   * Generate text using the language model
   */
  async generate(prompt: string, config?: AISessionConfig): Promise<string> {
    const session = await this.createLanguageModelSession(config);
    if (!session) {
      throw new Error('Failed to create language model session');
    }

    try {
      return await session.prompt(prompt);
    } finally {
      session.destroy();
    }
  }

  /**
   * Generate text with streaming
   */
  async generateStreaming(
    prompt: string,
    config?: AISessionConfig
  ): Promise<ReadableStream<string>> {
    const session = await this.createLanguageModelSession(config);
    if (!session) {
      throw new Error('Failed to create language model session');
    }

    return session.promptStreaming(prompt);
  }

  /**
   * Create a summarizer session
   */
  async createSummarizer(options?: SummarizerOptions): Promise<Summarizer | null> {
    if (!this.ai?.summarizer) {
      throw new Error('Summarizer is not available');
    }

    const capabilities = await this.ai.summarizer.capabilities();
    if (capabilities.available === 'no') {
      throw new Error('Summarizer is not available in this browser');
    }

    if (capabilities.available === 'after-download') {
      console.warn('Summarizer will be downloaded before use');
    }

    return await this.ai.summarizer.create(options);
  }

  /**
   * Summarize text
   */
  async summarize(text: string, options?: SummarizerOptions): Promise<string> {
    const summarizer = await this.createSummarizer(options);
    if (!summarizer) {
      throw new Error('Failed to create summarizer');
    }

    try {
      return await summarizer.summarize(text);
    } finally {
      summarizer.destroy();
    }
  }

  /**
   * Create a writer session
   */
  async createWriter(options?: WriterOptions): Promise<Writer | null> {
    if (!this.ai?.writer) {
      throw new Error('Writer is not available');
    }

    const capabilities = await this.ai.writer.capabilities();
    if (capabilities.available === 'no') {
      throw new Error('Writer is not available in this browser');
    }

    if (capabilities.available === 'after-download') {
      console.warn('Writer will be downloaded before use');
    }

    return await this.ai.writer.create(options);
  }

  /**
   * Generate written content
   */
  async write(prompt: string, options?: WriterOptions): Promise<string> {
    const writer = await this.createWriter(options);
    if (!writer) {
      throw new Error('Failed to create writer');
    }

    try {
      return await writer.write(prompt);
    } finally {
      writer.destroy();
    }
  }

  /**
   * Create a rewriter session
   */
  async createRewriter(options?: RewriterOptions): Promise<Rewriter | null> {
    if (!this.ai?.rewriter) {
      throw new Error('Rewriter is not available');
    }

    const capabilities = await this.ai.rewriter.capabilities();
    if (capabilities.available === 'no') {
      throw new Error('Rewriter is not available in this browser');
    }

    if (capabilities.available === 'after-download') {
      console.warn('Rewriter will be downloaded before use');
    }

    return await this.ai.rewriter.create(options);
  }

  /**
   * Rewrite text
   */
  async rewrite(text: string, options?: RewriterOptions): Promise<string> {
    const rewriter = await this.createRewriter(options);
    if (!rewriter) {
      throw new Error('Failed to create rewriter');
    }

    try {
      return await rewriter.rewrite(text);
    } finally {
      rewriter.destroy();
    }
  }
}

/**
 * Create a Web AI client instance
 */
export function createWebAIClient(): WebAIClient {
  return new WebAIClient();
}
