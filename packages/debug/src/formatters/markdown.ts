import type { Formatter, LogEntry } from '../types';
import { LogLevel } from '../types';

/**
 * Markdown formatter for documentation and reports
 */
export class MarkdownFormatter implements Formatter {
  format(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    const emoji = this.getLevelEmoji(entry.level);

    let md = `### ${emoji} ${levelName}: ${entry.message}\n\n`;
    md += `- **Timestamp:** ${timestamp}\n`;
    md += `- **Namespace:** \`${entry.namespace}\`\n`;

    if (entry.data !== undefined) {
      md += `\n**Data:**\n\`\`\`json\n${JSON.stringify(entry.data, null, 2)}\n\`\`\`\n`;
    }

    if (entry.context) {
      md += `\n**Context:**\n\`\`\`json\n${JSON.stringify(entry.context, null, 2)}\n\`\`\`\n`;
    }

    if (entry.stack) {
      md += `\n**Stack Trace:**\n\`\`\`\n${entry.stack}\n\`\`\`\n`;
    }

    if (entry.performance) {
      md += `\n**Performance:** ${entry.performance.duration.toFixed(2)}ms\n`;
    }

    return md;
  }

  formatBatch(entries: LogEntry[]): string {
    let md = `# Debug Logs\n\n`;
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `Total Entries: ${entries.length}\n\n`;

    // Summary by level
    const summary = this.getSummary(entries);
    md += `## Summary\n\n`;
    Object.entries(summary).forEach(([level, count]) => {
      if (count > 0) {
        const emoji = this.getLevelEmoji(parseInt(level));
        md += `- ${emoji} ${LogLevel[parseInt(level)]}: ${count}\n`;
      }
    });

    md += `\n---\n\n## Log Entries\n\n`;
    md += entries.map(e => this.format(e)).join('\n---\n\n');

    return md;
  }

  private getLevelEmoji(level: LogLevel): string {
    const emojis = ['🔍', '🐛', 'ℹ️', '⚠️', '❌', '💀'];
    return emojis[level] || '📝';
  }

  private getSummary(entries: LogEntry[]): Record<number, number> {
    const summary: Record<number, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    entries.forEach(entry => {
      summary[entry.level]++;
    });

    return summary;
  }
}
