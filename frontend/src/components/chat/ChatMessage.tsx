'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  
  const formattedTime = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'just now';
    }
  }, [timestamp]);

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] items-start gap-3`}>
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
            isUser ? 'bg-blue-600' : 'bg-slate-700'
          }`}
          aria-label={isUser ? 'User' : 'Assistant'}
        >
          {isUser ? 'U' : 'A'}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 bg-white text-slate-900 shadow-sm shadow-slate-950/[0.03]'
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap break-words text-sm leading-6">{content}</div>
            ) : (
              <div className="break-words text-sm leading-6">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
                    ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    code: ({ children }) => (
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-900">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100 last:mb-0">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div
            className={`mt-1 text-xs text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
