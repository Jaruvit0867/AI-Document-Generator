import React, { useId, useState } from 'react';
import { Diagram, ExtractionResult } from '@/types/api';
import { ProjectOverview } from './ProjectOverview';
import { Requirements } from './Requirements';
import { FeatureBreakdown } from './FeatureBreakdown';
import { UserFlow } from './UserFlow';
import { BusinessProcess } from './BusinessProcess';
import { Scope } from './Scope';
import { Architecture } from './Architecture';
import { Timeline } from './Timeline';
import { Button } from '@/components/ui';
import { ProposalDocument } from './export/ProposalDocument';
import { exportToDocx } from './export/exportDocx';
import { exportToPdf } from './export/exportPdf';

interface ProposalViewProps {
  proposal: ExtractionResult;
  projectName: string;
  diagrams?: Diagram[];
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  proposal,
  projectName,
  diagrams = [],
}) => {
  const exportDocumentId = useId().replace(/:/g, '-');
  const [exportType, setExportType] = useState<'pdf' | 'word' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const isExporting = exportType !== null;
  const safeFilename = projectName.replace(/\s+/g, '-').toLowerCase();

  const handleExportMarkdown = () => {
    const markdown = generateMarkdown(proposal, projectName);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}-proposal.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    const markdown = generateMarkdown(proposal, projectName);
    try {
      await navigator.clipboard.writeText(markdown);
      alert('Proposal copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleExportPdf = async () => {
    setExportType('pdf');
    setExportProgress(0);

    try {
      await exportToPdf(exportDocumentId, `${safeFilename}-proposal.pdf`, setExportProgress);
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to export PDF');
    } finally {
      setExportType(null);
      setExportProgress(0);
    }
  };

  const handleExportDocx = async () => {
    setExportType('word');

    try {
      await exportToDocx(proposal, projectName, diagrams, `${safeFilename}-proposal.docx`);
      alert('Word document exported successfully!');
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert(error instanceof Error ? error.message : 'Failed to export Word document');
    } finally {
      setExportType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Project Proposal</h2>
          <p className="mt-1 text-sm text-ink-faint">{projectName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export MD
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3m0 8l-3-3m3 3l3-3M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
            </svg>
            {exportType === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDocx}
            disabled={isExporting}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {exportType === 'word' ? 'Exporting...' : 'Export Word'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <ProjectOverview data={proposal.project_overview} />
        <Requirements data={proposal.requirements} />
        <FeatureBreakdown features={proposal.feature_breakdown} />
        <UserFlow steps={proposal.user_flow} />
        <BusinessProcess steps={proposal.business_process} />
        <Scope data={proposal.scope} />
        <Architecture data={proposal.architecture} />
        <Timeline milestones={proposal.timeline} />
      </div>

      <div
        id={exportDocumentId}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-10000px] top-0 -z-10 w-[900px] bg-surface-raised"
      >
        <ProposalDocument proposal={proposal} projectName={projectName} diagrams={diagrams} />
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-surface-raised p-6 shadow-sm shadow-black/[0.03]">
            <h3 className="text-base font-semibold text-ink">
              Exporting {exportType === 'pdf' ? 'PDF' : 'Word Document'}...
            </h3>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: exportType === 'pdf' ? `${Math.max(exportProgress, 12)}%` : '50%' }}
              />
            </div>
            <p className="mt-4 text-center text-sm text-ink-muted">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

function generateMarkdown(proposal: ExtractionResult, projectName: string): string {
  let md = `# ${projectName} - Project Proposal\n\n`;

  md += `## Project Overview\n\n`;
  md += `**Project Name:** ${proposal.project_overview.project_name}\n\n`;
  md += `**Problem Statement:**\n${proposal.project_overview.problem}\n\n`;
  md += `**Proposed Solution:**\n${proposal.project_overview.proposed_solution}\n\n`;
  md += `**Target Users:**\n${proposal.project_overview.target_users.map((u) => `- ${u}`).join('\n')}\n\n`;

  md += `## Requirements\n\n`;
  md += `### Functional Requirements\n${proposal.requirements.functional.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
  md += `### Non-Functional Requirements\n${proposal.requirements.non_functional.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;

  md += `## Feature Breakdown\n${proposal.feature_breakdown.map((f) => `- ${f}`).join('\n')}\n\n`;

  md += `## User Flow\n${proposal.user_flow.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;

  md += `## Business Process\n${proposal.business_process.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;

  md += `## Project Scope\n\n`;
  md += `### In Scope\n${proposal.scope.in_scope.map((i) => `- ${i}`).join('\n')}\n\n`;
  md += `### Out of Scope\n${proposal.scope.out_of_scope.map((i) => `- ${i}`).join('\n')}\n\n`;

  md += `## Technical Architecture\n\n`;
  md += `**Frontend:** ${proposal.architecture.frontend}\n\n`;
  md += `**Backend:** ${proposal.architecture.backend}\n\n`;
  md += `**Database:** ${proposal.architecture.database}\n\n`;
  md += `**Infrastructure:** ${proposal.architecture.infrastructure}\n\n`;
  if (proposal.architecture.integrations.length > 0) {
    md += `**Integrations:**\n${proposal.architecture.integrations.map((i) => `- ${i}`).join('\n')}\n\n`;
  }

  md += `## Timeline & Milestones\n${proposal.timeline.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n`;

  return md;
}
