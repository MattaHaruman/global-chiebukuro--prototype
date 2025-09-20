'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-gray-900 mb-3 mt-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-md font-medium text-gray-700 mb-2 mt-2">{children}</h3>
          ),

          // Customize paragraph
          p: ({ children }) => (
            <p className="text-gray-600 mb-3 leading-relaxed">{children}</p>
          ),

          // Customize code blocks
          code: ({ inline, children }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                  {children}
                </code>
              )
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code className="font-mono text-sm">{children}</code>
              </pre>
            )
          },

          // Customize lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-gray-600">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-600">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-600">{children}</li>
          ),

          // Customize links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
              {children}
            </blockquote>
          ),

          // Customize tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 py-2">{children}</td>
          ),

          // Customize horizontal rule
          hr: () => <hr className="border-t border-gray-300 my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}