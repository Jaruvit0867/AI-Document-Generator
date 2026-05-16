import React from 'react';
import { Requirements as RequirementsType } from '@/types/api';
import { ProposalSection } from './ProposalSection';

interface RequirementsProps {
  data: RequirementsType;
}

export const Requirements: React.FC<RequirementsProps> = ({ data }) => {
  return (
    <ProposalSection title="Requirements">
      <div className="space-y-6">
        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink-muted">Functional Requirements</h4>
          <ul className="space-y-2">
            {data.functional.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-medium text-accent ring-1 ring-inset ring-accent/20">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-ink">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink-muted">Non-Functional Requirements</h4>
          <ul className="space-y-2">
            {data.non_functional.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-warning-soft text-xs font-medium text-warning ring-1 ring-inset ring-warning/20">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-ink">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProposalSection>
  );
};
