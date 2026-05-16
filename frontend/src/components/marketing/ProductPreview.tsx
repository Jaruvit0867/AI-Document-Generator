'use client';

import { motion } from './Motion';

const pipelineSteps = [
  { name: 'Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { name: 'Extract', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { name: 'Diagram', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { name: 'Export', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

export const ProductPreview = () => {
  return (
    <div className="relative mx-auto w-full max-w-[350px] overflow-hidden sm:max-w-5xl">
      {/* Ambient glow */}
      <div className="absolute -inset-6 rounded-[2rem] bg-accent/[0.07] blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised/95 shadow-2xl shadow-ink/[0.08] backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-ink">
                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-ink-muted">Plan Generator Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-ink-faint">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        {/* Main content */}
        <div className="p-5 sm:p-6">
          {/* Top: Project header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Campus Event Booking Portal</p>
              <p className="mt-0.5 text-xs text-ink-faint">Requirement analysis in progress</p>
            </div>
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent ring-1 ring-accent/20">
              2 docs uploaded
            </span>
          </div>

          {/* Pipeline */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0.4, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-xl border p-3.5 transition-all ${
                  index < 3
                    ? 'border-success/30 bg-success-soft/50'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    index < 3
                      ? 'bg-success text-white'
                      : 'bg-accent text-white'
                  }`}>
                    {index < 3 ? (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{step.name}</p>
                    <p className="text-[10px] text-ink-faint">
                      {index === 0 ? 'Done' : index === 1 ? 'Done' : index === 2 ? 'Done' : 'Ready'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint">Generated Output</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Bottom: Generated results */}
          <div className="grid min-w-0 gap-4 sm:grid-cols-[1fr_1fr_1.2fr]">
            {/* Stats */}
            {[
              ['Functional Reqs', '8', 'captured'],
              ['User Stories', '12', 'drafted'],
              ['Open Tasks', '18', 'ready'],
            ].map(([label, value, status]) => (
              <div key={label} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">{value}</p>
                <p className="text-[11px] text-ink-faint">{status}</p>
              </div>
            ))}

            {/* Architecture diagram */}
            <div className="sm:col-span-3 rounded-xl border border-ink/80 bg-ink p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white">Architecture</p>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                    Auto-rendered
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {['Frontend', 'API', 'Database'].map((tag) => (
                    <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-4">
                {[
                  { name: 'Frontend', color: 'bg-[#c084fc]/20 border-[#c084fc]/40 text-[#d8b4fe]', glow: 'shadow-[0_0_12px_-2px_rgba(192,132,252,0.35)]' },
                  { name: 'API', color: 'bg-[#34d399]/20 border-[#34d399]/40 text-[#6ee7b7]', glow: 'shadow-[0_0_12px_-2px_rgba(52,211,153,0.35)]' },
                  { name: 'Database', color: 'bg-[#38bdf8]/20 border-[#38bdf8]/40 text-[#7dd3fc]', glow: 'shadow-[0_0_12px_-2px_rgba(56,189,248,0.35)]' },
                ].map((node, index) => (
                  <div key={node.name} className="flex items-center gap-3">
                    <div className={`flex h-11 w-28 items-center justify-center rounded-lg border px-3 text-xs font-semibold ${node.color} ${node.glow}`}>
                      {node.name}
                    </div>
                    {index < 2 && (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="h-px w-5 bg-white/20" />
                        <svg className="h-3 w-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export bar */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-ink-faint">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as
            </div>
            <div className="flex gap-2">
              {['PDF', 'Word', 'Markdown'].map((fmt) => (
                <span key={fmt} className="rounded-md border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-accent/30 hover:text-accent">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
