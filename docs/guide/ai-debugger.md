# AI Debugger Guide

Der @sldm/debug AI Debugger kombiniert die Leistungsfähigkeit von Web AI (Gemini Nano) mit traditionellen Debugging-Tools, um intelligente Fehleranalyse und Debugging-Hinweise zu bieten.

## Inhaltsverzeichnis

- [Installation](#installation)
- [Grundkonzepte](#grundkonzepte)
- [Erste Schritte](#erste-schritte)
- [Fehleranalyse](#fehleranalyse)
- [Debug-Hinweise](#debug-hinweise)
- [Fix-Vorschläge](#fix-vorschläge)
- [Code-Erklärungen](#code-erklärungen)
- [Auto-Analyse](#auto-analyse)
- [Erweiterte Beispiele](#erweiterte-beispiele)

## Installation

```bash
pnpm add @sldm/debug @sldm/web-ai
# oder
solidum add debug web-ai
```

## Grundkonzepte

Der AI Debugger nutzt Google Chrome's eingebaute Gemini Nano KI, um:

- Fehler automatisch zu analysieren
- Mögliche Ursachen zu identifizieren
- Konkrete Lösungsvorschläge zu geben
- Code-Snippets zu erklären
- Performance-Probleme zu erkennen

**Voraussetzungen:**

- Chrome 127+ mit aktivierter AI-Funktionalität
- @sldm/web-ai Package installiert

## Erste Schritte

### Basis-Setup

```typescript
import { createAIDebugger } from '@sldm/debug';

// Erstelle AI Debugger
const aiDebugger = createAIDebugger();

// Prüfe Verfügbarkeit
if (aiDebugger.isAvailable()) {
  console.log('🤖 AI Debugging aktiviert!');
} else {
  console.log('⚠️ AI nicht verfügbar - Fallback aktiv');
}
```

### Mit Logger-Integration

```typescript
import { createLogger } from '@sldm/debug';
import { createAIDebugger } from '@sldm/debug';

const logger = createLogger({ namespace: 'app' });

const aiDebugger = createAIDebugger({
  logger,
  enableAutoAnalysis: true, // Automatische Fehleranalyse
  analysisThreshold: 4, // Nur ERROR-Level und höher
});
```

## Fehleranalyse

### Basis-Fehleranalyse

```typescript
try {
  const user = null;
  // @ts-expect-error - Demo-Fehler
  const name = user.getName();
} catch (error) {
  const analysis = await aiDebugger.analyzeError(error);

  console.log('Summary:', analysis.summary);
  console.log('Severity:', analysis.severity);
  console.log('Possible Causes:', analysis.possibleCauses);
  console.log('Suggested Fixes:', analysis.suggestedFixes);
  console.log('Related Files:', analysis.relatedFiles);
}
```

### Mit Code-Kontext

```typescript
try {
  // Fehler im Code
  throw new Error('Cannot read property of undefined');
} catch (error) {
  const analysis = await aiDebugger.analyzeError(error, {
    code: `
const user = getUserById(id);
const profile = user.profile.name;
    `,
    file: 'components/UserProfile.tsx',
    line: 42,
    additionalInfo: 'User ID: 123, Route: /profile',
  });

  // AI liefert kontextbasierte Analyse
  analysis.possibleCauses.forEach((cause, i) => {
    console.log(`${i + 1}. ${cause}`);
  });
}
```

### Beispiel-Output

```typescript
{
  summary: "TypeError: Cannot read properties of undefined (reading 'name')",
  possibleCauses: [
    "getUserById returned undefined - user not found in database",
    "user.profile is undefined - profile not loaded",
    "Async timing issue - profile still loading when accessed"
  ],
  suggestedFixes: [
    "Add null check: if (!user?.profile) return null",
    "Use optional chaining: user?.profile?.name",
    "Add error boundary with loading state"
  ],
  relatedFiles: ['components/UserProfile.tsx', 'api/users.ts'],
  severity: 'high',
  confidence: 0.85
}
```

## Debug-Hinweise

### Code-Review-Hinweise erhalten

```typescript
const code = `
function fetchUserData(id) {
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      updateUI(data);
    });
}
`;

const hints = await aiDebugger.getDebugHints(code, 'Not handling errors properly');

hints.forEach(hint => {
  console.log(`[${hint.type}] ${hint.message}`);
  console.log(`  → ${hint.suggestion}`);
});
```

### Beispiel-Output

```
[error] Missing error handling in Promise chain
  → Add .catch() handler to handle fetch failures

[performance] Multiple DOM updates without batching
  → Consider using requestAnimationFrame or batch updates

[warning] No TypeScript types for API response
  → Define interface for user data structure
```

## Fix-Vorschläge

### Automatische Fix-Generierung

```typescript
try {
  const items = [1, 2, 3];
  // @ts-expect-error - Demo
  const item = items[10].toString();
} catch (error) {
  const fix = await aiDebugger.suggestFix(
    error,
    `
const items = [1, 2, 3];
const item = items[10].toString();
console.log(item);
  `
  );

  console.log('Explanation:', fix.explanation);

  if (fix.suggestedCode) {
    console.log('Corrected Code:');
    console.log(fix.suggestedCode);
  }
}
```

### Beispiel-Output

````
Explanation: Array index out of bounds. items[10] is undefined,
calling toString() on undefined causes TypeError.

Corrected Code:
```typescript
const items = [1, 2, 3];
const index = 10;
const item = items[index];

if (item !== undefined) {
  console.log(item.toString());
} else {
  console.log('Item not found at index', index);
}
```\`

## Code-Erklärungen

### Unbekannten Code verstehen

```typescript
const complexCode = `
const memoized = useMemo(() => {
  return items
    .filter(x => x.active && x.score > threshold)
    .map(x => ({
      ...x,
      normalized: (x.score - min) / (max - min)
    }))
    .sort((a, b) => b.normalized - a.normalized)
    .slice(0, 10);
}, [items, threshold, min, max]);
`;

const explanation = await aiDebugger.explainCode(complexCode);
console.log(explanation);
````

### Beispiel-Output

```
This code creates a memoized calculation that:

1. Filters items to only include active ones above a threshold
2. Normalizes each item's score to a 0-1 range
3. Sorts by normalized score (highest first)
4. Takes the top 10 results

Potential Issues:
- If min equals max, division by zero will occur
- Large arrays could cause performance issues
- Consider adding null checks for items array

Dependencies: Recalculates when items, threshold, min, or max change.
```

## Auto-Analyse

### Automatische Fehler-Analyse bei Logging

```typescript
const logger = createLogger({ namespace: 'app', level: LogLevel.ERROR });

const aiDebugger = createAIDebugger({
  logger,
  enableAutoAnalysis: true,
  analysisThreshold: LogLevel.ERROR,
});

// Fehler werden automatisch analysiert
try {
  throw new Error('Database connection failed');
} catch (error) {
  // Logger triggert automatisch AI-Analyse
  logger.error('Connection error', error, {
    database: 'users',
    retry: 3,
  });
}

// AI-Analyse erscheint automatisch im Log:
// 🤖 AI Error Analysis
// Original Error: Database connection failed
// Analysis: { summary, causes, fixes, ... }
```

## Erweiterte Beispiele

### Vollständiges Error-Tracking-System

```typescript
import { createLogger, createAIDebugger } from '@sldm/debug';
import { atom, effect } from '@sldm/core';

// Setup
const logger = createLogger({
  namespace: 'production',
  persistent: true,
});

const aiDebugger = createAIDebugger({
  logger,
  enableAutoAnalysis: true,
});

// Error State
const errors = atom<ErrorAnalysis[]>([]);

// Track alle analysierten Fehler
logger.subscribe(async entry => {
  if (entry.level >= LogLevel.ERROR && entry.data instanceof Error) {
    const analysis = await aiDebugger.analyzeError(entry.data);
    errors([...errors(), analysis]);
  }
});

// React auf kritische Fehler
effect(() => {
  const criticalErrors = errors().filter(e => e.severity === 'critical');

  if (criticalErrors.length > 0) {
    // Benachrichtige Team
    notifyTeam(criticalErrors);

    // Log für Monitoring
    sendToMonitoring(criticalErrors);
  }
});
```

### Smart Error Boundary

```typescript
import { createAIDebugger } from '@sldm/debug';
import { createElement, atom } from '@sldm/core';

const aiDebugger = createAIDebugger();

function SmartErrorBoundary({ children }: { children: unknown }) {
  const error = atom<Error | null>(null);
  const analysis = atom<ErrorAnalysis | null>(null);
  const loading = atom(false);

  const handleError = async (err: Error) => {
    error(err);
    loading(true);

    const result = await aiDebugger.analyzeError(err);
    analysis(result);
    loading(false);
  };

  if (error()) {
    return createElement('div', { class: 'error-boundary' }, [
      createElement('h2', {}, 'Something went wrong'),
      createElement('p', {}, error()!.message),

      loading() && createElement('div', {}, 'Analyzing error...'),

      analysis() &&
        createElement('div', { class: 'ai-analysis' }, [
          createElement('h3', {}, 'AI Analysis'),
          createElement('p', {}, analysis()!.summary),

          createElement('div', {}, [
            createElement('h4', {}, 'Suggested Fixes:'),
            ...analysis()!.suggestedFixes.map(fix => createElement('li', {}, fix)),
          ]),
        ]),

      createElement(
        'button',
        {
          onclick: () => {
            error(null);
            analysis(null);
          },
        },
        'Try Again'
      ),
    ]);
  }

  try {
    return children;
  } catch (err) {
    handleError(err as Error);
    return null;
  }
}
```

### Development Debug Panel

```typescript
import { createLogger, createAIDebugger } from '@sldm/debug';
import { createElement, atom } from '@sldm/core';

const logger = createLogger();
const aiDebugger = createAIDebugger({ logger });

function DebugPanel() {
  const logs = atom(logger.getEntries());
  const selectedLog = atom<LogEntry | null>(null);
  const analysis = atom<ErrorAnalysis | null>(null);

  // Update logs on new entries
  logger.subscribe(() => logs(logger.getEntries()));

  const analyzeLog = async (log: LogEntry) => {
    if (log.data instanceof Error) {
      const result = await aiDebugger.analyzeError(log.data);
      analysis(result);
    }
  };

  return createElement('div', { class: 'debug-panel' }, [
    // Logs List
    createElement(
      'div',
      { class: 'logs' },
      logs().map(log =>
        createElement(
          'div',
          {
            class: `log-entry ${log.level}`,
            onclick: () => {
              selectedLog(log);
              analyzeLog(log);
            },
          },
          [
            createElement('span', {}, log.message),
            createElement('span', {}, new Date(log.timestamp).toLocaleTimeString()),
          ]
        )
      )
    ),

    // Analysis Panel
    selectedLog() &&
      createElement('div', { class: 'analysis' }, [
        createElement('h3', {}, 'AI Analysis'),
        analysis() && createElement('pre', {}, JSON.stringify(analysis(), null, 2)),
      ]),
  ]);
}
```

## Best Practices

### 1. Caching nutzen

```typescript
// AI-Anfragen werden automatisch gecached
const analysis1 = await aiDebugger.analyzeError(error, context);
const analysis2 = await aiDebugger.analyzeError(error, context); // Cached!

// Cache leeren wenn nötig
aiDebugger.clearCache();
```

### 2. Kontext bereitstellen

```typescript
// ✅ Gut: Mit Kontext
const analysis = await aiDebugger.analyzeError(error, {
  code: relevantCodeSnippet,
  file: errorLocation,
  line: errorLine,
  additionalInfo: 'User action: clicked submit button',
});

// ❌ Vermeiden: Ohne Kontext
const analysis = await aiDebugger.analyzeError(error);
```

### 3. Fallback handhaben

```typescript
if (!aiDebugger.isAvailable()) {
  // Fallback auf traditionelles Debugging
  console.error(error.message);
  console.error(error.stack);
} else {
  // Nutze AI-Analyse
  const analysis = await aiDebugger.analyzeError(error);
  displaySmartError(analysis);
}
```

### 4. Auto-Analyse nur in Production

```typescript
const aiDebugger = createAIDebugger({
  logger,
  // Nur in Production aktivieren
  enableAutoAnalysis: import.meta.env.PROD,
  analysisThreshold: LogLevel.ERROR,
});
```

## Siehe auch

- [Debug Logger Guide](/docs/guide/debug.md)
- [Web AI Guide](/docs/guide/web-ai.md)
- [AI Debugger API](/docs/api/ai-debugger.md)
