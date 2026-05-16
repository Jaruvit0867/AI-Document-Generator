import React from 'react';
import { Project } from '@/types/api';
import { Badge } from '@/components/ui';
import { DeleteProjectButton } from './DeleteProjectButton';

interface ProjectHeaderProps {
  project: Project;
  onDeleted?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onDeleted }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    if (project.extraction_result) {
      return <Badge variant="success">Extracted</Badge>;
    }
    return <Badge variant="default">Draft</Badge>;
  };

  return (
    <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
              {project.name}
            </h1>
            {getStatusBadge()}
          </div>
          {project.description && (
            <p className="mb-2 max-w-3xl text-sm leading-6 text-slate-600">{project.description}</p>
          )}
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created {formatDate(project.created_at)}
          </p>
        </div>
        {onDeleted && (
          <div className="flex shrink-0 items-center justify-end">
            <DeleteProjectButton
              projectId={project.id}
              projectName={project.name}
              onDeleted={onDeleted}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Made with Bob
