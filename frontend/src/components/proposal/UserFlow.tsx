import React from 'react';
import { ProposalSection } from './ProposalSection';

interface UserFlowProps {
  steps: string[];
}

export const UserFlow: React.FC<UserFlowProps> = ({ steps }) => {
  return (
    <ProposalSection title="User Flow">
      <div className="space-y-3">
        {steps.map((step: string, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-indigo-200 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-gray-900">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </ProposalSection>
  );
};

// Made with Bob