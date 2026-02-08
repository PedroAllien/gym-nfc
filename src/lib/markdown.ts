/**
 * Converte texto Markdown básico para elementos React
 * Suporta: negrito (**texto**), itálico (*texto*), quebras de linha
 */

import React from 'react';

let keyCounter = 0;

function getKey(): string {
  return `md-${keyCounter++}`;
}

function createStrong(text: string): React.ReactElement {
  return React.createElement('strong', { key: getKey(), className: 'font-semibold' }, text);
}

function createEm(text: string): React.ReactElement {
  return React.createElement('em', { key: getKey(), className: 'italic' }, text);
}

function createBr(): React.ReactElement {
  return React.createElement('br', { key: getKey() });
}

function createSpan(text: string): React.ReactElement {
  return React.createElement('span', { key: getKey() }, text);
}

export function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];
  
  keyCounter = 0;
  const parts: React.ReactNode[] = [];

  const processItalic = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let processed = text;

    while (processed.includes('*')) {
      const italicStart = processed.indexOf('*');
      if (italicStart === -1) break;
      
      const italicEnd = processed.indexOf('*', italicStart + 1);
      if (italicEnd === -1) break;

      if (italicStart > 0) {
        result.push(processed.slice(0, italicStart));
      }

      const italicText = processed.slice(italicStart + 1, italicEnd);
      result.push(createEm(italicText));

      processed = processed.slice(italicEnd + 1);
    }

    if (processed) {
      result.push(processed);
    }

    return result.length > 0 ? result : [text];
  };

  const processLine = (line: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let processed = line;

    while (processed.includes('**')) {
      const boldStart = processed.indexOf('**');
      if (boldStart === -1) break;
      
      const boldEnd = processed.indexOf('**', boldStart + 2);
      if (boldEnd === -1) break;

      if (boldStart > 0) {
        const beforeText = processed.slice(0, boldStart);
        const italicParts = processItalic(beforeText);
        result.push(...italicParts);
      }

      const boldText = processed.slice(boldStart + 2, boldEnd);
      result.push(createStrong(boldText));

      processed = processed.slice(boldEnd + 2);
    }

    if (processed) {
      result.push(...processItalic(processed));
    }

    return result.length > 0 ? result : [line];
  };

  const lines = text.split('\n');
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      parts.push(createBr());
    }
    
    if (line) {
      const processed = processLine(line);
      processed.forEach((part) => {
        if (typeof part === 'string') {
          parts.push(createSpan(part));
        } else {
          parts.push(part);
        }
      });
    }
  });

  return parts;
}
