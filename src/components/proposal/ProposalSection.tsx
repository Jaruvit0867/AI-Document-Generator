import React, { useState } from 'react';

interface ProposalSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between bg-slate-50 px-5 py-4 text-left transition-colors hover:bg-slate-100 sm:px-6"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        <svg
          className={`h-5 w-5 text-slate-500 transition-transform ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="bg-white px-5 py-4 sm:px-6">
          {children}
        </div>
      )}
    </div>
  );
};

// Made with Bob
