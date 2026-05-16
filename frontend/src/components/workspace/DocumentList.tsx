import React from 'react';
import { Document } from '@/types/api';
import { Card, EmptyState, DocumentIcon } from '@/components/ui';

interface DocumentListProps {
  documents: Document[];
  onDelete?: (documentId: number) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'docx':
      case 'doc':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<DocumentIcon />}
        title="No documents uploaded"
        description="Upload documents to start generating your proposal"
      />
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
              {getFileIcon(doc.filename)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-sm font-medium text-slate-950">
                    {doc.filename}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {formatFileSize(doc.file_size)}
                    </span>
                    <span className="text-xs text-slate-300">/</span>
                    <span className="text-xs text-slate-500">
                      {formatDate(doc.uploaded_at || doc.created_at)}
                    </span>
                  </div>
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="flex-shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${doc.filename}`}
                    title="Delete document"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              {doc.content_preview && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                  {doc.content_preview}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Made with Bob
