'use client';

import { motion } from './Motion';

const pipelineSteps = ['Upload', 'Extract', 'Diagram', 'Export'];

export const ProductPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-[350px] overflow-hidden sm:max-w-5xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-accent/8 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised/90 shadow-2xl shadow-ink/[0.08] backdrop-blur">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="hidden rounded-full bg-border/40 px-3 py-1 text-xs font-medium text-ink-muted sm:block">
            Plan Generator Workspace
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-border bg-surface/80 p-4 sm:p-5 lg:border-b-0 lg:border-r">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Requirement Brief
              </p>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/20">
                2 docs
              </span>
            </div>
            <div className="rounded-xl border border-border bg-surface-raised p-4 shadow-sm shadow-black/[0.03]">
              <p className="text-sm font-semibold text-ink">Campus Event Booking Portal</p>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Students need a faster way to book rooms, route approvals, avoid calendar conflicts, and notify reviewers.
              </p>
              <div className="mt-4 space-y-2">
                {['Role-based access', 'Room conflict checks', 'Security review rules'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {pipelineSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.45, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.4 }}
                  className="rounded-lg border border-border bg-surface-raised px-2 py-3 text-center shadow-sm shadow-black/[0.02]"
                >
                  <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-xs font-bold text-success ring-1 ring-success/20">
                    {index + 1}
                  </div>
                  <p className="text-[11px] font-medium text-ink-muted">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Generated Plan</p>
                <p className="text-xs text-ink-faint">Proposal, diagrams, and export-ready output</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-muted">
                  PDF
                </span>
                <span className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-muted">
                  Word
                </span>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 sm:grid-cols-[0.9fr_1fr]">
              <div className="space-y-3">
                {[
                  ['Functional Requirements', '8 captured'],
                  ['User Stories', '12 drafted'],
                  ['Open Tasks', '18 ready'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border bg-surface-raised p-3 shadow-sm shadow-black/[0.02]">
                    <p className="text-xs font-medium text-ink-faint">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-ink p-4 text-white shadow-sm shadow-ink/20">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Architecture
                  </p>
                  <span className="rounded-full bg-success/15 px-2 py-1 text-[11px] text-success">
                    Rendered
                  </span>
                </div>
                <div className="space-y-3">
                  {['Frontend', 'API', 'Database'].map((node, index) => (
                    <div key={node} className="flex items-center gap-3">
                      <div className="h-10 flex-1 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium">
                        {node}
                      </div>
                      {index < 2 && <div className="h-px w-6 bg-accent/60" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
