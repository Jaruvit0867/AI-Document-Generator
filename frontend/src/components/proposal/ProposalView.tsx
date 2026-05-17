import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Diagram, ExtractionResult } from '@/types/api';
import { ProjectOverview } from './ProjectOverview';
import { Requirements } from './Requirements';
import { FeatureBreakdown } from './FeatureBreakdown';
import { UserFlow } from './UserFlow';
import { BusinessProcess } from './BusinessProcess';
import { Scope } from './Scope';
import { Architecture } from './Architecture';
import { Timeline } from './Timeline';
import { RisksAndQuestions } from './RisksAndQuestions';
import { Button } from '@/components/ui';
import { ProposalDocument } from './export/ProposalDocument';
import { exportToDocx } from './export/exportDocx';
import { exportToPdf } from './export/exportPdf';

interface ProposalViewProps {
  proposal: ExtractionResult;
  projectName: string;
  diagrams?: Diagram[];
}

type ExportNotice = {
  type: 'success' | 'error';
  message: string;
} | null;

const waitForExportOverlayPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.setTimeout(resolve, 80);
      });
    });
  });

export const ProposalView: React.FC<ProposalViewProps> = ({
  proposal,
  projectName,
  diagrams = [],
}) => {
  const exportDocumentId = useId().replace(/:/g, '-');
  const [exportType, setExportType] = useState<'pdf' | 'word' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState('Preparing document');
  const [notice, setNotice] = useState<ExportNotice>(null);
  const isExporting = exportType !== null;
  const safeFilename = projectName.replace(/\s+/g, '-').toLowerCase();

  const showNotice = (nextNotice: NonNullable<ExportNotice>) => {
    setNotice(nextNotice);
    window.setTimeout(() => setNotice(null), 3200);
  };

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
    showNotice({ type: 'success', message: 'Markdown download started.' });
  };

  const handleCopyToClipboard = async () => {
    const markdown = generateMarkdown(proposal, projectName);
    try {
      await navigator.clipboard.writeText(markdown);
      showNotice({ type: 'success', message: 'Proposal copied to clipboard.' });
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotice({ type: 'error', message: 'Could not copy proposal.' });
    }
  };

  const handleExportPdf = async () => {
    setExportType('pdf');
    setExportProgress(0);
    setExportStage('Preparing export canvas');
    await waitForExportOverlayPaint();

    try {
      await exportToPdf(exportDocumentId, `${safeFilename}-proposal.pdf`, (progress) => {
        setExportProgress(progress);
        if (progress >= 70) {
          setExportStage('Packaging PDF');
        } else if (progress >= 40) {
          setExportStage('Capturing proposal layout');
        } else if (progress >= 20) {
          setExportStage('Rendering diagrams');
        }
      });
      showNotice({ type: 'success', message: 'PDF export started.' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to export PDF.',
      });
    } finally {
      setExportType(null);
      setExportProgress(0);
      setExportStage('Preparing document');
    }
  };

  const handleExportDocx = async () => {
    setExportType('word');
    setExportProgress(35);
    setExportStage('Rendering Mermaid diagrams');
    await waitForExportOverlayPaint();

    try {
      await exportToDocx(proposal, projectName, diagrams, `${safeFilename}-proposal.docx`);
      showNotice({ type: 'success', message: 'Word export started.' });
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      showNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to export Word document.',
      });
    } finally {
      setExportType(null);
      setExportProgress(0);
      setExportStage('Preparing document');
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
        <RisksAndQuestions
          risks={proposal.risks}
          openQuestions={proposal.open_questions}
        />
      </div>

      <div
        id={exportDocumentId}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-10000px] top-0 -z-10 w-[900px] bg-surface-raised"
      >
        <ProposalDocument proposal={proposal} projectName={projectName} diagrams={diagrams} />
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`fixed bottom-6 left-4 right-4 z-[60] rounded-2xl border bg-surface-raised px-4 py-3 shadow-xl shadow-black/10 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm ${
              notice.type === 'success' ? 'border-emerald-200' : 'border-red-200'
            }`}
            role="status"
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  notice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {notice.type === 'success' ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.55 6.54-6.55a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0 1 1 0 01-2 0zm.293-7.707a1 1 0 011.414 0L11 5.586V10a1 1 0 11-2 0V5.586l.293-.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {notice.type === 'success' ? 'Done' : 'Export failed'}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{notice.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4 backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-surface-raised p-7 shadow-2xl shadow-black/20"
            >
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-accent/15 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />

              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 ring-1 ring-accent/15">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="absolute inset-1 rounded-full border-2 border-accent/15" />
                    <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-accent border-l-accent motion-safe:animate-spin" />
                    <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {exportType === 'pdf' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V3m0 8l-3-3m3 3l3-3M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                    </svg>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    Exporting {exportType === 'pdf' ? 'PDF' : 'Word document'}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">{exportStage}</p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-medium text-ink-faint">
                    <span>Preparing file</span>
                    <span>{exportType === 'pdf' ? `${Math.max(exportProgress, 12)}%` : 'Working'}</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
                      style={{
                        width: exportType === 'pdf' ? `${Math.max(exportProgress, 12)}%` : '68%',
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {['Layout', 'Diagrams', 'Download'].map((step) => (
                    <div
                      key={step}
                      className="rounded-xl border border-border bg-surface px-2 py-2 text-center text-xs font-medium text-ink-muted"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
