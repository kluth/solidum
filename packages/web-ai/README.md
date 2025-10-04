# @sldm/web-ai

Google Web AI (Gemini Nano) integration for Solidum.

Provides easy access to Chrome's built-in AI capabilities with reactive support.

## Features

- 🤖 **Language Model** - Text generation with Gemini Nano
- 📝 **Summarizer** - Text summarization with various formats
- ✍️ **Writer** - Content generation with tone control
- 🔄 **Rewriter** - Text rewriting and reformatting
- ⚡ **Reactive** - Built-in reactive hooks for Solidum
- 🌊 **Streaming** - Support for streaming responses

## Installation

```bash
pnpm add @sldm/web-ai
```

## Requirements

- Chrome 127+ with AI features enabled
- Enable Chrome AI at `chrome://flags/#optimization-guide-on-device-model`
- Enable Gemini Nano at `chrome://flags/#prompt-api-for-gemini-nano`

## Usage

### Basic Client

```typescript
import { createWebAIClient } from '@sldm/web-ai';

const client = createWebAIClient();

if (client.isAvailable()) {
  // Generate text
  const result = await client.generate('Write a haiku about coding');
  console.log(result);

  // Summarize text
  const summary = await client.summarize(longText, {
    type: 'tl;dr',
    length: 'short'
  });

  // Write content
  const content = await client.write('Blog post about TypeScript', {
    tone: 'professional',
    format: 'markdown',
    length: 'medium'
  });

  // Rewrite text
  const rewritten = await client.rewrite(text, {
    tone: 'more-casual',
    length: 'shorter'
  });
}
```

### Reactive Hooks

```typescript
import { useWebAI } from '@sldm/web-ai';
import { effect } from '@sldm/core';

const ai = useWebAI();

// Check availability
effect(() => {
  if (ai.isAvailable()) {
    console.log('Web AI is ready!');
  }
});

// Generate with loading state
await ai.generate('Explain quantum computing');

effect(() => {
  if (ai.isLoading()) {
    console.log('Generating...');
  } else if (ai.error()) {
    console.error('Error:', ai.error());
  } else if (ai.result()) {
    console.log('Result:', ai.result());
  }
});

// Summarize
await ai.summarize(longArticle, {
  type: 'key-points',
  format: 'markdown'
});

// Write
await ai.write('Email to client about project update', {
  tone: 'professional',
  length: 'short'
});

// Rewrite
await ai.rewrite(draftText, {
  tone: 'more-formal',
  format: 'markdown'
});
```

### Streaming

```typescript
import { useWebAIStreaming } from '@sldm/web-ai';
import { effect } from '@sldm/core';

const ai = useWebAIStreaming();

// Generate with streaming
await ai.generateStreaming('Write a story about AI');

// Watch chunks as they arrive
effect(() => {
  console.log('Current text:', ai.fullText());
});

// Access individual chunks
effect(() => {
  const chunks = ai.chunks();
  console.log(`Received ${chunks.length} chunks`);
});
```

### Component Example

```typescript
import { createElement } from '@sldm/core';
import { useWebAI } from '@sldm/web-ai';

function AIAssistant() {
  const ai = useWebAI();
  const input = atom('');

  const handleGenerate = async () => {
    await ai.generate(input());
  };

  return createElement('div', {}, [
    createElement('textarea', {
      value: input(),
      oninput: (e) => input((e.target as HTMLTextAreaElement).value),
      placeholder: 'Enter your prompt...'
    }),
    createElement('button', {
      onclick: handleGenerate,
      disabled: ai.isLoading()
    }, ai.isLoading() ? 'Generating...' : 'Generate'),
    ai.result() && createElement('div', { class: 'result' }, [
      createElement('h3', {}, 'Result:'),
      createElement('p', {}, ai.result())
    ]),
    ai.error() && createElement('div', { class: 'error' }, [
      'Error: ', ai.error()?.message
    ])
  ]);
}
```

## API Reference

### WebAIClient

Main client for interacting with Chrome's built-in AI.

#### Methods

- `isAvailable(): boolean` - Check if Web AI is available
- `generate(prompt: string, config?: AISessionConfig): Promise<string>` - Generate text
- `generateStreaming(prompt: string, config?: AISessionConfig): Promise<ReadableStream<string>>` - Generate with streaming
- `summarize(text: string, options?: SummarizerOptions): Promise<string>` - Summarize text
- `write(prompt: string, options?: WriterOptions): Promise<string>` - Generate content
- `rewrite(text: string, options?: RewriterOptions): Promise<string>` - Rewrite text

### useWebAI()

Reactive hook for Web AI with loading states.

Returns:
- `isAvailable: Computed<boolean>` - AI availability
- `isLoading: Atom<boolean>` - Loading state
- `error: Atom<Error | null>` - Error state
- `result: Atom<string | null>` - Generated result
- `generate(prompt, config?)` - Generate text
- `summarize(text, options?)` - Summarize text
- `write(prompt, options?)` - Generate content
- `rewrite(text, options?)` - Rewrite text
- `clear()` - Clear state

### useWebAIStreaming()

Reactive hook for streaming responses.

Returns:
- `isAvailable: Computed<boolean>` - AI availability
- `isStreaming: Atom<boolean>` - Streaming state
- `error: Atom<Error | null>` - Error state
- `chunks: Atom<string[]>` - Text chunks
- `fullText: Computed<string>` - Combined text
- `generateStreaming(prompt, config?)` - Generate with streaming
- `clear()` - Clear state

## Configuration Options

### AISessionConfig

```typescript
{
  temperature?: number;  // 0-1, controls randomness
  topK?: number;        // Top K sampling
  maxTokens?: number;   // Maximum tokens to generate
  systemPrompt?: string; // System instruction
}
```

### SummarizerOptions

```typescript
{
  type?: 'tl;dr' | 'key-points' | 'teaser' | 'headline';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}
```

### WriterOptions

```typescript
{
  tone?: 'formal' | 'neutral' | 'casual';
  format?: 'plain-text' | 'markdown';
  length?: 'short' | 'medium' | 'long';
  sharedContext?: string;
}
```

### RewriterOptions

```typescript
{
  tone?: 'as-is' | 'more-formal' | 'more-casual';
  format?: 'as-is' | 'plain-text' | 'markdown';
  length?: 'as-is' | 'shorter' | 'longer';
  sharedContext?: string;
}
```

## Browser Support

This package requires Chrome 127+ with experimental AI features enabled:

1. Go to `chrome://flags/#optimization-guide-on-device-model`
2. Enable "Optimization Guide On Device Model"
3. Go to `chrome://flags/#prompt-api-for-gemini-nano`
4. Enable "Prompt API for Gemini Nano"
5. Restart Chrome

The model will be downloaded on first use (~22MB).

## Notes

- Web AI features are experimental and may change
- The model runs entirely on-device (privacy-friendly)
- No API key required
- Works offline after model download
- Limited to Chrome browser

## License

MIT
