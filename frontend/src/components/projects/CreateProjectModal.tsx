import React, { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import api from '@/lib/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsLoading(true);

    try {
      await api.projects.create({
        name: name.trim(),
        description: description.trim() || '',
      });

      // Reset form
      setName('');
      setDescription('');
      onProjectCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create project"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="project-name" className="mb-1 block text-sm font-medium text-slate-700">
              Project Name *
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-inner shadow-slate-950/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Equipment Borrowing Portal"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="project-description" className="mb-1 block text-sm font-medium text-slate-700">
              Description (Optional)
            </label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm leading-6 shadow-inner shadow-slate-950/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Short context for this requirement workspace..."
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

// Made with Bob
