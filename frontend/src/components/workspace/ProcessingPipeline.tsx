import React, { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { PipelineStatus, PipelineStep, StepStatus } from './PipelineStatus';
import api from '@/lib/api';

interface ProcessingPipelineProps {
  projectId: number;
  hasDocuments: boolean;
  isExtracted?: boolean;
  onComplete: () => void | Promise<void>;
}

const getInitialStatuses = (
  hasDocuments: boolean,
  isExtracted: boolean
): Record<PipelineStep, StepStatus> => ({
  upload: hasDocuments ? 'completed' : 'pending',
  embeddings: isExtracted ? 'completed' : 'pending',
  extract: isExtracted ? 'completed' : 'pending',
  diagrams: isExtracted ? 'completed' : 'pending',
  proposal: isExtracted ? 'completed' : 'pending',
});

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  projectId,
  hasDocuments,
  isExtracted = false,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<PipelineStep | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Record<PipelineStep, StepStatus>>(
    getInitialStatuses(hasDocuments, isExtracted)
  );
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasLocalCompletion, setHasLocalCompletion] = useState(false);

  useEffect(() => {
    setHasLocalCompletion(false);
  }, [projectId]);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(null);
      setStepStatuses(getInitialStatuses(hasDocuments, isExtracted || hasLocalCompletion));
    }
  }, [hasDocuments, hasLocalCompletion, isExtracted, isProcessing]);

  const updateStepStatus = (step: PipelineStep, status: StepStatus) => {
    setStepStatuses(prev => ({ ...prev, [step]: status }));
  };

  const handleGenerateProposal = async () => {
    setError('');
    setIsProcessing(true);
    setHasLocalCompletion(false);
    setStepStatuses(getInitialStatuses(hasDocuments, false));
    let activeStep: PipelineStep | null = null;

    const runStep = async (step: PipelineStep, action: () => Promise<unknown>) => {
      activeStep = step;
      setCurrentStep(step);
      updateStepStatus(step, 'in_progress');
      await action();
      updateStepStatus(step, 'completed');
    };

    try {
      await runStep('embeddings', () => api.extraction.processEmbeddings(projectId));
      await runStep('extract', () => api.extraction.extract(projectId));
      await runStep('diagrams', () => api.diagrams.generate(projectId));

      // Step 4: Mark proposal as complete
      activeStep = 'proposal';
      setCurrentStep('proposal');
      updateStepStatus('proposal', 'completed');
      setHasLocalCompletion(true);

      setCurrentStep(null);
      await onComplete();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate proposal';
      setError(errorMessage);

      if (activeStep) {
        updateStepStatus(activeStep, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-ink">Generate Plan</h3>
            <p className="mt-1 text-sm leading-6 text-ink-faint">
              Extract, diagram, and package outputs.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-error/30 bg-error-soft p-3 text-sm text-error">
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="mb-4 rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm text-accent">
            <div className="flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating outputs. This can take a moment.
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerateProposal}
          disabled={!hasDocuments || isProcessing}
          isLoading={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Generating...' : isExtracted ? 'Regenerate Plan' : 'Generate Plan'}
        </Button>

        {!hasDocuments && (
          <p className="mt-3 text-center text-sm text-ink-faint">
            Add requirements first.
          </p>
        )}
      </Card>

      <PipelineStatus currentStep={currentStep} stepStatuses={stepStatuses} />
    </div>
  );
};
