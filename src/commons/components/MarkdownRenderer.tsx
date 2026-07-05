import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="markdown-body text-sm leading-relaxed break-words">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 text-slate-100">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2 text-slate-100">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1 text-slate-100">{children}</h3>,
          p: ({ children }) => <p className="text-slate-300 mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside ml-4 space-y-1 my-2 text-slate-350">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside ml-4 space-y-1 my-2 text-slate-350">{children}</ol>,
          li: ({ children }) => <li className="text-slate-300">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-400 underline hover:text-orange-300">
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return isInline ? (
              <code className="rounded bg-slate-900 px-1.5 py-0.5 text-xs text-orange-400 font-mono border border-slate-800" {...props}>
                {children}
              </code>
            ) : (
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 font-mono my-2 border border-slate-800 w-full">
                {match && match[1] && (
                  <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 border-b border-slate-800 pb-1">
                    {match[1]}
                  </div>
                )}
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
