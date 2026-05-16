import React, { useCallback, useEffect, useState } from 'react';
import { Project, Diagram, Document } from '@/types/api';
import { ProposalView } from '@/components/proposal';
import { DiagramView } from '@/components/diagrams';
import { ChatView } from '@/components/chat';
import api from '@/lib/api';
import { Loading } from '@/components/ui';

interface ResultsPanelProps {
  project: Project;
  refreshKey?: number;
}

type TabType = 'proposal' | 'diagrams' | 'chat';

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ project, refreshKey = 0 }) => {
  const [activeTab, setActiveTab] = useState<TabType>('proposal');
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [error, setError] = useState('');

  const loadDiagrams = useCallback(async () => {
    setIsLoadingDiagrams(true);
    setError('');

    try {
      const diagramList = await api.diagrams.list(project.id);
      setDiagrams(diagramList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load diagrams');
    } finally {
      setIsLoadingDiagrams(false);
    }
  }, [project.id]);

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);
    setError('');

    try {
      const data = await api.documents.list(project.id);
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [project.id]);

  // Preload diagrams and documents on mount, and refresh after regeneration.
  useEffect(() => {
    loadDiagrams();
    loadDocuments();
  }, [loadDiagrams, loadDocuments, refreshKey]);

  // Also load when tab changes (for refresh scenarios)
  useEffect(() => {
    if (activeTab === 'diagrams' && diagrams.length === 0) {
      loadDiagrams();
    } else if (activeTab === 'chat' && documents.length === 0) {
      loadDocuments();
    }
  }, [activeTab, diagrams.length, documents.length, loadDiagrams, loadDocuments]);

  if (!project.extraction_result) {
    return null;
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'proposal',
      label: 'Proposal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'diagrams',
      label: 'Diagrams',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03]">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Generated Workspace</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review proposal content, diagrams, and project chat in one place.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Extraction complete
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-4 py-3">
        <nav className="grid gap-2 rounded-lg bg-slate-100 p-1 sm:inline-grid sm:grid-cols-3" aria-label="Results tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {activeTab === 'proposal' && (
          <ProposalView
            proposal={project.extraction_result}
            projectName={project.name}
            diagrams={diagrams}
          />
        )}

        {activeTab === 'diagrams' && (
          <>
            {isLoadingDiagrams ? (
              <Loading message="Loading diagrams..." />
            ) : (
              <DiagramView diagrams={diagrams} />
            )}
          </>
        )}

        {activeTab === 'chat' && (
          isLoadingDocuments ? (
            <Loading message="Loading chat context..." />
          ) : (
            <div className="h-[600px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <ChatView
                projectId={project.id}
                hasDocuments={documents.length > 0}
                hasEmbeddings={documents.length > 0}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Made with Bob
