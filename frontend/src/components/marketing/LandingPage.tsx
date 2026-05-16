'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { MotionCard, Reveal, Stagger, motion } from './Motion';
import { ProductPreview } from './ProductPreview';

const features = [
  {
    title: 'Extract requirements',
    description: 'Turn messy briefs, PDFs, and DOCX files into structured requirements.',
  },
  {
    title: 'Generate proposals',
    description: 'Create a polished project proposal with scope, architecture, and timeline.',
  },
  {
    title: 'Create diagrams',
    description: 'Produce architecture and user-flow diagrams from the same source context.',
  },
  {
    title: 'Chat with docs',
    description: 'Ask project questions against uploaded materials and generated context.',
  },
  {
    title: 'Export deliverables',
    description: 'Ship PDF, Word, and Markdown outputs for stakeholders and dev teams.',
  },
];

const benefits = [
  'Reduce requirement cleanup time before planning starts.',
  'Align product, engineering, and stakeholders around one source of truth.',
  'Convert rough notes into implementation-ready plans.',
  'Move faster in hackathons, discovery, internal tools, and client proposals.',
];

const steps = [
  {
    title: 'Upload docs or paste text',
    description: 'Drop in raw requirements, meeting notes, proposals, or technical constraints.',
  },
  {
    title: 'Run AI extraction',
    description: 'The system structures requirements, scope, users, risks, and milestones.',
  },
  {
    title: 'Review generated outputs',
    description: 'Inspect the proposal, diagrams, and project chat in one workspace.',
  },
  {
    title: 'Export and share',
    description: 'Send clean PDF, Word, or Markdown deliverables to the team.',
  },
];

const useCases = ['Hackathon teams', 'Product owners', 'Developers', 'Solution architects'];

export const LandingPage = () => {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-surface-raised text-ink">
      {/* Hero */}
      <section className="relative border-b border-border bg-[radial-gradient(ellipse_at_top_left,rgba(124,58,237,0.08),transparent_40%),linear-gradient(180deg,var(--surface)_0%,#FFFFFF_72%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-lg shadow-ink/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m5-9v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-4 text-ink">Plan Generator</p>
              <p className="text-xs text-ink-faint">AI development planning</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-muted md:flex">
            <a href="#features" className="transition-colors hover:text-ink">Features</a>
            <a href="#workflow" className="transition-colors hover:text-ink">Workflow</a>
            <a href="#teams" className="transition-colors hover:text-ink">Use cases</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={authed ? '/dashboard' : '/auth/login'}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-border/30 hover:text-ink sm:inline-flex"
            >
              {authed ? 'Dashboard' : 'Sign in'}
            </Link>
            <Link
              href={authed ? '/dashboard' : '/auth/register'}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)]"
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Start planning</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
          <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
            <Reveal>
              <div className="w-full max-w-[350px] sm:max-w-3xl">
                <h1 className="max-w-full text-4xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  Turn raw requirements into{' '}
                  <span className="text-accent">developer-ready plans</span>
                </h1>
                <p className="mt-6 max-w-full text-lg leading-8 text-ink-muted sm:max-w-2xl">
                  Upload project requirements and generate structured proposals, diagrams, project context, and export-ready delivery plans in minutes.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={authed ? '/dashboard' : '/auth/register'}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)] sm:w-auto"
                  >
                    Start planning
                  </Link>
                  <Link
                    href={authed ? '/dashboard' : '/auth/login'}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface-raised px-6 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface sm:w-auto"
                  >
                    {authed ? 'Open dashboard' : 'Sign in'}
                  </Link>
                </div>
                <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
                  {[
                    ['5', 'outputs'],
                    ['PDF', 'Word export'],
                    ['RAG', 'doc chat'],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="text-lg font-semibold text-ink">{value}</p>
                      <p className="text-xs font-medium text-ink-faint">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <ProductPreview />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything a fast team needs after the first requirement dump
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-muted">
            Plan Generator turns scattered project inputs into outputs your team can actually build from.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => (
            <MotionCard
              key={feature.title}
              className="rounded-2xl border border-border bg-surface-raised p-5 shadow-sm shadow-black/[0.03] hover:border-accent/30 hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.12)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent ring-1 ring-accent/20">
                {index + 1}
              </div>
              <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{feature.description}</p>
            </MotionCard>
          ))}
        </Stagger>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Why it helps
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-muted">
              Less cleanup, fewer alignment meetings, and a faster path from idea to backlog.
            </p>
          </Reveal>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={{ hidden: { opacity: 0, x: 18 }, visible: { opacity: 1, x: 0 } }}
                className="rounded-2xl border border-border bg-surface-raised p-5 shadow-sm shadow-black/[0.03]"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success ring-1 ring-success/20">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.55 6.54-6.55a1 1 0 011.42 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm leading-6 text-ink-muted">{benefit}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From rough brief to shared plan
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-muted">
            A guided workflow for teams that need clarity before the sprint clock starts.
          </p>
        </Reveal>
        <div className="relative mt-12">
          <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-accent via-border to-success md:block" />
          <div className="grid gap-5">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <div className="relative grid gap-4 rounded-2xl border border-border bg-surface-raised p-5 shadow-sm shadow-black/[0.03] md:grid-cols-[3rem_1fr_auto] md:items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-lg shadow-ink/10">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">{step.description}</p>
                  </div>
                  <span className="hidden rounded-full bg-border/40 px-3 py-1 text-xs font-medium text-ink-muted md:inline-flex">
                    Step {index + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="teams" className="border-y border-border bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for fast teams
            </h2>
            <p className="mt-4 text-base leading-7 text-white/60">
              Useful when requirements are moving quickly and the team needs a presentable plan now.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <MotionCard
                key={useCase}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur"
              >
                <p className="text-base font-semibold">{useCase}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Turn ambiguous inputs into a shared execution story.
                </p>
              </MotionCard>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,var(--accent-soft)_0%,#FFFFFF_52%,var(--success-soft)_100%)] p-8 shadow-xl shadow-accent/[0.06] sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Build your first plan in minutes
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
                  Give the app a requirement brief. Get a proposal, diagrams, and export-ready documentation back.
                </p>
              </div>
              <Link
                href={authed ? '/dashboard' : '/auth/register'}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.4)]"
              >
                Start planning
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
};
