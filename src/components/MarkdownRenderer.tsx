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
  // Pre-process text to standardize math delimiters and spacing
  const processedContent = React.useMemo(() => {
    if (!content) return '';
    let text = content;

    // Convert \[ ... \] to display math $$ ... $$
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, '\n\n$$$$1$$\n\n');
    // Convert \( ... \) to inline math $ ... $
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$');

    // Ensure display math $$ ... $$ is on separate lines for remark-math
    text = text.replace(/([^\n])\s*\$\$([\s\S]*?)\$\$\s*([^\n])/g, '$1\n\n$$$2$$\n\n$3');

    return text;
  }, [content]);

  // Recursively process React nodes to replace [Source X] / [Chunk #Y] with interactive citation buttons
  const processCitationsInNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      const citationRegex = /(\[(?:Source\s*\d+|Chunk\s*#?\d+|Doc:[^\]]+)(?:,\s*(?:Source\s*\d+|Chunk\s*#?\d+))*\])/gi;
      const parts = node.split(citationRegex);

      if (parts.length === 1) return node;

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
              className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded bg-accent-950/90 hover:bg-accent-900 border border-accent-600/70 hover:border-accent-400 text-accent-300 hover:text-white font-mono text-[11px] font-bold transition-all shadow-xs cursor-pointer align-baseline select-none"
              title={`View citation ${part} in document inspector`}
            >
              {part}
            </button>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      });
    }

    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode; className?: string }>;
      const props = element.props;

      // Don't modify code elements, buttons, or katex elements
      if (
        element.type === 'code' ||
        element.type === 'button' ||
        (typeof props?.className === 'string' && props.className.includes('katex'))
      ) {
        return node;
      }

      if (props && props.children) {
        return React.cloneElement(element, {
          ...props,
          children: React.Children.map(props.children, processCitationsInNode),
        });
      }
    }

    return node;
  };

  return (
    <div className={`markdown-body text-ink-100 text-xs sm:text-[13px] leading-relaxed space-y-2.5 font-sans ${className}`}>
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-white mt-5 mb-2.5 pb-1.5 border-b border-ink-800 flex items-center gap-2">
              {React.Children.map(children, processCitationsInNode)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-accent-300 mt-4 mb-2 flex items-center gap-1.5">
              {React.Children.map(children, processCitationsInNode)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-accent-400 mt-3.5 mb-1.5">
              {React.Children.map(children, processCitationsInNode)}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-ink-200 mt-2.5 mb-1">
              {React.Children.map(children, processCitationsInNode)}
            </h4>
          ),
          p: ({ children }) => {
            return (
              <p className="text-xs sm:text-[13px] leading-relaxed text-ink-200 my-2 font-sans">
                {React.Children.map(children, processCitationsInNode)}
              </p>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-2 my-2 text-xs sm:text-[13px] text-ink-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-2 my-2 text-xs sm:text-[13px] text-ink-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-[13px] leading-relaxed text-ink-200 pl-1">
              {React.Children.map(children, processCitationsInNode)}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {React.Children.map(children, processCitationsInNode)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-ink-300">
              {React.Children.map(children, processCitationsInNode)}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent-500 pl-3.5 pr-2 py-1.5 italic text-ink-300 my-3 bg-ink-900/60 rounded-r-lg">
              {React.Children.map(children, processCitationsInNode)}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-ink-800" />,
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
              <pre className="p-3.5 my-3 rounded-xl bg-black border border-ink-800 overflow-x-auto text-xs font-mono text-ink-200 leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3.5 rounded-lg border border-ink-800">
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
              {React.Children.map(children, processCitationsInNode)}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border-t border-r border-ink-800 last:border-r-0 text-ink-300">
              {React.Children.map(children, processCitationsInNode)}
            </td>
          ),
        }}
      >
        {processedContent}
      </Markdown>
    </div>
  );
};
