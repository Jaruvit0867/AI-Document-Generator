import React, { useCallback, useEffect, useState } from 'react';
import { Project, Document } from '@/types/api';
import api from '@/lib/api';
import { convertTextToFile } from '@/lib/utils';
import { ProjectHeader } from '@/components/projects';
import { InputPanel } from './InputPanel';
import { DocumentList } from './DocumentList';
import { ProcessingPipeline } from './ProcessingPipeline';
import { ResultsPanel } from './ResultsPanel';
import { Loading } from '@/components/ui';

interface WorkspaceLayoutProps {
  project: Project;
  onProjectDeleted: () => void;
  onProjectUpdated: () => void | Promise<void>;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  project,
  onProjectDeleted,
  onProjectUpdated,
}) => {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
  const [error, setError] = useState('');

  // Update local project state when prop changes
  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  const loadDocuments = useCallback(async () => {
    setIsLoadingDocuments(true);
    setError('');

    try {
      const data = await api.documents.list(currentProject.id);
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [currentProject.id]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleTextSubmit = async (text: string) => {
    setIsUploading(true);
    setError('');

    try {
      // Convert text to file
      const file = convertTextToFile(text, 'requirements.txt');
      
      // Upload file
      await api.documents.upload(currentProject.id, file);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload text');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true);
    setError('');

    try {
      // Upload files one by one
      for (const file of files) {
        await api.documents.upload(currentProject.id, file);
      }
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.documents.delete(currentProject.id, documentId);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handlePipelineComplete = async () => {
    try {
      const updatedProject = await api.projects.get(currentProject.id);
      setCurrentProject(updatedProject);
      setResultsRefreshKey((key) => key + 1);
      await onProjectUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh generated plan');
    }
  };

  const hasExtraction = Boolean(currentProject.extraction_result);

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader project={currentProject} onDeleted={onProjectDeleted} />

      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Input and Documents */}
            <div className="lg:col-span-2 space-y-6">
              <InputPanel
                onTextSubmit={handleTextSubmit}
                onFilesSelected={handleFilesSelected}
                isLoading={isUploading}
              />

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      Source Documents
                    </h3>
                    <p className="text-sm text-slate-500">
                      {documents.length} uploaded {documents.length === 1 ? 'file' : 'files'}
                    </p>
                  </div>
                </div>
                {isLoadingDocuments ? (
                  <Loading message="Loading documents..." />
                ) : (
                  <DocumentList
                    documents={documents}
                    onDelete={handleDeleteDocument}
                  />
                )}
              </div>
            </div>

            {/* Right Column: Pipeline */}
            <div className="lg:col-span-1">
              <ProcessingPipeline
                projectId={currentProject.id}
                hasDocuments={documents.length > 0}
                isExtracted={hasExtraction}
                onComplete={handlePipelineComplete}
              />
            </div>
          </div>

          {/* Results Panel - Show after extraction is complete */}
          {hasExtraction && (
            <div className="mt-8">
              <ResultsPanel project={currentProject} refreshKey={resultsRefreshKey} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Made with Bob
