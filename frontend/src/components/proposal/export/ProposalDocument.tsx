import React from 'react';
import { ExtractionResult, Diagram } from '@/types/api';

interface ProposalDocumentProps {
  proposal: ExtractionResult;
  projectName: string;
  diagrams?: Diagram[];
}

export const ProposalDocument: React.FC<ProposalDocumentProps> = ({
  proposal,
  projectName,
  diagrams = [],
}) => {
  return (
    <div className="proposal-document bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Cover Page */}
      <div className="cover-page mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">{projectName}</h1>
        <h2 className="text-2xl font-semibold mb-8 text-slate-700">Project Proposal</h2>
        <div className="mt-16 text-slate-600">
          <p className="text-lg">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Project Overview */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Project Overview
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Project Name</h3>
            <p className="text-slate-700">{proposal.project_overview.project_name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Problem Statement</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{proposal.project_overview.problem}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Proposed Solution</h3>
            <p className="text-slate-700 whitespace-pre-wrap">{proposal.project_overview.proposed_solution}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Target Users</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {proposal.project_overview.target_users.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Requirements
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Functional Requirements</h3>
            <ol className="list-decimal list-inside text-slate-700 space-y-1">
              {proposal.requirements.functional.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Non-Functional Requirements</h3>
            <ol className="list-decimal list-inside text-slate-700 space-y-1">
              {proposal.requirements.non_functional.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Feature Breakdown
        </h2>
        <ul className="list-disc list-inside text-slate-700 space-y-1">
          {proposal.feature_breakdown.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </section>

      {/* User Flow */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          User Flow
        </h2>
        <ol className="list-decimal list-inside text-slate-700 space-y-1">
          {proposal.user_flow.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Business Process */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Business Process
        </h2>
        <ol className="list-decimal list-inside text-slate-700 space-y-1">
          {proposal.business_process.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Project Scope */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Project Scope
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">In Scope</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {proposal.scope.in_scope.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Out of Scope</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {proposal.scope.out_of_scope.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Technical Architecture
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Frontend</h3>
            <p className="text-slate-700">{proposal.architecture.frontend}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Backend</h3>
            <p className="text-slate-700">{proposal.architecture.backend}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Database</h3>
            <p className="text-slate-700">{proposal.architecture.database}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Infrastructure</h3>
            <p className="text-slate-700">{proposal.architecture.infrastructure}</p>
          </div>
          {proposal.architecture.integrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Integrations</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {proposal.architecture.integrations.map((integration, idx) => (
                  <li key={idx}>{integration}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Timeline & Milestones */}
      <section className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
          Timeline & Milestones
        </h2>
        <ol className="list-decimal list-inside text-slate-700 space-y-1">
          {proposal.timeline.map((milestone, idx) => (
            <li key={idx}>{milestone}</li>
          ))}
        </ol>
      </section>

      {/* Diagrams Section */}
      {diagrams.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b-2 border-blue-600 pb-2">
            Project Diagrams
          </h2>
          <div className="space-y-6">
            {diagrams.map((diagram) => (
              <div key={diagram.id} className="diagram-container page-break-inside-avoid">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{diagram.title}</h3>
                <div
                  className="mermaid-diagram border border-slate-300 rounded p-4 bg-slate-50"
                  data-diagram-id={diagram.id}
                  data-diagram-content={diagram.mermaid_content}
                >
                  {/* Mermaid diagram will be rendered here during export */}
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                    {diagram.mermaid_content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Made with Bob