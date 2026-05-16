import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { TextInputForm } from './TextInputForm';
import { FileUploadZone } from './FileUploadZone';

interface InputPanelProps {
  onTextSubmit: (text: string) => void;
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

type InputMode = 'text' | 'file';

export const InputPanel: React.FC<InputPanelProps> = ({
  onTextSubmit,
  onFilesSelected,
  isLoading = false,
}) => {
  const [mode, setMode] = useState<InputMode>('text');

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-950">Add Requirements</h3>
            <p className="mt-1 text-sm text-slate-500">
              Paste a brief or upload source files for extraction.
            </p>
          </div>
        
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`
                inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${mode === 'text'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
                }
              `}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Paste Text
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`
                inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${mode === 'file'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
                }
              `}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Files
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {mode === 'text' ? (
          <TextInputForm onSubmit={onTextSubmit} isLoading={isLoading} />
        ) : (
          <FileUploadZone onFilesSelected={onFilesSelected} isLoading={isLoading} />
        )}
      </div>
    </Card>
  );
};

// Made with Bob
