import React, { useState } from 'react';
import { ExtractionResult, Diagram } from '@/types/api';
import { ProjectOverview } from './ProjectOverview';
import { Requirements } from './Requirements';
import { FeatureBreakdown } from './FeatureBreakdown';
import { UserFlow } from './UserFlow';
import { BusinessProcess } from './BusinessProcess';
import { Scope } from './Scope';
import { Architecture } from './Architecture';
import { Timeline } from './Timeline';
import { Button } from '@/components/ui';
import { exportToDocx } from './export/exportDocx';

interface ProposalViewProps {
  proposal: ExtractionResult;
  projectName: string;
  diagrams?: Diagram[];
}

export const ProposalView: React.FC<ProposalViewProps> = ({ proposal, projectName, diagrams = [] }) => {
  const [isExporting, setIsExporting] = useState(false);
  const handleExportMarkdown = () => {
    const markdown = generateMarkdown(proposal, projectName);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-proposal.md`;
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

  const handleExportDocx = async () => {
    setIsExporting(true);

    try {
      const filename = `${projectName.replace(/\s+/g, '-').toLowerCase()}-proposal.docx`;
      await exportToDocx(proposal, projectName, diagrams, filename);
      alert('Word document exported successfully!');
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert(error instanceof Error ? error.message : 'Failed to export Word document');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Actions */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Project Proposal</h2>
          <p className="mt-1 text-sm text-slate-500">{projectName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMarkdown}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export MD
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDocx}
            disabled={isExporting}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isExporting ? 'Exporting...' : 'Export Word'}
          </Button>
        </div>
      </div>

      {/* Proposal Sections */}
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

      {/* Export Progress Modal */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Exporting Word Document...</h3>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
            </div>
            <p className="mt-4 text-center text-sm text-slate-600">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate markdown
function generateMarkdown(proposal: ExtractionResult, projectName: string): string {
  let md = `# ${projectName} - Project Proposal\n\n`;
  
  md += `## Project Overview\n\n`;
  md += `**Project Name:** ${proposal.project_overview.project_name}\n\n`;
  md += `**Problem Statement:**\n${proposal.project_overview.problem}\n\n`;
  md += `**Proposed Solution:**\n${proposal.project_overview.proposed_solution}\n\n`;
  md += `**Target Users:**\n${proposal.project_overview.target_users.map(u => `- ${u}`).join('\n')}\n\n`;
  
  md += `## Requirements\n\n`;
  md += `### Functional Requirements\n${proposal.requirements.functional.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
  md += `### Non-Functional Requirements\n${proposal.requirements.non_functional.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
  
  md += `## Feature Breakdown\n${proposal.feature_breakdown.map(f => `- ${f}`).join('\n')}\n\n`;
  
  md += `## User Flow\n${proposal.user_flow.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
  
  md += `## Business Process\n${proposal.business_process.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
  
  md += `## Project Scope\n\n`;
  md += `### In Scope\n${proposal.scope.in_scope.map(i => `- ${i}`).join('\n')}\n\n`;
  md += `### Out of Scope\n${proposal.scope.out_of_scope.map(i => `- ${i}`).join('\n')}\n\n`;
  
  md += `## Technical Architecture\n\n`;
  md += `**Frontend:** ${proposal.architecture.frontend}\n\n`;
  md += `**Backend:** ${proposal.architecture.backend}\n\n`;
  md += `**Database:** ${proposal.architecture.database}\n\n`;
  md += `**Infrastructure:** ${proposal.architecture.infrastructure}\n\n`;
  if (proposal.architecture.integrations.length > 0) {
    md += `**Integrations:**\n${proposal.architecture.integrations.map(i => `- ${i}`).join('\n')}\n\n`;
  }
  
  md += `## Timeline & Milestones\n${proposal.timeline.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n`;
  
  return md;
}

// Made with Bob
