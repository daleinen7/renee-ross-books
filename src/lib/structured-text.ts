import { render } from 'datocms-structured-text-to-html-string';
import { isParagraph, isSpan, type Document, type Node } from 'datocms-structured-text-utils';

export type StructuredTextDocument = { schema: 'dast'; document: Document };

export function renderStructuredText(value: StructuredTextDocument): string {
  return render(value) ?? '';
}

function spanText(node: Node): string {
  if (isSpan(node)) return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return (node.children as Node[]).map(spanText).join('');
  }
  return '';
}

export function excerpt(value: StructuredTextDocument, maxChars = 180): string {
  const first = value.document.children.find(isParagraph);
  if (!first) return '';
  const text = spanText(first).replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxChars).trimEnd()}…`;
}
