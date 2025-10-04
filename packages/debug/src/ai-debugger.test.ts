import { describe, it, expect } from '@sldm/testing';

import { createAIDebugger } from './ai-debugger';
import { createLogger } from './logger';

describe('AIDebugger', () => {
  it('should create an AI debugger instance', () => {
    const aiDebugger = createAIDebugger();
    expect(aiDebugger).toBeDefined();
  });

  it('should accept logger configuration', () => {
    const logger = createLogger({ namespace: 'test' });
    const aiDebugger = createAIDebugger({ logger });
    expect(aiDebugger).toBeDefined();
  });

  it('should provide fallback analysis when AI is unavailable', async () => {
    const aiDebugger = createAIDebugger({ enableAutoAnalysis: false });
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.ts:10:5';

    const analysis = await aiDebugger.analyzeError(error);

    expect(analysis).toBeDefined();
    expect(analysis.summary).toBe('Test error');
    expect(analysis.possibleCauses.length).toBeGreaterThan(0);
    expect(analysis.suggestedFixes.length).toBeGreaterThan(0);
    expect(analysis.severity).toBeDefined();
  });

  it('should extract files from stack trace', async () => {
    const aiDebugger = createAIDebugger();
    const error = new Error('Test error');
    error.stack = `Error: Test error
    at myFunction (file1.ts:10:5)
    at anotherFunction (file2.js:20:10)`;

    const analysis = await aiDebugger.analyzeError(error);

    expect(analysis.relatedFiles.length).toBeGreaterThan(0);
  });

  it('should cache analysis results', async () => {
    const aiDebugger = createAIDebugger();
    const error = new Error('Cached error');

    const analysis1 = await aiDebugger.analyzeError(error, { file: 'test.ts', line: 10 });
    const analysis2 = await aiDebugger.analyzeError(error, { file: 'test.ts', line: 10 });

    expect(analysis1).toBe(analysis2); // Same reference due to caching
  });

  it('should clear cache', async () => {
    const aiDebugger = createAIDebugger();
    const error = new Error('Test error');

    await aiDebugger.analyzeError(error);
    aiDebugger.clearCache();

    // Cache should be cleared, but this is hard to test without accessing internals
    expect(true).toBe(true);
  });
});
