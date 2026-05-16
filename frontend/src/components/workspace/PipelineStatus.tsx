import React from 'react';
import { Badge, Spinner } from '@/components/ui';

export type PipelineStep = 'upload' | 'embeddings' | 'extract' | 'diagrams' | 'proposal';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'error';

interface PipelineStepInfo {
  id: PipelineStep;
  label: string;
  description: string;
}

const steps: PipelineStepInfo[] = [
  { id: 'upload', label: 'Upload', description: 'Source ready' },
  { id: 'embeddings', label: 'Index', description: 'Context prepared' },
  { id: 'extract', label: 'Extract', description: 'Requirements mapped' },
  { id: 'diagrams', label: 'Diagram', description: 'Flows created' },
  { id: 'proposal', label: 'Proposal', description: 'Plan ready' },
];

interface PipelineStatusProps {
  currentStep: PipelineStep | null;
  stepStatuses: Record<PipelineStep, StepStatus>;
}

export const PipelineStatus: React.FC<PipelineStatusProps> = ({
  currentStep,
  stepStatuses,
}) => {
  const getStepIcon = (step: PipelineStep) => {
    const status = stepStatuses[step];

    if (status === 'completed') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success shadow-sm shadow-black/[0.03]">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    if (status === 'in_progress') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent animate-pulse-ring shadow-sm shadow-black/[0.03]">
          <Spinner size="sm" className="text-white" />
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error shadow-sm shadow-black/[0.03]">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border text-ink-muted">
        <span className="text-sm font-medium text-ink-muted">
          {steps.findIndex(s => s.id === step) + 1}
        </span>
      </div>
    );
  };

  const getStepBadge = (step: PipelineStep) => {
    const status = stepStatuses[step];

    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'error':
        return <Badge variant="error">Error</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface-raised p-5 shadow-sm shadow-black/[0.03] sm:p-6">
      <h3 className="mb-1 text-base font-semibold text-ink">Processing Pipeline</h3>
      <p className="mb-5 text-sm text-ink-faint">Live generation status.</p>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={currentStep === step.id ? 'rounded-lg bg-accent-soft/50 p-2 ring-1 ring-inset ring-accent/20' : ''}
          >
            <div className="flex items-center gap-4">
              {getStepIcon(step.id)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-ink">{step.label}</h4>
                  {getStepBadge(step.id)}
                </div>
                <p className="text-xs text-ink-faint">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="mb-2 ml-4 mt-2 h-8 w-0.5 bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
