import { createElement, cn, useState } from '@solidum/core';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  className?: string;
}

export function CodeBlock(props: CodeBlockProps) {
  const { code, language = 'javascript', showLineNumbers = false, fileName, className } = props;
  const copied = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      copied(true);
      setTimeout(() => copied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return createElement(
    'div',
    { className: cn('solidum-code-block', className) },
    // Header
    createElement(
      'div',
      { className: 'solidum-code-block-header' },
      fileName && createElement('span', { className: 'solidum-code-block-filename' }, fileName),
      createElement(
        'button',
        {
          className: 'solidum-code-block-copy',
          onClick: copyToClipboard,
        },
        copied() ? '✓ Copied' : 'Copy'
      )
    ),
    // Code
    createElement(
      'pre',
      { className: cn('solidum-code-block-pre', showLineNumbers && 'solidum-code-block-pre--line-numbers') },
      createElement(
        'code',
        { className: `language-${language}` },
        code
      )
    )
  );
}
