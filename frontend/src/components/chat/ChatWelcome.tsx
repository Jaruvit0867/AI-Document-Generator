'use client';

import React from 'react';

export default function ChatWelcome() {
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-1 ring-inset ring-blue-100">
            <svg
              className="w-8 h-8 text-blue-600"
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
        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-950">
          Chat with Your Documents
        </h2>

        {/* Description */}
        <p className="mb-8 text-sm leading-6 text-slate-600">
          Ask questions about your project documents and get instant answers powered by AI.
        </p>

        {/* Suggestions */}
        <div className="space-y-2">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Try asking:
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100"
              >
                <span className="mr-2 text-blue-600">→</span>
                {suggestion}
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> The chat uses your uploaded documents to provide accurate, context-aware answers.
          </p>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
