'use client';

import React from 'react';

interface ChatWelcomeProps {
  onSuggestionClick?: (message: string) => void;
}

export default function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  const suggestions = [
    'What are the main features of this project?',
    'Explain the system architecture',
    'What are the key requirements?',
    'Describe the user flow',
  ];

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft ring-1 ring-inset ring-accent/20">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-ink">
          Chat with Your Documents
        </h2>

        {/* Description */}
        <p className="mb-8 text-sm leading-6 text-ink-muted">
          Ask questions about your project documents and get instant answers powered by AI.
        </p>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="mb-3 text-sm font-medium text-ink-muted">
            Try asking:
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="group rounded-lg border border-border bg-surface-raised p-3 text-left text-sm text-ink-muted transition-all hover:border-accent/30 hover:bg-accent-soft/50 hover:text-accent hover:shadow-[0_0_12px_-3px_rgba(124,58,237,0.12)]"
              >
                <span className="mr-2 text-accent transition-transform group-hover:translate-x-0.5 inline-block">→</span>
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg border border-accent/30 bg-accent-soft p-4">
          <p className="text-sm text-accent">
            <strong>Tip:</strong> The chat uses your uploaded documents to provide accurate, context-aware answers.
          </p>
        </div>
      </div>
    </div>
  );
}
