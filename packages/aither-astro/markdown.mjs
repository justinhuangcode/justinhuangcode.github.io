import rehypeKatex from 'rehype-katex';
import rehypeMermaid from 'rehype-mermaid';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function encodeDiagramSource(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

function remarkAitherDiagramBlocks() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined) return;

      const language = node.lang?.trim().toLowerCase();
      if (!language) return;

      if (language === 'mermaid') {
        parent.children[index] = {
          type: 'html',
          value: `<pre class="mermaid">${escapeHtml(node.value)}</pre>`,
        };
        return;
      }

      if (language === 'markmap') {
        const encodedSource = encodeDiagramSource(node.value);
        parent.children[index] = {
          type: 'html',
          value:
            `<div class="aither-markmap" data-markmap-source="${encodedSource}">` +
            '<svg class="aither-markmap__svg" role="img" aria-label="Mind map"></svg>' +
            '</div>',
        };
      }
    });
  };
}

export function aitherMarkdownConfig() {
  return {
    remarkPlugins: [remarkMath, remarkAitherDiagramBlocks],
    rehypePlugins: [
      [rehypeKatex, { strict: 'ignore' }],
      [rehypeMermaid, { strategy: 'inline-svg' }],
    ],
  };
}
