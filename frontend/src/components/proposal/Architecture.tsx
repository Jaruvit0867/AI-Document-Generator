import React from 'react';
import { Architecture as ArchitectureType } from '@/types/api';
import { ProposalSection } from './ProposalSection';

interface ArchitectureProps {
  data: ArchitectureType;
}

export const Architecture: React.FC<ArchitectureProps> = ({ data }) => {
  return (
    <ProposalSection title="Technical Architecture">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-accent-soft rounded-lg border border-accent/20">
            <h4 className="text-sm font-semibold text-accent mb-2">Frontend</h4>
            <p className="text-ink">{data.frontend}</p>
          </div>

          <div className="p-4 bg-success-soft rounded-lg border border-success/20">
            <h4 className="text-sm font-semibold text-success mb-2">Backend</h4>
            <p className="text-ink">{data.backend}</p>
          </div>

          <div className="p-4 bg-surface rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-ink mb-2">Database</h4>
            <p className="text-ink">{data.database}</p>
          </div>

          <div className="p-4 bg-warning-soft rounded-lg border border-warning/20">
            <h4 className="text-sm font-semibold text-warning mb-2">Infrastructure</h4>
            <p className="text-ink">{data.infrastructure}</p>
          </div>
        </div>

        {data.integrations && data.integrations.length > 0 && (
          <div className="p-4 bg-surface rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-ink mb-3">Integrations</h4>
            <ul className="space-y-1">
              {data.integrations.map((integration: string, index: number) => (
                <li key={index} className="flex items-center text-ink">
                  <svg className="w-4 h-4 text-ink-faint mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  {integration}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProposalSection>
  );
};
