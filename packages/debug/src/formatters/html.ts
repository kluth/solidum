import type { Formatter, LogEntry } from '../types';
import { LogLevel } from '../types';

/**
 * HTML formatter for web-based log viewing
 */
export class HTMLFormatter implements Formatter {
  format(entry: LogEntry): string {
    const levelClass = this.getLevelClass(entry.level);
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();

    return `
      <div class="log-entry ${levelClass}">
        <span class="timestamp">${timestamp}</span>
        <span class="namespace">${entry.namespace}</span>
        <span class="level">${levelName}</span>
        <span class="message">${this.escapeHtml(entry.message)}</span>
        ${entry.data ? `<pre class="data">${this.escapeHtml(JSON.stringify(entry.data, null, 2))}</pre>` : ''}
        ${entry.context ? `<pre class="context">${this.escapeHtml(JSON.stringify(entry.context, null, 2))}</pre>` : ''}
        ${entry.stack ? `<pre class="stack">${this.escapeHtml(entry.stack)}</pre>` : ''}
      </div>
    `;
  }

  formatBatch(entries: LogEntry[]): string {
    const style = this.getStyles();
    const body = entries.map(e => this.format(e)).join('\n');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debug Logs</title>
  <style>${style}</style>
</head>
<body>
  <div class="log-container">
    <h1>Debug Logs</h1>
    <div class="logs">
      ${body}
    </div>
  </div>
  <script>
    // Add interactive features
    document.querySelectorAll('.log-entry').forEach(entry => {
      entry.addEventListener('click', () => {
        entry.classList.toggle('expanded');
      });
    });
  </script>
</body>
</html>
    `;
  }

  private getLevelClass(level: LogLevel): string {
    const classes = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    return classes[level] || 'debug';
  }

  private escapeHtml(text: string): string {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) {
      div.textContent = text;
      return div.innerHTML;
    }
    // Fallback for Node.js
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private getStyles(): string {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Courier New', monospace;
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 20px;
      }

      .log-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 20px;
        color: #4fc3f7;
      }

      .logs {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .log-entry {
        background: #252526;
        border-left: 4px solid #666;
        padding: 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .log-entry:hover {
        background: #2d2d30;
      }

      .log-entry.trace { border-color: #888; }
      .log-entry.debug { border-color: #0af; }
      .log-entry.info { border-color: #0f0; }
      .log-entry.warn { border-color: #fa0; }
      .log-entry.error { border-color: #f00; }
      .log-entry.fatal { border-color: #f0f; }

      .timestamp {
        color: #6a9955;
        margin-right: 10px;
      }

      .namespace {
        color: #9cdcfe;
        margin-right: 10px;
      }

      .level {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
        margin-right: 10px;
      }

      .trace .level { background: #888; }
      .debug .level { background: #0af; }
      .info .level { background: #0f0; color: #000; }
      .warn .level { background: #fa0; color: #000; }
      .error .level { background: #f00; }
      .fatal .level { background: #f0f; }

      .message {
        color: #d4d4d4;
      }

      pre {
        display: none;
        margin-top: 10px;
        padding: 10px;
        background: #1e1e1e;
        border-radius: 4px;
        overflow-x: auto;
        color: #ce9178;
      }

      .log-entry.expanded pre {
        display: block;
      }

      .data::before {
        content: 'Data:';
        display: block;
        color: #4fc3f7;
        margin-bottom: 5px;
      }

      .context::before {
        content: 'Context:';
        display: block;
        color: #4fc3f7;
        margin-bottom: 5px;
      }

      .stack::before {
        content: 'Stack Trace:';
        display: block;
        color: #f48771;
        margin-bottom: 5px;
      }
    `;
  }
}
