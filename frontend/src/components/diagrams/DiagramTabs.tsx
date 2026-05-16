import React from 'react';
import { DiagramType } from '@/types/api';

interface DiagramTabsProps {
  activeType: DiagramType;
  onTypeChange: (type: DiagramType) => void;
  availableTypes: DiagramType[];
}

const diagramTypeLabels: Record<DiagramType, string> = {
  system_architecture: 'System Architecture',
  user_flow: 'User Flow',
  development_workflow: 'Development Workflow',
  data_model: 'Data Model',
};

const diagramTypeIcons: Record<DiagramType, React.ReactNode> = {
  system_architecture: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  user_flow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  development_workflow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  data_model: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
};

export const DiagramTabs: React.FC<DiagramTabsProps> = ({
  activeType,
  onTypeChange,
  availableTypes,
}) => {
  return (
    <div className="border-b border-border px-4 py-3">
      <nav className="flex gap-2 overflow-x-auto" aria-label="Diagram types">
        {availableTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`
              inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors
              ${
                activeType === type
                  ? 'bg-accent-soft text-accent ring-1 ring-inset ring-accent/20'
                  : 'text-ink-muted hover:bg-surface-raised hover:text-ink'
              }
            `}
          >
            {diagramTypeIcons[type]}
            {diagramTypeLabels[type]}
          </button>
        ))}
      </nav>
    </div>
  );
};
