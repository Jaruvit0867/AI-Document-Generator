import React from 'react';
import { ProposalSection } from './ProposalSection';

interface TimelineProps {
  milestones: string[];
}

export const Timeline: React.FC<TimelineProps> = ({ milestones }) => {
  return (
    <ProposalSection title="Timeline & Milestones">
      <div className="space-y-4">
        {milestones.map((milestone: string, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 border-2 border-teal-500">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {index < milestones.length - 1 && (
                <div className="w-0.5 h-12 bg-teal-200 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <p className="text-gray-900 font-medium">{milestone}</p>
            </div>
          </div>
        ))}
      </div>
    </ProposalSection>
  );
};

// Made with Bob