import type { Logger } from './logger';
import type { LogEntry, LogLevel } from './types';

/**
 * Web AI interface (imported dynamically to avoid hard dependency)
 */
interface WebAIClient {
  isAvailable(): boolean;
  generate(prompt: string): Promise<string>;
}

/**
 * Error analysis result from AI
 */
export interface ErrorAnalysis {
  summary: string;
  possibleCauses: string[];
  suggestedFixes: string[];
  relatedFiles: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

/**
 * Debug hint from AI analysis
 */
export interface DebugHint {
  type: 'error' | 'warning' | 'performance' | 'pattern';
  message: string;
  location?: string;
  suggestion: string;
  code?: string;
}

/**
 * AI-powered intelligent debugger configuration
 */
export interface AIDebuggerConfig {
  logger?: Logger;
  enableAutoAnalysis?: boolean;
  analysisThreshold?: LogLevel;
  maxContextLines?: number;
  includeStackTrace?: boolean;
}

/**
 * Intelligent debugger that uses Web AI to provide smart error analysis and debugging hints
 */
export class AIDebugger {
  private config: Required<AIDebuggerConfig>;
  private aiClient: WebAIClient | null = null;
  private analysisCache = new Map<string, ErrorAnalysis>();

  constructor(config: AIDebuggerConfig = {}) {
    this.config = {
      logger: config.logger ?? (null as unknown as Logger),
      enableAutoAnalysis: config.enableAutoAnalysis ?? true,
      analysisThreshold: config.analysisThreshold ?? 4, // ERROR level
      maxContextLines: config.maxContextLines ?? 10,
      includeStackTrace: config.includeStackTrace ?? true,
    };

    // Try to initialize Web AI client
    this.initializeAI();

    // Subscribe to logger if provided
    if (this.config.logger) {
      this.config.logger.subscribe(entry => this.handleLogEntry(entry));
    }
  }

  /**
   * Initialize Web AI client
   */
  private async initializeAI(): Promise<void> {
    try {
      // Dynamic import to avoid hard dependency
      const { createWebAIClient } = await import('@sldm/web-ai');
      this.aiClient = createWebAIClient();

      if (!this.aiClient.isAvailable()) {
        console.warn(
          '⚠️  Web AI not available. AI-powered debugging features disabled.\n' +
            'To enable: Use Chrome 127+ with AI features enabled.'
        );
        this.aiClient = null;
      }
    } catch {
      console.warn('⚠️  @sldm/web-ai not installed. AI debugging features disabled.');
      this.aiClient = null;
    }
  }

  /**
   * Check if AI debugging is available
   */
  isAvailable(): boolean {
    return this.aiClient !== null;
  }

  /**
   * Analyze an error and get intelligent debugging hints
   */
  async analyzeError(
    error: Error,
    context?: { code?: string; file?: string; line?: number; additionalInfo?: string }
  ): Promise<ErrorAnalysis> {
    if (!this.isAvailable()) {
      return this.getFallbackAnalysis(error);
    }

    // Check cache
    const cacheKey = this.getCacheKey(error, context);
    const cached = this.analysisCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const prompt = this.buildAnalysisPrompt(error, context);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await this.aiClient!.generate(prompt);

      const analysis = this.parseAnalysisResponse(response, error);

      // Cache the result
      this.analysisCache.set(cacheKey, analysis);

      return analysis;
    } catch (aiError) {
      console.error('Failed to analyze error with AI:', aiError);
      return this.getFallbackAnalysis(error);
    }
  }

