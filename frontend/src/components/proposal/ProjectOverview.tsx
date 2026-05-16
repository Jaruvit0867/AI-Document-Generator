import React from 'react';
import { ProjectOverview as ProjectOverviewType } from '@/types/api';
import { ProposalSection } from './ProposalSection';

interface ProjectOverviewProps {
  data: ProjectOverviewType;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ data }) => {
  return (
    <ProposalSection title="Project Overview">
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-muted">Project Name</h4>
          <p className="text-sm leading-6 text-ink">{data.project_name}</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-muted">Problem Statement</h4>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink">{data.problem}</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-muted">Proposed Solution</h4>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink">{data.proposed_solution}</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink-muted">Target Users</h4>
          <ul className="list-inside list-disc space-y-1">
            {data.target_users.map((user, index) => (
              <li key={index} className="text-sm leading-6 text-ink">{user}</li>
            ))}
          </ul>
        </div>
      </div>
    </ProposalSection>
  );
};
