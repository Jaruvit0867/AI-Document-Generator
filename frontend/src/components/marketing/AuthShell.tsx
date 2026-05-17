'use client';

import Link from 'next/link';
import React from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { motion } from './Motion';
import { InteractiveGrid } from './InteractiveGrid';

export const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-surface text-ink">
      {/* Interactive dot grid background */}
      <InteractiveGrid />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
        <div className="hidden flex-col justify-between rounded-3xl border border-border bg-white/70 p-8 shadow-2xl shadow-ink/[0.04] backdrop-blur-xl lg:flex">
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" priority />
          </Link>

          <div className="py-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-ink">
                Transform requirements into actionable development plans.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-ink-muted">
                Sign in to turn source documents into proposals, diagrams, tasks, and export-ready delivery plans.
              </p>
            </motion.div>

            <div className="mt-10 space-y-3">
              {['Upload source docs', 'Generate diagrams', 'Export PDF or Word'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.16 + index * 0.08, duration: 0.42 }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface-raised p-4 shadow-sm shadow-black/[0.03]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-soft text-success ring-1 ring-success/20">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.55 6.54-6.55a1 1 0 011.42 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-ink-muted">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink-faint">Built for IBM Hackathon 2026</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center">
                <BrandLogo size="md" priority />
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-border bg-surface-raised p-6 shadow-2xl shadow-ink/[0.06] sm:p-8"
            >
              {children}
            </motion.div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-raised/80 px-5 py-2 text-xs font-semibold tracking-wide text-ink-muted ring-1 ring-border backdrop-blur-sm" style={{ textShadow: '0 0 12px rgba(37, 99, 235, 0.06)' }}>
              <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m5-9v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h6a2 2 0 012 2z" />
              </svg>
              Vision Draft workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
