import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
  accept?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  isLoading = false,
  accept = '.txt,.pdf,.docx',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          cursor-pointer rounded-2xl border border-dashed p-10 text-center transition-all
          ${isDragging ? 'border-accent bg-accent-soft' : 'border-border bg-surface-raised hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft/30 hover:shadow-md'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <svg
          className="mx-auto h-12 w-12 text-ink-faint"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-4 text-sm text-ink-muted">
          <span className="font-semibold text-accent">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1 text-xs text-ink-faint">TXT, PDF, DOCX</p>
      </div>

      <div className="mt-4">
        <Button
          onClick={handleClick}
          variant="secondary"
          disabled={isLoading}
          className="w-full"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Choose Files
        </Button>
      </div>
    </div>
  );
};
