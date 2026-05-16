'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { ChatMessage as APIChatMessage } from '@/types/api';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatWelcome from './ChatWelcome';
import ChatError from './ChatError';
import { Button } from '@/components/ui';

interface ChatViewProps {
  projectId: number;
  hasDocuments?: boolean;
  hasEmbeddings?: boolean;
}

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const getErrorMessage = (err: unknown, fallback: string) => (
  err instanceof Error ? err.message : fallback
);

export default function ChatView({
  projectId,
  hasDocuments = false,
  hasEmbeddings = false
}: ChatViewProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Convert API chat messages to display format
  const convertToDisplayMessages = useCallback((apiMessages: APIChatMessage[]): DisplayMessage[] => {
    const displayMessages: DisplayMessage[] = [];

    apiMessages.forEach((msg) => {
      // Add user message
      displayMessages.push({
        role: 'user',
        content: msg.user_message,
        timestamp: msg.created_at,
      });

      // Add assistant response
      displayMessages.push({
        role: 'assistant',
        content: msg.ai_response,
        timestamp: msg.created_at,
      });
    });

    return displayMessages;
  }, []);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!hasDocuments || !hasEmbeddings) {
        setIsInitialLoading(false);
        return;
      }

      try {
        setIsInitialLoading(true);
        const history = await api.chat.getHistory(projectId);
        const displayMessages = convertToDisplayMessages(history);
        setMessages(displayMessages);
        setError(null);
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load chat history');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadHistory();
  }, [projectId, hasDocuments, hasEmbeddings, convertToDisplayMessages]);

  // Send message handler
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message immediately for better UX
    const userMessage: DisplayMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.chat.sendMessage(projectId, message);

      // Add assistant response
      const assistantMessage: DisplayMessage = {
        role: 'assistant',
        content: response.ai_response,
        timestamp: response.created_at,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      setError(getErrorMessage(err, 'Failed to send message'));

      // Remove the optimistically added user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history handler
  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await api.chat.clearHistory(projectId);
      setMessages([]);
      setError(null);
    } catch (err: unknown) {
      console.error('Failed to clear chat history:', err);
      setError(getErrorMessage(err, 'Failed to clear chat history'));
    } finally {
      setIsLoading(false);
    }
  };

  // Retry loading history
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // Show error states
  if (!hasDocuments) {
    return <ChatError type="no-documents" message="" />;
  }

  if (!hasEmbeddings) {
    return <ChatError type="no-embeddings" message="" />;
  }

  if (isInitialLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
          <p className="text-sm text-ink-muted">Loading chat history...</p>
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return <ChatError type="error" message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="flex h-full flex-col bg-surface-raised">
      {/* Header with clear button */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-ink-muted"
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
            <span className="text-sm font-medium text-ink-muted">
              {messages.length / 2} {messages.length === 2 ? 'conversation' : 'conversations'}
            </span>
          </div>
          <Button
            onClick={handleClearHistory}
            variant="secondary"
            disabled={isLoading}
            className="text-sm text-ink-muted hover:text-error"
          >
            Clear History
          </Button>
        </div>
      )}

      {/* Chat content */}
      {messages.length === 0 ? (
        <ChatWelcome onSuggestionClick={handleSendMessage} />
      ) : (
        <ChatHistory messages={messages} isLoading={isLoading} />
      )}

      {/* Error banner */}
      {error && messages.length > 0 && (
        <div className="border-t border-error/30 bg-error-soft px-4 py-2">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading || !hasDocuments || !hasEmbeddings}
        placeholder={
          isLoading
            ? 'Waiting for response...'
            : 'Ask a question about your documents...'
        }
      />
    </div>
  );
}
