import React, { useState, useEffect } from 'react';
import { Diagram, DiagramType } from '@/types/api';
import { MermaidDiagram } from './MermaidDiagram';
import { DiagramTabs } from './DiagramTabs';
import { DiagramControls } from './DiagramControls';
import { EmptyState } from '@/components/ui';

interface DiagramViewProps {
  diagrams: Diagram[];
}

export const DiagramView: React.FC<DiagramViewProps> = ({ diagrams }) => {
  const [activeType, setActiveType] = useState<DiagramType>(
    diagrams.length > 0 ? diagrams[0].diagram_type : 'system_architecture'
  );

  // Ensure activeType is always valid when diagrams change
  useEffect(() => {
    if (diagrams.length > 0) {
      const availableTypes = diagrams.map(d => d.diagram_type);
      if (!availableTypes.includes(activeType)) {
        setActiveType(diagrams[0].diagram_type);
      }
    }
  }, [diagrams, activeType]);

  if (diagrams.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        title="No Diagrams Available"
        description="Generate diagrams by processing your documents first."
      />
    );
  }

  const availableTypes = diagrams.map(d => d.diagram_type);
  const activeDiagram = diagrams.find(d => d.diagram_type === activeType);

  if (!activeDiagram) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Diagram Not Found"
        description="The selected diagram type is not available."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <DiagramTabs
          activeType={activeType}
          onTypeChange={setActiveType}
          availableTypes={availableTypes}
        />

        <div className="p-4 sm:p-6">
          <h3 className="mb-4 text-base font-semibold text-slate-950">
            {activeDiagram.title}
          </h3>
          <MermaidDiagram
            content={activeDiagram.mermaid_content}
            id={`diagram-${activeDiagram.diagram_type}-${activeDiagram.id}`}
          />
        </div>

        <DiagramControls
          mermaidContent={activeDiagram.mermaid_content}
          diagramTitle={activeDiagram.title}
        />
      </div>

      {/* Diagram Source Code (Collapsible) */}
      <details className="rounded-lg border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100">
          View Mermaid Source Code
        </summary>
        <div className="border-t border-slate-200 px-4 py-3">
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
            <code>{activeDiagram.mermaid_content}</code>
          </pre>
        </div>
      </details>
    </div>
  );
};

// Made with Bob
