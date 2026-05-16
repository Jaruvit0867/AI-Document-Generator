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
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Frontend</h4>
            <p className="text-gray-900">{data.frontend}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Backend</h4>
            <p className="text-gray-900">{data.backend}</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Database</h4>
            <p className="text-gray-900">{data.database}</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Infrastructure</h4>
            <p className="text-gray-900">{data.infrastructure}</p>
          </div>
        </div>

        {data.integrations && data.integrations.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Integrations</h4>
            <ul className="space-y-1">
              {data.integrations.map((integration: string, index: number) => (
                <li key={index} className="flex items-center text-gray-900">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
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

// Made with Bob