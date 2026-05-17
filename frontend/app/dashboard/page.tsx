'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { isAuthenticated, clearToken } from '@/lib/auth';
import { Project } from '@/types/api';
import { ProjectList } from '@/components/projects';
import { WorkspaceLayout } from '@/components/workspace';
import { EmptyState, FolderIcon, Button } from '@/components/ui';
import { BrandLogo } from '@/components/brand/BrandLogo';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
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
    if (selectedProject?.id === project.id) {
      setIsSidebarOpen(false);
      return;
    }

    setSelectedProject(project);
    setIsSidebarOpen(false);
  };

  const handleProjectDeleted = () => {
    setSelectedProject(null);
    setProjectListRefreshKey((key) => key + 1);
  };

  const handleProjectUpdated = async () => {
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
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-surface-raised/90 shadow-sm shadow-black/[0.03] backdrop-blur-xl">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-3 rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/30 hover:text-ink lg:hidden"
                aria-label="Toggle project navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <Link href="/" className="inline-flex min-w-0 items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30">
                <BrandLogo
                  size="md"
                  className="max-w-[250px] sm:max-w-none"
                  imageClassName="h-10 w-40"
                />
              </Link>
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
            w-80 border-r border-border bg-surface-raised/95 backdrop-blur-xl
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
            className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {selectedProject ? (
              <motion.div
                key={`workspace-${selectedProject.id}`}
                className="h-full"
                initial={reduceMotion ? false : { opacity: 0, x: 18, scale: 0.995 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -14, scale: 0.995 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <WorkspaceLayout
                  key={selectedProject.id}
                  project={selectedProject}
                  onProjectDeleted={handleProjectDeleted}
                  onProjectUpdated={handleProjectUpdated}
                />
              </motion.div>
            ) : (
              <motion.div
                key="workspace-empty"
                className="flex h-full items-center justify-center p-6"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full max-w-xl">
                  <EmptyState
                    icon={<FolderIcon />}
                    title="No project selected"
                    description="Choose a workspace or create one to generate your first plan."
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
