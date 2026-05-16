import React from 'react';
import { Scope as ScopeType } from '@/types/api';
import { ProposalSection } from './ProposalSection';

interface ScopeProps {
  data: ScopeType;
}

export const Scope: React.FC<ScopeProps> = ({ data }) => {
  return (
    <ProposalSection title="Project Scope">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-success mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            In Scope
          </h4>
          <ul className="space-y-2">
            {data.in_scope.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-success mr-2">✓</span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-error mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Out of Scope
          </h4>
          <ul className="space-y-2">
            {data.out_of_scope.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-error mr-2">✗</span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProposalSection>
  );
};
