'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearToken } from '@/lib/auth';
import { Project } from '@/types/api';
import { ProjectList } from '@/components/projects';
import { WorkspaceLayout } from '@/components/workspace';
import { EmptyState, FolderIcon, Button } from '@/components/ui';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projectListRefreshKey, setProjectListRefreshKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push('/auth/login');
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsSidebarOpen(false);
  };

  const handleProjectDeleted = () => {
    setSelectedProject(null);
    setProjectListRefreshKey((key) => key + 1);
  };

  const handleProjectUpdated = async () => {
    // Fetch the latest project data to show updated extraction results
    if (selectedProject) {
      try {
        const updatedProject = await api.projects.get(selectedProject.id);
        setSelectedProject(updatedProject);
      } catch (err) {
        console.error('Failed to refresh project:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-950/[0.03] backdrop-blur">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-3 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:hidden"
                aria-label="Toggle project navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-semibold leading-5 text-slate-950 sm:text-lg">
                  Plan Generator
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Requirements to proposal, diagrams, and delivery plan
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:static inset-y-0 left-0 z-40
            w-80 bg-white border-r border-slate-200
            transition-transform duration-300 ease-in-out
            lg:translate-x-0
            flex flex-col
            mt-[65px] lg:mt-0
          `}
        >
          <ProjectList
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            refreshKey={projectListRefreshKey}
          />
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          {selectedProject ? (
            <WorkspaceLayout
              project={selectedProject}
              onProjectDeleted={handleProjectDeleted}
              onProjectUpdated={handleProjectUpdated}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <div className="w-full max-w-xl">
                <EmptyState
                  icon={<FolderIcon />}
                  title="No project selected"
                  description="Choose a project from the navigator, or create a new one to start turning requirements into a development plan."
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Made with Bob
