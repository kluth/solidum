# Web AI Guide

Der @sldm/web-ai ermöglicht die Nutzung von Google's eingebautem Gemini Nano AI direkt im Browser - komplett offline und ohne API-Keys.

## Inhaltsverzeichnis

- [Was ist Web AI?](#was-ist-web-ai)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Language Model](#language-model)
- [Summarizer](#summarizer)
- [Writer](#writer)
- [Rewriter](#rewriter)
- [Streaming](#streaming)
- [Reaktive Integration](#reaktive-integration)
- [Erweiterte Beispiele](#erweiterte-beispiele)
- [Best Practices](#best-practices)

## Was ist Web AI?

Google's Web AI (Gemini Nano) ist ein auf dem Gerät laufendes Large Language Model (LLM), das:

✅ **Komplett offline** funktioniert
✅ **Keine API-Keys** benötigt
✅ **Privacy-freundlich** ist (Daten verlassen das Gerät nie)
✅ **Schnell** ist (läuft lokal auf dem Gerät)
✅ **Kostenlos** ist

### Anwendungsfälle

- **Text-Generierung** - Inhalte erstellen, Ideen generieren
- **Zusammenfassungen** - Lange Texte automatisch zusammenfassen
- **Übersetzung** - Texte übersetzen
- **Umformulierung** - Texte neu schreiben
- **Assistent-Features** - Chatbots, Hilfe-Funktionen
- **Content-Optimierung** - Texte verbessern

## Voraussetzungen

### Browser Support

- **Chrome 127+** oder **Chrome Canary**
- Experimentelle Features müssen aktiviert sein

### Aktivierung

1. Öffne `chrome://flags/#optimization-guide-on-device-model`
2. Setze auf **"Enabled"**
3. Öffne `chrome://flags/#prompt-api-for-gemini-nano`
4. Setze auf **"Enabled"**
5. Starte Chrome neu

### Model Download

Beim ersten Start wird das Modell (~22MB) heruntergeladen. Du kannst den Status prüfen unter:

- `chrome://components/` → "Optimization Guide On Device Model"

## Installation

```bash
pnpm add @sldm/web-ai
# oder
solidum add web-ai
```

## Quick Start

### Verfügbarkeit prüfen

```typescript
import { isWebAIAvailable } from '@sldm/web-ai';

if (isWebAIAvailable()) {
  console.log('Web AI ist verfügbar!');
} else {
  console.log('Web AI nicht verfügbar - Chrome 127+ mit aktivierten Flags benötigt');
}
```

### Einfache Text-Generierung

```typescript
import { createWebAIClient } from '@sldm/web-ai';

const client = createWebAIClient();

if (client.isAvailable()) {
  const result = await client.generate('Schreibe ein Haiku über Programmierung');
  console.log(result);
}
```

### Mit Solidum Komponente

```typescript
import { createElement, atom } from '@sldm/core';
import { useWebAI } from '@sldm/web-ai';

function AIAssistant() {
  const ai = useWebAI();
  const prompt = atom('');

  const handleGenerate = async () => {
    await ai.generate(prompt());
  };

  return createElement('div', { class: 'ai-assistant' }, [
    createElement('h2', {}, 'AI Assistent'),

    createElement('textarea', {
      value: prompt(),
      oninput: e => prompt(e.target.value),
      placeholder: 'Stelle eine Frage oder gib einen Prompt ein...',
      rows: 4,
    }),

    createElement(
      'button',
      {
        onclick: handleGenerate,
        disabled: ai.isLoading() || !ai.isAvailable(),
      },
      ai.isLoading() ? 'Generiere...' : 'Generieren'
    ),

    ai.error() && createElement('div', { class: 'error' }, ['Fehler: ', ai.error().message]),

    ai.result() &&
      createElement('div', { class: 'result' }, [
        createElement('h3', {}, 'Ergebnis:'),
        createElement('p', {}, ai.result()),
      ]),
  ]);
}
```

## Language Model

Das Language Model ist das vielseitigste Tool für allgemeine Text-Generierung.

### Basis-Verwendung

```typescript
import { createWebAIClient } from '@sldm/web-ai';

const client = createWebAIClient();

// Einfache Generierung
const result = await client.generate('Erkläre Quantencomputing in einfachen Worten');
console.log(result);
```

### Mit Konfiguration

```typescript
const result = await client.generate('Schreibe eine kreative Geschichte über einen Roboter', {
  temperature: 0.8, // Höher = kreativer (0-1)
  topK: 40, // Anzahl der Top-Tokens
  maxTokens: 1000, // Maximale Antwort-Länge
  systemPrompt: 'Du bist ein kreativer Schriftsteller.',
});
```

### Session erstellen

Für mehrere Anfragen:

```typescript
const session = await client.createLanguageModelSession({
  temperature: 0.7,
  systemPrompt: 'Du bist ein hilfreicher Assistent.',
});

// Mehrere Prompts
const answer1 = await session.prompt('Was ist TypeScript?');
const answer2 = await session.prompt('Wie unterscheidet es sich von JavaScript?');

// Session beenden
session.destroy();
```

### Chat-Konversation

```typescript
function ChatBot() {
  const messages = atom<Array<{ role: string; content: string }>>([]);
  const input = atom('');
  const session = atom<AISession | null>(null);

  effect(async () => {
    if (!session()) {
      const s = await client.createLanguageModelSession({
        systemPrompt: 'Du bist ein freundlicher Chatbot.',
      });
      session(s);
    }
  });

  const sendMessage = async () => {
    const userMessage = input();
    messages([...messages(), { role: 'user', content: userMessage }]);
    input('');

    const response = await session()!.prompt(userMessage);
    messages([...messages(), { role: 'assistant', content: response }]);
  };

  return createElement('div', { class: 'chatbot' }, [
    createElement(
      'div',
      { class: 'messages' },
      messages().map(msg =>
        createElement('div', { class: `message ${msg.role}` }, [
          createElement('strong', {}, msg.role),
          createElement('p', {}, msg.content),
        ])
      )
    ),

    createElement('div', { class: 'input' }, [
      createElement('input', {
        value: input(),
        oninput: e => input(e.target.value),
        placeholder: 'Nachricht eingeben...',
      }),
      createElement('button', { onclick: sendMessage }, 'Senden'),
    ]),
  ]);
}
```

## Summarizer

Automatisches Zusammenfassen von Texten.

### Basis-Verwendung

```typescript
const summary = await client.summarize(longText, {
  type: 'tl;dr', // 'tl;dr' | 'key-points' | 'teaser' | 'headline'
  format: 'markdown', // 'plain-text' | 'markdown'
  length: 'short', // 'short' | 'medium' | 'long'
});
```

### Typen von Zusammenfassungen

```typescript
// TL;DR - Kurze Zusammenfassung
const tldr = await client.summarize(article, {
  type: 'tl;dr',
  length: 'short',
});

// Key Points - Hauptpunkte als Liste
const keyPoints = await client.summarize(article, {
  type: 'key-points',
  format: 'markdown',
});

// Teaser - Anreißer für Artikel
const teaser = await client.summarize(article, {
  type: 'teaser',
  length: 'medium',
});

// Headline - Überschrift generieren
const headline = await client.summarize(article, {
  type: 'headline',
});
```

### Artikel-Zusammenfassungs-Komponente

```typescript
function ArticleSummary({ article }: { article: Article }) {
  const summary = atom('');
  const loading = atom(false);

  const generateSummary = async () => {
    loading(true);
    try {
      const result = await client.summarize(article.content, {
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
      });
      summary(result);
    } finally {
      loading(false);
    }
  };

  return createElement('div', { class: 'article-summary' }, [
    createElement('h2', {}, article.title),

    createElement(
      'button',
      {
        onclick: generateSummary,
        disabled: loading(),
      },
      loading() ? 'Generiere...' : 'Zusammenfassung generieren'
    ),

    summary() &&
      createElement('div', {
        class: 'summary',
        innerHTML: markdownToHtml(summary()),
      }),
  ]);
}
```

## Writer

Content-Generierung mit Ton- und Format-Kontrolle.

### Basis-Verwendung

```typescript
const content = await client.write('Blog-Post über TypeScript Best Practices', {
  tone: 'professional', // 'formal' | 'neutral' | 'casual'
  format: 'markdown', // 'plain-text' | 'markdown'
  length: 'long', // 'short' | 'medium' | 'long'
  sharedContext: 'Zielgruppe sind erfahrene Entwickler',
});
```

### E-Mail Generator

```typescript
function EmailGenerator() {
  const recipient = atom('');
  const topic = atom('');
  const tone = atom<'formal' | 'neutral' | 'casual'>('neutral');
  const result = atom('');

  const generateEmail = async () => {
    const prompt = `Email an ${recipient()} über ${topic()}`;

    const email = await client.write(prompt, {
      tone: tone(),
      format: 'plain-text',
      length: 'medium',
    });

    result(email);
  };

  return createElement('div', { class: 'email-generator' }, [
    createElement('h2', {}, 'Email Generator'),

    createElement('input', {
      value: recipient(),
      oninput: e => recipient(e.target.value),
      placeholder: 'Empfänger',
    }),

    createElement('input', {
      value: topic(),
      oninput: e => topic(e.target.value),
      placeholder: 'Thema',
    }),

    createElement(
      'select',
      {
        value: tone(),
        onchange: e => tone(e.target.value),
      },
      [
        createElement('option', { value: 'formal' }, 'Formell'),
        createElement('option', { value: 'neutral' }, 'Neutral'),
        createElement('option', { value: 'casual' }, 'Locker'),
      ]
    ),

    createElement('button', { onclick: generateEmail }, 'Email generieren'),

    result() &&
      createElement('textarea', {
        value: result(),
        rows: 10,
        readonly: true,
      }),
  ]);
}
```

## Rewriter

Texte umformulieren und anpassen.

### Basis-Verwendung

```typescript
const rewritten = await client.rewrite(originalText, {
  tone: 'more-formal', // 'as-is' | 'more-formal' | 'more-casual'
  format: 'as-is', // 'as-is' | 'plain-text' | 'markdown'
  length: 'shorter', // 'as-is' | 'shorter' | 'longer'
});
```

### Text-Optimierer

```typescript
function TextOptimizer() {
  const input = atom('');
  const tone = atom<'as-is' | 'more-formal' | 'more-casual'>('as-is');
  const length = atom<'as-is' | 'shorter' | 'longer'>('as-is');
  const output = atom('');

  const optimize = async () => {
    const result = await client.rewrite(input(), {
      tone: tone(),
      length: length(),
      format: 'as-is',
    });
    output(result);
  };

  return createElement('div', { class: 'text-optimizer' }, [
    createElement('h2', {}, 'Text Optimierer'),

    createElement('textarea', {
      value: input(),
      oninput: e => input(e.target.value),
      placeholder: 'Text zum Optimieren...',
      rows: 6,
    }),

    createElement('div', { class: 'controls' }, [
      createElement('label', {}, [
        'Ton: ',
        createElement(
          'select',
          {
            value: tone(),
            onchange: e => tone(e.target.value),
          },
          [
            createElement('option', { value: 'as-is' }, 'Beibehalten'),
            createElement('option', { value: 'more-formal' }, 'Formeller'),
            createElement('option', { value: 'more-casual' }, 'Lockerer'),
          ]
        ),
      ]),

      createElement('label', {}, [
        'Länge: ',
        createElement(
          'select',
          {
            value: length(),
            onchange: e => length(e.target.value),
          },
          [
            createElement('option', { value: 'as-is' }, 'Beibehalten'),
            createElement('option', { value: 'shorter' }, 'Kürzer'),
            createElement('option', { value: 'longer' }, 'Länger'),
          ]
        ),
      ]),
    ]),

    createElement('button', { onclick: optimize }, 'Optimieren'),

    output() &&
      createElement('div', { class: 'output' }, [
        createElement('h3', {}, 'Optimierter Text:'),
        createElement('p', {}, output()),
      ]),
  ]);
}
```

## Streaming

Für Echtzeit-Antworten.

### Streaming-Generierung

```typescript
import { useWebAIStreaming } from '@sldm/web-ai';

function StreamingChat() {
  const ai = useWebAIStreaming();
  const input = atom('');

  const sendMessage = async () => {
    await ai.generateStreaming(input());
    input('');
  };

  return createElement('div', { class: 'streaming-chat' }, [
    createElement('div', { class: 'output' }, [
      // Zeigt Text während er generiert wird
      createElement('p', {}, ai.fullText()),

      // Zeigt aktuelle Anzahl der Chunks
      ai.isStreaming() && createElement('small', {}, `Empfange... (${ai.chunks().length} Chunks)`),
    ]),

    createElement('input', {
      value: input(),
      oninput: e => input(e.target.value),
      disabled: ai.isStreaming(),
    }),

    createElement(
      'button',
      {
        onclick: sendMessage,
        disabled: ai.isStreaming(),
      },
      'Senden'
    ),
  ]);
}
```

### Typewriter-Effekt

```typescript
function TypewriterAI() {
  const ai = useWebAIStreaming();
  const displayText = atom('');
  const prompt = atom('');

  const generate = async () => {
    displayText('');
    await ai.generateStreaming(prompt());

    // Chunks nacheinander anzeigen
    let index = 0;
    const interval = setInterval(() => {
      if (index < ai.chunks().length) {
        displayText(displayText() + ai.chunks()[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // 50ms pro Chunk
  };

  return createElement('div', {}, [
    createElement('textarea', {
      value: prompt(),
      oninput: e => prompt(e.target.value),
    }),
    createElement('button', { onclick: generate }, 'Generieren'),
    createElement('div', { class: 'typewriter' }, displayText()),
  ]);
}
```

## Reaktive Integration

### Mit Solidum Atoms

```typescript
import { atom, computed, effect } from '@sldm/core';
import { useWebAI } from '@sldm/web-ai';

function SmartForm() {
  const ai = useWebAI();

  const userInput = atom('');
  const suggestion = atom('');

  // Auto-Suggest bei Eingabe
  effect(() => {
    const input = userInput();

    if (input.length > 10) {
      const debounce = setTimeout(async () => {
        await ai.generate(`Vervollständige diesen Text: "${input}"`);
        if (ai.result()) {
          suggestion(ai.result());
        }
      }, 1000);

      return () => clearTimeout(debounce);
    }
  });

  return createElement('div', {}, [
    createElement('textarea', {
      value: userInput(),
      oninput: e => userInput(e.target.value),
    }),

    suggestion() &&
      createElement('div', { class: 'suggestion' }, [
        createElement('p', {}, 'Vorschlag:'),
        createElement('p', {}, suggestion()),
        createElement(
          'button',
          {
            onclick: () => userInput(suggestion()),
          },
          'Übernehmen'
        ),
      ]),
  ]);
}
```

### Context-basierte Hilfe

```typescript
function ContextualHelp({ context }: { context: string }) {
  const ai = useWebAI();
  const showHelp = atom(false);

  const getHelp = async () => {
    showHelp(true);
    await ai.generate(`Erkläre kurz und einfach: ${context}`, { temperature: 0.3, maxTokens: 200 });
  };

  return createElement('div', { class: 'contextual-help' }, [
    createElement(
      'button',
      {
        onclick: getHelp,
        class: 'help-icon',
        title: 'Hilfe anzeigen',
      },
      '?'
    ),

    showHelp() &&
      ai.result() &&
      createElement('div', { class: 'help-popup' }, [
        createElement(
          'button',
          {
            onclick: () => showHelp(false),
            class: 'close',
          },
          '×'
        ),
        createElement('p', {}, ai.result()),
      ]),
  ]);
}
```

## Erweiterte Beispiele

### Code-Erklärer

```typescript
function CodeExplainer() {
  const code = atom('');
  const explanation = atom('');
  const loading = atom(false);

  const explainCode = async () => {
    loading(true);
    try {
      const result = await client.generate(`Erkläre diesen Code Zeile für Zeile:\n\n${code()}`, {
        temperature: 0.3,
        systemPrompt: 'Du bist ein erfahrener Programmierer.',
      });
      explanation(result);
    } finally {
      loading(false);
    }
  };

  return createElement('div', { class: 'code-explainer' }, [
    createElement('h2', {}, 'Code Erklärer'),

    createElement('textarea', {
      value: code(),
      oninput: e => code(e.target.value),
      placeholder: 'Code hier einfügen...',
      rows: 10,
      class: 'code-input',
    }),

    createElement(
      'button',
      {
        onclick: explainCode,
        disabled: loading() || !code(),
      },
      loading() ? 'Analysiere...' : 'Code erklären'
    ),

    explanation() &&
      createElement('div', { class: 'explanation' }, [
        createElement('h3', {}, 'Erklärung:'),
        createElement('pre', {}, explanation()),
      ]),
  ]);
}
```

### Smart Search

```typescript
function SmartSearch({ items }: { items: any[] }) {
  const query = atom('');
  const results = atom<any[]>([]);
  const ai = useWebAI();

  const search = async () => {
    // Semantische Suche mit AI
    const prompt = `
      Finde die relevantesten Items für die Suchanfrage: "${query()}"

      Items: ${JSON.stringify(items.map(i => ({ id: i.id, title: i.title, description: i.description })))}

      Gib nur die IDs der relevantesten Items zurück, sortiert nach Relevanz.
      Format: [id1, id2, id3]
    `;

    await ai.generate(prompt, { temperature: 0.2 });

    if (ai.result()) {
      try {
        const ids = JSON.parse(ai.result());
        results(items.filter(item => ids.includes(item.id)));
      } catch {
        // Fallback zu normaler Suche
        results(items.filter(item => item.title.toLowerCase().includes(query().toLowerCase())));
      }
    }
  };

  return createElement('div', { class: 'smart-search' }, [
    createElement('input', {
      value: query(),
      oninput: e => query(e.target.value),
      placeholder: 'Suche...',
    }),

    createElement('button', { onclick: search }, 'Suchen'),

    createElement(
      'div',
      { class: 'results' },
      results().map(item =>
        createElement('div', { class: 'result-item', key: item.id }, [
          createElement('h3', {}, item.title),
          createElement('p', {}, item.description),
        ])
      )
    ),
  ]);
}
```

### Content Moderator

```typescript
function ContentModerator() {
  const content = atom('');
  const analysis = atom<{
    safe: boolean;
    reasons: string[];
    suggestions: string[];
  } | null>(null);

  const moderate = async () => {
    const prompt = `
      Analysiere diesen User-generierten Content auf:
      - Beleidigungen
      - Hate Speech
      - Spam
      - Unangemessene Inhalte

      Content: "${content()}"

      Gib zurück als JSON:
      {
        "safe": boolean,
        "reasons": ["Grund 1", "Grund 2"],
        "suggestions": ["Verbesserung 1", "Verbesserung 2"]
      }
    `;

    const result = await client.generate(prompt, { temperature: 0.1 });

    try {
      analysis(JSON.parse(result));
    } catch (error) {
      console.error('Failed to parse moderation result');
    }
  };

  return createElement('div', { class: 'content-moderator' }, [
    createElement('h2', {}, 'Content Moderator'),

    createElement('textarea', {
      value: content(),
      oninput: e => content(e.target.value),
      placeholder: 'Content zum Moderieren...',
    }),

    createElement('button', { onclick: moderate }, 'Moderieren'),

    analysis() &&
      createElement(
        'div',
        {
          class: `analysis ${analysis()!.safe ? 'safe' : 'unsafe'}`,
        },
        [
          createElement(
            'p',
            {},
            analysis()!.safe ? '✓ Content ist sicher' : '✗ Content problematisch'
          ),

          analysis()!.reasons.length > 0 &&
            createElement('div', {}, [
              createElement('strong', {}, 'Gründe:'),
              createElement(
                'ul',
                {},
                analysis()!.reasons.map(r => createElement('li', {}, r))
              ),
            ]),

          analysis()!.suggestions.length > 0 &&
            createElement('div', {}, [
              createElement('strong', {}, 'Verbesserungsvorschläge:'),
              createElement(
                'ul',
                {},
                analysis()!.suggestions.map(s => createElement('li', {}, s))
              ),
            ]),
        ]
      ),
  ]);
}
```

## Best Practices

### 1. Verfügbarkeit prüfen

```typescript
// ✅ Gut: Immer Verfügbarkeit prüfen
function AIFeature() {
  const client = createWebAIClient();

  if (!client.isAvailable()) {
    return createElement('div', {}, [
      createElement('p', {}, 'Web AI nicht verfügbar.'),
      createElement('a', { href: 'chrome://flags' }, 'Flags aktivieren'),
    ]);
  }

  // ... Rest der Komponente
}

// ❌ Schlecht: Verfügbarkeit annehmen
function BadAIFeature() {
  const result = await client.generate('...'); // Kann fehlschlagen!
}
```

### 2. Loading States

```typescript
// ✅ Gut: Zeige Loading State
const ai = useWebAI();

return createElement(
  'button',
  {
    onclick: () => ai.generate(prompt),
    disabled: ai.isLoading(),
  },
  ai.isLoading() ? 'Generiere...' : 'Generieren'
);

// ❌ Schlecht: Keine Feedback
return createElement(
  'button',
  {
    onclick: () => ai.generate(prompt),
  },
  'Generieren'
);
```

### 3. Error Handling

```typescript
// ✅ Gut: Fehler abfangen
const ai = useWebAI();

effect(() => {
  if (ai.error()) {
    console.error('AI Error:', ai.error());
    showNotification('AI-Generierung fehlgeschlagen');
  }
});

// ❌ Schlecht: Keine Error Handling
await client.generate(prompt); // Kann ohne Warnung fehlschlagen
```

### 4. Prompts optimieren

```typescript
// ✅ Gut: Klare, spezifische Prompts
const prompt = `
Erstelle eine professionelle Email-Antwort mit folgenden Anforderungen:
- Empfänger: ${recipient}
- Thema: ${topic}
- Ton: formell
- Länge: circa 150 Wörter
- Enthalte konkrete Handlungsvorschläge
`;

// ❌ Schlecht: Vage Prompts
const prompt = 'Schreib Email';
```

### 5. Temperatur anpassen

```typescript
// ✅ Gut: Passende Temperature für Use-Case
// Factual (0.1-0.3): Zusammenfassungen, Erklärungen
await client.summarize(text, { temperature: 0.2 });

// Balanced (0.4-0.7): Standard-Generierung
await client.generate(prompt, { temperature: 0.5 });

// Creative (0.8-1.0): Kreative Texte
await client.write('Geschichte', { temperature: 0.9 });
```

## Siehe auch

- [API-Referenz](/docs/api/web-ai.md)
- [Chrome AI Documentation](https://developer.chrome.com/docs/ai)
- [Prompt Engineering Best Practices](/docs/guide/prompt-engineering.md)