  /**
   * Get debugging hints for a code snippet
   */
  async getDebugHints(code: string, issue?: string): Promise<DebugHint[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const prompt = this.buildHintsPrompt(code, issue);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await this.aiClient!.generate(prompt);

      return this.parseHintsResponse(response);
    } catch (error) {
      console.error('Failed to get debug hints:', error);
      return [];
    }
  }

  /**
   * Suggest a fix for an error
   */
  async suggestFix(
    error: Error,
    code?: string
  ): Promise<{ explanation: string; suggestedCode?: string }> {
    if (!this.isAvailable()) {
      return {
        explanation: 'AI suggestions unavailable. Please check the error message and stack trace.',
      };
    }

    try {
      const prompt = this.buildFixPrompt(error, code);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await this.aiClient!.generate(prompt);

      return this.parseFixResponse(response);
    } catch (aiError) {
      console.error('Failed to suggest fix:', aiError);
      return { explanation: 'Unable to generate fix suggestion.' };
    }
  }

  /**
   * Explain what a piece of code does (useful for debugging unknown code)
   */
  async explainCode(code: string): Promise<string> {
    if (!this.isAvailable()) {
      return 'AI code explanation unavailable.';
    }

    try {
      const prompt = `Explain what this code does in simple terms, focusing on potential issues or bugs:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\nProvide a brief explanation.`;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return await this.aiClient!.generate(prompt);
    } catch (error) {
      console.error('Failed to explain code:', error);
      return 'Unable to generate explanation.';
    }
  }

  /**
   * Handle log entries automatically
   */
  private async handleLogEntry(entry: LogEntry): Promise<void> {
    if (!this.config.enableAutoAnalysis) {
      return;
    }

    if (entry.level >= this.config.analysisThreshold) {
      const errorFromEntry = this.extractErrorFromEntry(entry);
      if (errorFromEntry) {
        const analysis = await this.analyzeError(errorFromEntry, {
          additionalInfo: `Context: ${JSON.stringify(entry.context)}`,
        });

        // Log the analysis
        if (this.config.logger) {
          this.config.logger.info('🤖 AI Error Analysis', {
            originalError: entry.message,
            analysis,
          });
        }
      }
    }
  }

  /**
   * Build analysis prompt for AI
   */
  private buildAnalysisPrompt(
    error: Error,
    context?: { code?: string; file?: string; line?: number; additionalInfo?: string }
  ): string {
    let prompt = `Analyze this JavaScript/TypeScript error and provide debugging insights:

Error: ${error.message}
${error.stack ? `\nStack Trace:\n${error.stack}` : ''}
`;

    if (context?.code) {
      prompt += `\n\nCode Context:\n\`\`\`typescript\n${context.code}\n\`\`\``;
    }

    if (context?.file) {
      prompt += `\n\nFile: ${context.file}${context.line ? `:${context.line}` : ''}`;
    }

    if (context?.additionalInfo) {
      prompt += `\n\nAdditional Info: ${context.additionalInfo}`;
    }

    prompt += `\n\nProvide:
1. A brief summary of the error
2. 2-3 possible causes
3. 2-3 suggested fixes
4. Which files or areas to check
5. Severity (low/medium/high/critical)

Keep it concise and actionable.`;

    return prompt;
  }

  /**
   * Build hints prompt for AI
   */
  private buildHintsPrompt(code: string, issue?: string): string {
    let prompt = `Review this code and provide debugging hints:\n\n\`\`\`typescript\n${code}\n\`\`\``;

    if (issue) {
      prompt += `\n\nSpecific Issue: ${issue}`;
    }

    prompt += `\n\nProvide 2-5 debugging hints about:
- Potential bugs or errors
- Performance issues
- Best practices violations
- Common patterns that might cause problems

Format each hint as: TYPE | Message | Suggestion`;

    return prompt;
  }

  /**
   * Build fix prompt for AI
   */
  private buildFixPrompt(error: Error, code?: string): string {
    let prompt = `Suggest a fix for this error:\n\nError: ${error.message}`;

    if (code) {
      prompt += `\n\nCurrent Code:\n\`\`\`typescript\n${code}\n\`\`\``;
    }

    prompt += `\n\nProvide:
1. Explanation of the fix
2. Corrected code (if applicable)

Be specific and practical.`;

    return prompt;
  }

  /**
   * Parse analysis response from AI
   */
  private parseAnalysisResponse(response: string, error: Error): ErrorAnalysis {
    // Simple parsing - in production you might want more sophisticated parsing
    const lines = response.split('\n').filter(l => l.trim());

    const summary =
      lines
        .find(l => l.toLowerCase().includes('summary'))
        ?.split(':')[1]
        ?.trim() || error.message;

    const possibleCauses = this.extractListItems(response, 'cause');
    const suggestedFixes = this.extractListItems(response, 'fix');
    const relatedFiles = this.extractListItems(response, 'file');

    const severityMatch = response.toLowerCase().match(/severity[:\s]*(low|medium|high|critical)/);
    const severity = (severityMatch?.[1] as ErrorAnalysis['severity']) || 'medium';

    return {
      summary,
      possibleCauses: possibleCauses.length > 0 ? possibleCauses : ['Unknown cause'],
      suggestedFixes: suggestedFixes.length > 0 ? suggestedFixes : ['Review error message'],
      relatedFiles: relatedFiles.length > 0 ? relatedFiles : [],
      severity,
      confidence: 0.8,
    };
  }

  /**
   * Parse hints response from AI
   */
  private parseHintsResponse(response: string): DebugHint[] {
    const hints: DebugHint[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 3) {
          hints.push({
            type: this.parseHintType(parts[0]),
            message: parts[1],
            suggestion: parts[2],
          });
        }
      }
    }

    return hints;
  }

  /**
   * Parse fix response from AI
   */
  private parseFixResponse(response: string): { explanation: string; suggestedCode?: string } {
    const codeBlockMatch = response.match(/```(?:typescript|javascript|ts|js)?\n([\s\S]*?)\n```/);
    const suggestedCode = codeBlockMatch?.[1];

    const explanation = response
      .replace(/```(?:typescript|javascript|ts|js)?[\s\S]*?```/g, '')
      .trim();

    return {
      explanation,
      suggestedCode,
    };
  }

  /**
   * Extract list items from response
   */
  private extractListItems(text: string, keyword: string): string[] {
    const items: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.toLowerCase().includes(keyword) &&
        (trimmed.match(/^[\d-*•]+\.?\s/) || trimmed.includes(':'))
      ) {
        const item = trimmed
          .replace(/^[\d-*•]+\.?\s*/, '')
          .split(':')
          .pop()
          ?.trim();
        if (item) {
          items.push(item);
        }
      }
    }

    return items;
  }

  /**
   * Parse hint type from string
   */
  private parseHintType(type: string): DebugHint['type'] {
    const lower = type.toLowerCase();
    if (lower.includes('error')) return 'error';
    if (lower.includes('warn')) return 'warning';
    if (lower.includes('perf')) return 'performance';
    return 'pattern';
  }

  /**
   * Get cache key for error
   */
  private getCacheKey(
    error: Error,
    context?: { code?: string; file?: string; line?: number }
  ): string {
    return `${error.message}_${context?.file || ''}_${context?.line || ''}`;
  }

  /**
   * Extract error from log entry
   */
  private extractErrorFromEntry(entry: LogEntry): Error | null {
    if (entry.data instanceof Error) {
      return entry.data;
    }

    if (entry.stack) {
      const error = new Error(entry.message);
      error.stack = entry.stack;
      return error;
    }

    return null;
  }

  /**
   * Get fallback analysis when AI is unavailable
   */
  private getFallbackAnalysis(error: Error): ErrorAnalysis {
    return {
      summary: error.message,
      possibleCauses: ['Check the error message and stack trace for details'],
      suggestedFixes: [
        'Review the code at the error location',
        'Check for typos and syntax errors',
      ],
      relatedFiles: this.extractFilesFromStack(error.stack),
      severity: 'medium',
      confidence: 0.5,
    };
  }

  /**
   * Extract file paths from stack trace
   */
  private extractFilesFromStack(stack?: string): string[] {
    if (!stack) return [];

    const fileRegex = /(?:at\s+.*?\s+\()?([^():\s]+\.[jt]sx?):(\d+):(\d+)/g;
    const files = new Set<string>();
    let match;

    while ((match = fileRegex.exec(stack)) !== null) {
      files.add(match[1]);
    }

    return Array.from(files);
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
  }
}

/**
 * Create an AI debugger instance
 */
export function createAIDebugger(config?: AIDebuggerConfig): AIDebugger {
  return new AIDebugger(config);
}
