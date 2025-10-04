/**
 * AI Debugger Example
 *
 * Demonstrates how to use the AI-powered debugger to get intelligent
 * error analysis and debugging hints.
 */

import { createLogger } from '../src/logger';
import { createAIDebugger } from '../src/ai-debugger';

async function main() {
  // Create a logger
  const logger = createLogger({
    namespace: 'my-app',
    level: 2, // INFO
  });

  // Create AI debugger
  const aiDebugger = createAIDebugger({
    logger,
    enableAutoAnalysis: true,
    analysisThreshold: 4, // ERROR level
  });

  // Check if AI is available
  if (!aiDebugger.isAvailable()) {
    console.log(
      '⚠️  AI features not available. Make sure you are using Chrome 127+ with AI enabled.'
    );
    return;
  }

  console.log('🤖 AI Debugger initialized!\n');

  // Example 1: Analyze an error
  console.log('=== Example 1: Error Analysis ===\n');

  try {
    // Simulate an error
    const data = null;
    // @ts-expect-error - intentional error for demonstration
    const result = data.someMethod();
    console.log(result);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Caught an error', error);

      const analysis = await aiDebugger.analyzeError(error, {
        code: `
const data = null;
const result = data.someMethod();
console.log(result);
        `.trim(),
        file: 'example.ts',
        line: 42,
      });

      console.log('📊 AI Analysis:');
      console.log('Summary:', analysis.summary);
      console.log('Severity:', analysis.severity);
      console.log('\nPossible Causes:');
      analysis.possibleCauses.forEach((cause, i) => console.log(`  ${i + 1}. ${cause}`));
      console.log('\nSuggested Fixes:');
      analysis.suggestedFixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix}`));
      if (analysis.relatedFiles.length > 0) {
        console.log('\nRelated Files:', analysis.relatedFiles.join(', '));
      }
    }
  }

  console.log('\n=== Example 2: Get Debug Hints ===\n');

  const problematicCode = `
function fetchData() {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });
}
  `.trim();

  const hints = await aiDebugger.getDebugHints(problematicCode, 'Not handling errors properly');

  console.log('💡 Debug Hints:');
  hints.forEach((hint, i) => {
    console.log(`\n${i + 1}. [${hint.type.toUpperCase()}] ${hint.message}`);
    console.log(`   Suggestion: ${hint.suggestion}`);
  });

  console.log('\n=== Example 3: Suggest Fix ===\n');

  try {
    // Another common error
    const items = [1, 2, 3];
    // @ts-expect-error - intentional error
    const item = items[10].toString();
    console.log(item);
  } catch (error) {
    if (error instanceof Error) {
      const fix = await aiDebugger.suggestFix(
        error,
        `
const items = [1, 2, 3];
const item = items[10].toString();
console.log(item);
      `.trim()
      );

      console.log('🔧 Suggested Fix:');
      console.log(fix.explanation);
      if (fix.suggestedCode) {
        console.log('\nCorrected Code:');
        console.log('```typescript');
        console.log(fix.suggestedCode);
        console.log('```');
      }
    }
  }

  console.log('\n=== Example 4: Explain Code ===\n');

  const complexCode = `
const result = items
  .filter(x => x.value > 0)
  .map(x => ({ ...x, doubled: x.value * 2 }))
  .reduce((acc, x) => acc + x.doubled, 0);
  `.trim();

  const explanation = await aiDebugger.explainCode(complexCode);

  console.log('📖 Code Explanation:');
  console.log(explanation);

  console.log('\n=== Example 5: Auto-Analysis ===\n');

  // With auto-analysis enabled, errors logged at ERROR level
  // will be automatically analyzed
  try {
    throw new Error('Unexpected state: User data is undefined');
  } catch (error) {
    logger.error('Application error', error, {
      userId: 123,
      action: 'loadProfile',
      timestamp: Date.now(),
    });
  }

  // Wait a bit for auto-analysis to complete
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n✅ Examples completed!');
}

// Run examples
main().catch(console.error);
