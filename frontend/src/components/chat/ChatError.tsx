'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface ChatErrorProps {
  message: string;
  onRetry?: () => void;
  type?: 'no-documents' | 'no-embeddings' | 'error';
}

export default function ChatError({ message, onRetry, type = 'error' }: ChatErrorProps) {
  const getIcon = () => {
    switch (type) {
      case 'no-documents':
        return (
          <svg
            className="w-12 h-12 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'no-embeddings':
        return (
          <svg
            className="w-12 h-12 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-12 h-12 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'no-documents':
        return 'No Documents Uploaded';
      case 'no-embeddings':
        return 'Documents Not Processed';
      default:
        return 'Something Went Wrong';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'no-documents':
        return 'Upload documents to start chatting about your project.';
      case 'no-embeddings':
        return 'Process your documents first by running the embeddings step in the pipeline.';
      default:
        return message;
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-semibold text-ink">
          {getTitle()}
        </h3>

        {/* Description */}
        <p className="mb-6 text-sm leading-6 text-ink-muted">
          {getDescription()}
        </p>

        {/* Action Button */}
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}

        {/* Instructions for no-documents and no-embeddings */}
        {(type === 'no-documents' || type === 'no-embeddings') && (
          <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-left">
            <p className="mb-2 text-sm font-medium text-ink">
              To enable chat:
            </p>
            <ol className="list-inside list-decimal space-y-1 text-sm text-ink-muted">
              {type === 'no-documents' && (
                <>
                  <li>Go to the Input tab</li>
                  <li>Upload your project documents</li>
                  <li>Run the processing pipeline</li>
                  <li>Return to the Chat tab</li>
                </>
              )}
              {type === 'no-embeddings' && (
                <>
                  <li>Go to the Pipeline tab</li>
                  <li>Click &quot;Process Embeddings&quot;</li>
                  <li>Wait for processing to complete</li>
                  <li>Return to the Chat tab</li>
                </>
              )}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
