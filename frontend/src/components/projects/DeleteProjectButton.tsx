import React, { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import api from '@/lib/api';

interface DeleteProjectButtonProps {
  projectId: number;
  projectName: string;
  onDeleted: () => void;
  className?: string;
}

export const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({
  projectId,
  projectName,
  onDeleted,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);

    try {
      await api.projects.delete(projectId);
      setIsModalOpen(false);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className={`border-error/30 text-error hover:border-error/50 hover:bg-error-soft hover:text-error ${className}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete Project
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isDeleting && setIsModalOpen(false)}
        title="Delete project"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete Project
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error/30 bg-error-soft p-3 text-sm text-error">
              {error}
            </div>
          )}
          <p className="text-sm leading-6 text-ink-muted">
            Are you sure you want to delete <strong>{projectName}</strong>?
          </p>
          <p className="rounded-lg border border-error/30 bg-error-soft p-3 text-sm leading-6 text-error">
            This will permanently delete the project and all associated documents, diagrams, and chat history. This action cannot be undone.
          </p>
        </div>
      </Modal>
    </>
  );
};
