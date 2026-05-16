import React, { useState } from 'react';
import { Button } from '@/components/ui';

interface TextInputFormProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
}

const TEMPLATE = `PROJECT REQUIREMENT BRIEF

Project name:

Problem statement:

Target users:

Business goals:

Functional requirements:

Non-functional requirements:

User flow:

Business process:

Scope - in:

Scope - out:

Preferred architecture / tech constraints:

Integrations:

Timeline or deadline:

Known risks / constraints:

Open questions:

Raw notes:
`;

export const TextInputForm: React.FC<TextInputFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [text, setText] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleUseTemplate = () => {
    setText(TEMPLATE);
    setUseTemplate(true);
  };

  const handleClear = () => {
    setText('');
    setUseTemplate(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm font-medium text-ink-muted">
          Paste Requirements Text
        </label>
        <div className="flex gap-2">
          {!useTemplate && text.length === 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleUseTemplate}
            >
              Use Template
            </Button>
          )}
          {text.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-80 w-full resize-none rounded-xl border border-border bg-surface-raised px-4 py-3 font-mono text-sm leading-6 text-ink shadow-sm shadow-black/[0.03] focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10"
        placeholder="Paste project requirements here..."
        disabled={isLoading}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-faint">
          {text.length} characters
        </p>
        <Button
          type="submit"
          disabled={!text.trim() || isLoading}
          isLoading={isLoading}
        >
          Upload as Document
        </Button>
      </div>
    </form>
  );
};
