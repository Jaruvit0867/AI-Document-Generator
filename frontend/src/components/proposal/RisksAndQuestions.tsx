import React from 'react';
import { ProposalSection } from './ProposalSection';

interface RisksAndQuestionsProps {
  risks?: string[];
  openQuestions?: string[];
}

export const RisksAndQuestions: React.FC<RisksAndQuestionsProps> = ({
  risks = [],
  openQuestions = [],
}) => {
  if (risks.length === 0 && openQuestions.length === 0) {
    return null;
  }

  return (
    <ProposalSection title="Risks & Open Questions">
      <div className="space-y-6">
        {risks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Risks
            </h4>
            <ul className="space-y-2">
              {risks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-red-500 mr-2 mt-0.5">⚠</span>
                  <span className="text-gray-900">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {openQuestions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Open Questions
            </h4>
            <ul className="space-y-2">
              {openQuestions.map((question: string, index: number) => (
                <li key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-500 mr-2 mt-0.5">?</span>
                  <span className="text-gray-900">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProposalSection>
  );
};

// Made with Bob