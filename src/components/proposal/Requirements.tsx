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
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Functional Requirements</h4>
          <ul className="space-y-2">
            {data.functional.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-slate-950">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Non-Functional Requirements</h4>
          <ul className="space-y-2">
            {data.non_functional.map((req: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-slate-950">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProposalSection>
  );
};

// Made with Bob
