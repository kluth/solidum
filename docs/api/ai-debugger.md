# AI Debugger API Reference

Complete API documentation for @sldm/debug AI Debugger.

## Table of Contents

- [AIDebugger Class](#aidebugger-class)
- [createAIDebugger](#createaidebugger)
- [Types](#types)
- [Configuration](#configuration)

## AIDebugger Class

Main class for AI-powered debugging.

### Constructor

```typescript
new AIDebugger(config?: AIDebuggerConfig)
```

**Parameters:**

- `config` (optional): Configuration options

**Example:**

```typescript
const aiDebugger = new AIDebugger({
  logger: myLogger,
  enableAutoAnalysis: true,
  analysisThreshold: LogLevel.ERROR,
});
```

### Methods

#### isAvailable()

Check if AI debugging is available.

```typescript
isAvailable(): boolean
```

**Returns:** `true` if Web AI is available, `false` otherwise

**Example:**

```typescript
if (aiDebugger.isAvailable()) {
  console.log('AI debugging enabled');
}
```

---

#### analyzeError()

Analyze an error and get intelligent debugging insights.

```typescript
analyzeError(
  error: Error,
  context?: {
    code?: string;
    file?: string;
    line?: number;
    additionalInfo?: string;
  }
): Promise<ErrorAnalysis>
```

**Parameters:**

- `error`: The error to analyze
- `context` (optional): Additional context
  - `code`: Relevant code snippet
  - `file`: File path where error occurred
  - `line`: Line number where error occurred
  - `additionalInfo`: Any additional information

**Returns:** Promise<ErrorAnalysis>

**Example:**

```typescript
const analysis = await aiDebugger.analyzeError(error, {
  code: 'const user = data.user.profile;',
  file: 'UserProfile.tsx',
  line: 42,
  additionalInfo: 'User ID: 123',
});

console.log(analysis.summary);
console.log(analysis.possibleCauses);
console.log(analysis.suggestedFixes);
```

---

#### getDebugHints()

Get debugging hints for a code snippet.

```typescript
getDebugHints(
  code: string,
  issue?: string
): Promise<DebugHint[]>
```

**Parameters:**

- `code`: Code snippet to analyze
- `issue` (optional): Specific issue description

**Returns:** Promise<DebugHint[]>

**Example:**

```typescript
const hints = await aiDebugger.getDebugHints(
  `
  function fetchData() {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => console.log(data));
  }
`,
  'Missing error handling'
);

hints.forEach(hint => {
  console.log(`[${hint.type}] ${hint.message}`);
  console.log(`  ${hint.suggestion}`);
});
```

---

#### suggestFix()

Suggest a fix for an error.

```typescript
suggestFix(
  error: Error,
  code?: string
): Promise<{
  explanation: string;
  suggestedCode?: string;
}>
```

**Parameters:**

- `error`: The error to fix
- `code` (optional): Current code that caused the error

**Returns:** Promise with explanation and suggested code

**Example:**

```typescript
const fix = await aiDebugger.suggestFix(
  error,
  `
  const items = [1, 2, 3];
  const item = items[10].toString();
`
);

console.log(fix.explanation);
if (fix.suggestedCode) {
  console.log('Fixed code:', fix.suggestedCode);
}
```

---

#### explainCode()

Explain what a piece of code does.

```typescript
explainCode(code: string): Promise<string>
```

**Parameters:**

- `code`: Code snippet to explain

**Returns:** Promise<string> with explanation

**Example:**

```typescript
const explanation = await aiDebugger.explainCode(`
  const result = items
    .filter(x => x.active)
    .map(x => x.value * 2)
    .reduce((sum, val) => sum + val, 0);
`);

console.log(explanation);
```

---

#### clearCache()

Clear the analysis cache.

```typescript
clearCache(): void
```

**Example:**

```typescript
aiDebugger.clearCache();
```

---

## createAIDebugger

Factory function to create an AI debugger instance.

```typescript
function createAIDebugger(config?: AIDebuggerConfig): AIDebugger;
```

**Parameters:**

- `config` (optional): Configuration options

**Returns:** AIDebugger instance

**Example:**

```typescript
import { createAIDebugger } from '@sldm/debug';

const aiDebugger = createAIDebugger({
  enableAutoAnalysis: true,
  analysisThreshold: 4,
});
```

---

## Types

### AIDebuggerConfig

Configuration for AI debugger.

```typescript
interface AIDebuggerConfig {
  // Logger instance for integration
  logger?: Logger;

  // Enable automatic error analysis
  enableAutoAnalysis?: boolean;

  // Minimum log level for auto-analysis
  analysisThreshold?: LogLevel;

  // Maximum context lines to include
  maxContextLines?: number;

  // Include stack trace in analysis
  includeStackTrace?: boolean;
}
```

**Defaults:**

- `logger`: undefined
- `enableAutoAnalysis`: true
- `analysisThreshold`: 4 (ERROR level)
- `maxContextLines`: 10
- `includeStackTrace`: true

**Example:**

```typescript
const config: AIDebuggerConfig = {
  logger: myLogger,
  enableAutoAnalysis: true,
  analysisThreshold: LogLevel.ERROR,
  maxContextLines: 15,
  includeStackTrace: true,
};
```

---

### ErrorAnalysis

Result from error analysis.

```typescript
interface ErrorAnalysis {
  // Brief summary of the error
  summary: string;

  // Possible causes of the error
  possibleCauses: string[];

  // Suggested fixes
  suggestedFixes: string[];

  // Related files that might need checking
  relatedFiles: string[];

  // Error severity
  severity: 'low' | 'medium' | 'high' | 'critical';

  // AI confidence (0-1)
  confidence: number;
}
```

**Example:**

```typescript
const analysis: ErrorAnalysis = {
  summary: "TypeError: Cannot read property 'name' of undefined",
  possibleCauses: ['User object is undefined', 'Profile not loaded yet'],
  suggestedFixes: ['Add null check: if (!user) return', 'Use optional chaining: user?.name'],
  relatedFiles: ['UserProfile.tsx', 'api/users.ts'],
  severity: 'high',
  confidence: 0.85,
};
```

---

### DebugHint

A debugging hint from AI analysis.

```typescript
interface DebugHint {
  // Type of hint
  type: 'error' | 'warning' | 'performance' | 'pattern';

  // Hint message
  message: string;

  // Location (if applicable)
  location?: string;

  // Suggestion for improvement
  suggestion: string;

  // Code example (if applicable)
  code?: string;
}
```

**Example:**

```typescript
const hint: DebugHint = {
  type: 'performance',
  message: 'Multiple DOM updates in loop',
  location: 'UserList.tsx:45',
  suggestion: 'Batch DOM updates using document fragment',
  code: 'const fragment = document.createDocumentFragment();',
};
```

---

## Usage Patterns

### Basic Error Analysis

```typescript
import { createAIDebugger } from '@sldm/debug';

const aiDebugger = createAIDebugger();

try {
  // Some code that might throw
  riskyOperation();
} catch (error) {
  const analysis = await aiDebugger.analyzeError(error);
  console.error('Error:', analysis.summary);
  console.log('Try:', analysis.suggestedFixes[0]);
}
```

### With Logger Integration

```typescript
import { createLogger, createAIDebugger } from '@sldm/debug';
import { LogLevel } from '@sldm/debug';

const logger = createLogger({ namespace: 'app' });

const aiDebugger = createAIDebugger({
  logger,
  enableAutoAnalysis: true,
  analysisThreshold: LogLevel.ERROR,
});

// Errors logged at ERROR level or above
// will be automatically analyzed
logger.error('Failed to load user', error);
```

### Code Review

```typescript
const code = `
function processData(data) {
  return data.map(item => item.value * 2);
}
`;

const hints = await aiDebugger.getDebugHints(code);

hints.forEach(hint => {
  if (hint.type === 'error') {
    console.error(hint.message);
  }
});
```

### Smart Error Handling

```typescript
async function smartTryCatch<T>(fn: () => T, context?: string): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const analysis = await aiDebugger.analyzeError(error as Error, { additionalInfo: context });

    console.error('Error:', analysis.summary);
    console.log('Severity:', analysis.severity);
    console.log('Fixes:', analysis.suggestedFixes);

    if (analysis.severity === 'critical') {
      // Alert team
      notifyTeam(analysis);
    }

    return null;
  }
}

// Usage
const data = await smartTryCatch(() => fetchUserData(userId), 'Loading user profile');
```

## See Also

- [AI Debugger Guide](/docs/guide/ai-debugger.md)
- [Debug Logger API](/docs/api/debug.md)
- [Web AI API](/docs/api/web-ai.md)
