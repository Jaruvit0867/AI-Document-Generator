import React, { useCallback, useEffect, useState } from 'react';
import { Project } from '@/types/api';
import api from '@/lib/api';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { Button, EmptyState, FolderIcon, Loading } from '@/components/ui';

interface ProjectListProps {
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  refreshKey?: number;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  selectedProject,
  onSelectProject,
  refreshKey = 0,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await api.projects.list();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects, refreshKey]);

  const handleProjectCreated = () => {
    loadProjects();
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading message="Loading projects..." size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-error/30 bg-error-soft p-3 text-sm text-error">
          {error}
        </div>
        <Button onClick={loadProjects} className="mt-4 w-full" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Workspaces</h2>
            <p className="text-xs text-ink-faint">
              {projects.length} {projects.length === 1 ? 'workspace' : 'workspaces'}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            aria-label="Create new project"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </Button>
        </div>
        <div className="rounded-xl border border-accent/20 bg-accent-soft px-3 py-2 text-xs leading-5 text-accent">
          Upload requirements, generate plans, export deliverables.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderIcon />}
            title="No projects yet"
            description="Create a workspace to start planning."
            action={
              <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start a Project
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};
