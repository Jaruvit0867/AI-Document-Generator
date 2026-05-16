import React from 'react';
import { Project } from '@/types/api';
import { Badge, Card } from '@/components/ui';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onSelect,
}) => {
  const isExtracted = Boolean(project.extraction_result);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      hover
      onClick={() => onSelect(project)}
      className={`p-4 transition-all ${
        isSelected
          ? 'border-accent bg-accent-soft shadow-lg shadow-black/[0.03] ring-1 ring-accent'
          : 'hover:bg-surface-raised'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink">
              {project.name}
            </h3>
            <Badge variant={isExtracted ? 'success' : 'default'}>
              {isExtracted ? 'Ready' : 'Draft'}
            </Badge>
          </div>
          {project.description && (
            <p className="line-clamp-1 text-xs leading-5 text-ink-muted">
              {project.description}
            </p>
          )}
          <p className="mt-3 text-xs text-ink-faint">
            {formatDate(project.created_at)}
          </p>
        </div>
        {isSelected && (
          <div className="ml-2 flex-shrink-0">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
};
