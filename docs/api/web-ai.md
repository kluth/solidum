# Web AI API Reference

Vollständige API-Dokumentation für @sldm/web-ai.

## Table of Contents

- [Client API](#client-api)
- [Reactive Hooks](#reactive-hooks)
- [Types](#types)
- [Configuration](#configuration)

## Client API

### isWebAIAvailable()

Prüft ob Web AI im Browser verfügbar ist.

**Signature:**

```typescript
function isWebAIAvailable(): boolean;
```

**Returns:** `boolean` - `true` wenn verfügbar

**Example:**

```typescript
import { isWebAIAvailable } from '@sldm/web-ai';

if (isWebAIAvailable()) {
  console.log('Web AI ready!');
} else {
  console.log('Web AI not available');
}
```

---

### getChromeAI()

Gibt die Chrome AI API Instanz zurück.

**Signature:**

```typescript
function getChromeAI(): ChromeAI | null;
```

**Returns:** `ChromeAI | null` - Chrome AI Instanz oder null

---

### createWebAIClient()

Erstellt einen Web AI Client.

**Signature:**

```typescript
function createWebAIClient(): WebAIClient;
```

**Returns:** `WebAIClient` - Client-Instanz

**Example:**

```typescript
import { createWebAIClient } from '@sldm/web-ai';

const client = createWebAIClient();
```

---

### WebAIClient

Hauptklasse für Web AI Interaktionen.

#### isAvailable()

Prüft ob AI verfügbar ist.

**Signature:**

```typescript
isAvailable(): boolean
```

**Returns:** `boolean`

**Example:**

```typescript
const client = createWebAIClient();

if (client.isAvailable()) {
  // AI nutzen
}
```

---

#### getLanguageModelCapabilities()

Gibt Language Model Capabilities zurück.

**Signature:**

```typescript
getLanguageModelCapabilities(): Promise<AICapabilities | null>
```

**Returns:** `Promise<AICapabilities | null>`

**Example:**

```typescript
const capabilities = await client.getLanguageModelCapabilities();

if (capabilities) {
  console.log('Available:', capabilities.available);
  // 'readily' | 'after-download' | 'no'
}
```

---

#### generate()

Generiert Text mit dem Language Model.

**Signature:**

```typescript
generate(prompt: string, config?: AISessionConfig): Promise<string>
```

**Parameters:**

- `prompt` - Der Text-Prompt
- `config` - Optionale Konfiguration

**Returns:** `Promise<string>` - Generierter Text

**Example:**

```typescript
const result = await client.generate('Erkläre TypeScript');

// Mit Config
const result = await client.generate('Schreibe eine Geschichte', {
  temperature: 0.8,
  topK: 40,
  maxTokens: 500,
  systemPrompt: 'Du bist ein Autor.',
});
```

---

#### generateStreaming()

Generiert Text mit Streaming.

**Signature:**

```typescript
generateStreaming(
  prompt: string,
  config?: AISessionConfig
): Promise<ReadableStream<string>>
```

**Returns:** `Promise<ReadableStream<string>>` - Stream von Text-Chunks

**Example:**

```typescript
const stream = await client.generateStreaming('Erkläre AI');
const reader = stream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(value); // Text-Chunk
}
```

---

#### createLanguageModelSession()

Erstellt eine Language Model Session für mehrere Prompts.

**Signature:**

```typescript
createLanguageModelSession(config?: AISessionConfig): Promise<AISession>
```

**Returns:** `Promise<AISession>` - Session-Instanz

**Example:**

```typescript
const session = await client.createLanguageModelSession({
  temperature: 0.7,
  systemPrompt: 'Du bist ein Tutor.',
});

const answer1 = await session.prompt('Was ist TypeScript?');
const answer2 = await session.prompt('Wie funktioniert es?');

session.destroy();
```

---

#### summarize()

Fasst Text zusammen.

**Signature:**

```typescript
summarize(text: string, options?: SummarizerOptions): Promise<string>
```

**Parameters:**

- `text` - Text zum Zusammenfassen
- `options` - Optionen

**Returns:** `Promise<string>` - Zusammengefasster Text

**Example:**

```typescript
const summary = await client.summarize(longText, {
  type: 'tl;dr',
  format: 'markdown',
  length: 'short',
});
```

---

#### createSummarizer()

Erstellt eine Summarizer Session.

**Signature:**

```typescript
createSummarizer(options?: SummarizerOptions): Promise<Summarizer>
```

**Returns:** `Promise<Summarizer>` - Summarizer-Instanz

**Example:**

```typescript
const summarizer = await client.createSummarizer({
  type: 'key-points',
  format: 'markdown',
});

const summary1 = await summarizer.summarize(text1);
const summary2 = await summarizer.summarize(text2);

summarizer.destroy();
```

---

#### write()

Generiert Content mit Ton-Kontrolle.

**Signature:**

```typescript
write(prompt: string, options?: WriterOptions): Promise<string>
```

**Parameters:**

- `prompt` - Was geschrieben werden soll
- `options` - Writer-Optionen

**Returns:** `Promise<string>` - Generierter Content

**Example:**

```typescript
const email = await client.write('Email an Chef über Projekt', {
  tone: 'professional',
  format: 'plain-text',
  length: 'medium',
});
```

---

#### createWriter()

Erstellt eine Writer Session.

**Signature:**

```typescript
createWriter(options?: WriterOptions): Promise<Writer>
```

**Returns:** `Promise<Writer>` - Writer-Instanz

---

#### rewrite()

Formuliert Text um.

**Signature:**

```typescript
rewrite(text: string, options?: RewriterOptions): Promise<string>
```

**Parameters:**

- `text` - Umzuformulierender Text
- `options` - Rewriter-Optionen

**Returns:** `Promise<string>` - Umformulierter Text

**Example:**

```typescript
const rewritten = await client.rewrite(originalText, {
  tone: 'more-formal',
  length: 'shorter',
});
```

---

#### createRewriter()

Erstellt eine Rewriter Session.

**Signature:**

```typescript
createRewriter(options?: RewriterOptions): Promise<Rewriter>
```

**Returns:** `Promise<Rewriter>` - Rewriter-Instanz

---

## Reactive Hooks

### useWebAI()

Reaktiver Hook für Web AI mit Loading States.

**Signature:**

```typescript
function useWebAI(): UseWebAIResult;
```

**Returns:**

```typescript
interface UseWebAIResult {
  isAvailable: Computed<boolean>; // AI verfügbar?
  isLoading: Atom<boolean>; // Lädt gerade?
  error: Atom<Error | null>; // Fehler
  result: Atom<string | null>; // Ergebnis
  generate: (prompt: string, config?: AISessionConfig) => Promise<void>;
  summarize: (text: string, options?: SummarizerOptions) => Promise<void>;
  write: (prompt: string, options?: WriterOptions) => Promise<void>;
  rewrite: (text: string, options?: RewriterOptions) => Promise<void>;
  clear: () => void; // State zurücksetzen
}
```

**Example:**

```typescript
import { useWebAI } from '@sldm/web-ai';
import { effect } from '@sldm/core';

function MyComponent() {
  const ai = useWebAI();

  const handleGenerate = async () => {
    await ai.generate('Erkläre Solidum');
  };

  effect(() => {
    if (ai.result()) {
      console.log('Result:', ai.result());
    }
  });

  return createElement('div', {}, [
    createElement(
      'button',
      {
        onclick: handleGenerate,
        disabled: ai.isLoading(),
      },
      'Generate'
    ),

    ai.error() && createElement('div', { class: 'error' }, ai.error()!.message),
    ai.result() && createElement('div', {}, ai.result()),
  ]);
}
```

---

### useWebAIStreaming()

Reaktiver Hook für Streaming Responses.

**Signature:**

```typescript
function useWebAIStreaming(): UseWebAIStreamingResult;
```

**Returns:**

```typescript
interface UseWebAIStreamingResult {
  isAvailable: Computed<boolean>; // AI verfügbar?
  isStreaming: Atom<boolean>; // Streamt gerade?
  error: Atom<Error | null>; // Fehler
  chunks: Atom<string[]>; // Empfangene Chunks
  fullText: Computed<string>; // Vollständiger Text
  generateStreaming: (prompt: string, config?: AISessionConfig) => Promise<void>;
  clear: () => void; // State zurücksetzen
}
```

**Example:**

```typescript
import { useWebAIStreaming } from '@sldm/web-ai';

function StreamingComponent() {
  const ai = useWebAIStreaming();

  const handleStream = async () => {
    await ai.generateStreaming('Schreibe eine Geschichte');
  };

  return createElement('div', {}, [
    createElement('button', { onclick: handleStream }, 'Stream'),

    createElement('div', {}, [
      createElement('p', {}, ai.fullText()),
      ai.isStreaming() && createElement('small', {}, `(${ai.chunks().length} chunks)`),
    ]),
  ]);
}
```

---

## Types

### AICapabilities

Beschreibt AI Verfügbarkeit.

```typescript
interface AICapabilities {
  available: 'readily' | 'after-download' | 'no';
  supportsLanguage?: (language: string) => Promise<'readily' | 'after-download' | 'no'>;
}
```

---

### AISessionConfig

Konfiguration für Language Model Sessions.

```typescript
interface AISessionConfig {
  temperature?: number; // 0-1, Kreativität (default: 0.7)
  topK?: number; // Top-K Sampling (default: 40)
  maxTokens?: number; // Max. Tokens (default: 1024)
  systemPrompt?: string; // System-Instruction
}
```

**Fields:**

- **temperature** - Steuert Zufälligkeit
  - `0.0-0.3`: Faktual, konsistent
  - `0.4-0.7`: Balanced
  - `0.8-1.0`: Kreativ, variabel

- **topK** - Anzahl der zu berücksichtigenden Top-Tokens
  - Höher = mehr Vielfalt
  - Niedriger = fokussierter

- **maxTokens** - Maximale Länge der Antwort
  - Ungefähr 4 Zeichen pro Token
  - Default: 1024 (~4000 Zeichen)

---

### SummarizerOptions

Optionen für Zusammenfassungen.

```typescript
interface SummarizerOptions {
  type?: 'tl;dr' | 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}
```

**Fields:**

- **type**
  - `tl;dr`: Kurze Zusammenfassung
  - `key-points`: Wichtige Punkte als Liste
  - `teaser`: Anreißer für Artikel
  - `headline`: Schlagzeile generieren

- **format**
  - `plain-text`: Einfacher Text
  - `markdown`: Formatiert mit Markdown

- **length**
  - `short`: ~50 Wörter
  - `medium`: ~100 Wörter
  - `long`: ~200 Wörter

---

### WriterOptions

Optionen für Content-Generierung.

```typescript
interface WriterOptions {
  tone?: 'formal' | 'neutral' | 'casual';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}
```

**Fields:**

- **tone**
  - `formal`: Professionell, sachlich
  - `neutral`: Standard
  - `casual`: Locker, freundlich

- **format**
  - `plain-text`: Unformatiert
  - `markdown`: Mit Markdown-Formatierung

- **length**
  - `short`: ~100 Wörter
  - `medium`: ~300 Wörter
  - `long`: ~600 Wörter

---

### RewriterOptions

Optionen für Umformulierung.

```typescript
interface RewriterOptions {
  tone?: 'as-is' | 'more-formal' | 'more-casual';
  format?: 'as-is' | 'plain-text' | 'markdown';
  length?: 'as-is' | 'shorter' | 'longer';
  sharedContext?: string;
}
```

**Fields:**

- **tone**
  - `as-is`: Ton beibehalten
  - `more-formal`: Formeller machen
  - `more-casual`: Lockerer machen

- **format**
  - `as-is`: Format beibehalten
  - `plain-text`: Zu Plain-Text
  - `markdown`: Zu Markdown

- **length**
  - `as-is`: Länge beibehalten
  - `shorter`: Kürzen
  - `longer`: Erweitern

---

### AISession

Session für Language Model Interaktionen.

```typescript
interface AISession {
  prompt(text: string): Promise<string>;
  promptStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}
```

**Methods:**

- **prompt()** - Sendet Prompt, wartet auf Antwort
- **promptStreaming()** - Sendet Prompt, streamt Antwort
- **destroy()** - Beendet Session

**Example:**

```typescript
const session = await client.createLanguageModelSession();

// Mehrere Interaktionen
const q1 = await session.prompt('Frage 1');
const q2 = await session.prompt('Frage 2');

// Session beenden
session.destroy();
```

---

### Summarizer

Session für Zusammenfassungen.

```typescript
interface Summarizer {
  summarize(text: string): Promise<string>;
  summarizeStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}
```

---

### Writer

Session für Content-Generierung.

```typescript
interface Writer {
  write(text: string): Promise<string>;
  writeStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}
```

---

### Rewriter

Session für Umformulierungen.

```typescript
interface Rewriter {
  rewrite(text: string): Promise<string>;
  rewriteStreaming(text: string): ReadableStream<string>;
  destroy(): void;
}
```

---

### ChromeAI

Chrome's AI API Interface.

```typescript
interface ChromeAI {
  languageModel?: {
    capabilities(): Promise<AICapabilities>;
    create(options?: AISessionConfig): Promise<AISession>;
  };

  summarizer?: {
    capabilities(): Promise<SummarizerCapabilities>;
    create(options?: SummarizerOptions): Promise<Summarizer>;
  };

  writer?: {
    capabilities(): Promise<WriterCapabilities>;
    create(options?: WriterOptions): Promise<Writer>;
  };

  rewriter?: {
    capabilities(): Promise<RewriterCapabilities>;
    create(options?: RewriterOptions): Promise<Rewriter>;
  };
}
```

---

## Configuration

### Best Practices

#### Temperature Guidelines

```typescript
// Factual & Consistent (0.0-0.3)
await client.generate(prompt, { temperature: 0.2 });
// Use für: Zusammenfassungen, Erklärungen, Fakten

// Balanced (0.4-0.7)
await client.generate(prompt, { temperature: 0.5 });
// Use für: Standard-Generierung, Hilfe-Texte

// Creative (0.8-1.0)
await client.generate(prompt, { temperature: 0.9 });
// Use für: Kreative Texte, Geschichten, Brainstorming
```

#### maxTokens Guidelines

```typescript
// Kurze Antworten (~100 Zeichen)
{
  maxTokens: 25;
}

// Mittlere Antworten (~400 Zeichen)
{
  maxTokens: 100;
}

// Lange Antworten (~2000 Zeichen)
{
  maxTokens: 500;
}

// Sehr lange Antworten (~4000 Zeichen)
{
  maxTokens: 1000;
}
```

#### System Prompts

```typescript
// Definiere Rolle und Verhalten
{
  systemPrompt: `
    Du bist ein erfahrener TypeScript-Entwickler.
    Antworte präzise und mit Code-Beispielen.
    Verwende Best Practices.
  `;
}

// Setze Kontext
{
  systemPrompt: `
    Der Benutzer ist Anfänger.
    Erkläre Konzepte einfach.
    Vermeide Fachbegriffe ohne Erklärung.
  `;
}
```

---

## Error Handling

### Fehlertypen

```typescript
try {
  await client.generate(prompt);
} catch (error) {
  if (error.message.includes('not available')) {
    // AI nicht verfügbar
    console.error('Web AI ist nicht verfügbar');
  } else if (error.message.includes('after-download')) {
    // Model muss heruntergeladen werden
    console.log('Model wird heruntergeladen...');
  } else {
    // Anderer Fehler
    console.error('AI Error:', error);
  }
}
```

### Mit useWebAI Hook

```typescript
const ai = useWebAI();

effect(() => {
  if (ai.error()) {
    console.error('Error:', ai.error()!.message);
    showNotification('AI-Fehler: ' + ai.error()!.message);
  }
});
```

---

## Siehe auch

- [Web AI Guide](/docs/guide/web-ai.md)
- [Chrome AI Documentation](https://developer.chrome.com/docs/ai)
- [Examples](/docs/examples/web-ai.md)
