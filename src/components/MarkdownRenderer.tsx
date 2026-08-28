import React from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { DocumentChunk, RetrievalResult } from '../types';

interface MarkdownRendererProps {
  content: string;
  chunks?: RetrievalResult[];
  onOpenViewer?: (chunk: DocumentChunk) => void;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  chunks = [],
  onOpenViewer,
  className = '',
}) => {
  // Pre-process text to standardize math blocks if needed
  const processedContent = React.useMemo(() => {
    if (!content) return '';
    // Normalize any weird double-escaped slashes from JSON/strings
    return content;
  }, [content]);

  // Custom text renderer to intercept [Source X] / [Chunk #Y] citation tags
  const renderTextWithCitations = (text: string) => {
    if (!onOpenViewer || chunks.length === 0) return text;

    const citationRegex = /(\[(?:Source\s*\d+|Chunk\s*#?\d+|Doc:[^\]]+)(?:,\s*(?:Source\s*\d+|Chunk\s*#?\d+))*\])/gi;
    const parts = text.split(citationRegex);

    if (parts.length === 1) return text;

    return parts.map((part, i) => {
      if (citationRegex.test(part)) {
        const matchNum = part.match(/\d+/);
        const sourceNum = matchNum ? parseInt(matchNum[0], 10) : 1;
        const targetChunk = chunks[sourceNum - 1]?.chunk || chunks[0]?.chunk;

        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (targetChunk && onOpenViewer) {
                onOpenViewer(targetChunk);
              }
            }}
            className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded bg-accent-950/80 hover:bg-accent-900 border border-accent-700/60 hover:border-accent-500 text-accent-300 hover:text-white font-mono text-[11px] font-bold transition-all shadow-xs cursor-pointer align-baseline"
            title={`View citation ${part} in document inspector`}
          >
            {part}
          </button>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className={`markdown-body space-y-2 leading-relaxed ${className}`}>
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-white mt-4 mb-2 pb-1 border-b border-ink-800 flex items-center gap-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-accent-300 mt-3 mb-1.5 flex items-center gap-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold text-accent-400 mt-2.5 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => {
            // Process children for citations if string
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return renderTextWithCitations(child);
              }
              return child;
            });
            return (
              <p className="text-xs leading-relaxed text-ink-200 my-1.5 font-sans">
                {processedChildren}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-4 space-y-1.5 my-2 text-xs text-ink-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1.5 my-2 text-xs text-ink-200">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                return renderTextWithCitations(child);
              }
              return child;
            });
            return (
              <li className="text-xs leading-relaxed text-ink-200 pl-0.5">
                {processedChildren}
              </li>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-ink-300">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-500 pl-3 italic text-ink-400 my-2 bg-ink-950/40 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-black border border-ink-800 text-amber-300 font-mono text-[11px]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-2 rounded-xl bg-black border border-ink-800 overflow-x-auto text-xs font-mono text-ink-200 leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-ink-800">
              <table className="w-full text-xs text-left border-collapse bg-black">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-ink-900 border-b border-ink-800 text-white font-semibold">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-2.5 border-r border-ink-800 last:border-r-0 font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border-t border-r border-ink-800 last:border-r-0 text-ink-300">
              {children}
            </td>
          ),
        }}
      >
        {processedContent}
      </Markdown>
    </div>
  );
};
