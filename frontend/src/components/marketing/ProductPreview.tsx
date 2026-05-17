'use client';

import { useRef, type PointerEvent } from 'react';
import { useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { motion } from './Motion';

const documentTiles = [
  { label: 'PDF', positionClassName: 'top-7', badgeClassName: 'bg-red-500 text-white shadow-red-500/20', delay: 0 },
  { label: 'DOCX', positionClassName: 'top-[8.5rem]', badgeClassName: 'bg-blue-600 text-white shadow-blue-500/20', delay: 0.12 },
  { label: 'TXT', positionClassName: 'top-[16rem]', badgeClassName: 'bg-slate-800 text-white shadow-slate-500/20', delay: 0.24 },
];

const connectorLines = [
  { d: 'M24 30 C78 30 72 70 130 70', end: { x: 130, y: 70 }, delay: 0 },
  { d: 'M24 152 C74 152 76 158 130 158', end: { x: 130, y: 158 }, delay: 0.12 },
  { d: 'M24 274 C78 274 72 232 130 232', end: { x: 130, y: 232 }, delay: 0.24 },
];

const pipelineSteps = [
  ['Upload', 'Source ready'],
  ['Index', 'Context prepared'],
  ['Extract', 'Requirements mapped'],
  ['Diagram', 'Flows created'],
  ['Proposal', 'Plan ready'],
];

const metrics = [
  ['Documents', '24'],
  ['Extracted Fields', '156'],
  ['Ready Outputs', '5'],
  ['Last Updated', '2h ago'],
];

const navIcons = [
  'M3 11.5 12 4l9 7.5M5 10.5V20h14v-9.5',
  'M4 6.5A2.5 2.5 0 016.5 4H10l2 2h5.5A2.5 2.5 0 0120 8.5V18a2 2 0 01-2 2H6a2 2 0 01-2-2V6.5z',
  'M7 3h7l3 3v15H7a2 2 0 01-2-2V5a2 2 0 012-2zM14 3v4h4M8 13h8M8 17h5',
  'M5 5h14v10H8l-3 3V5z',
  'M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2m12 0h2M12 4v2m0 12v2',
];

const FloatingDocument = ({
  badgeClassName,
  delay,
  isActive,
  label,
  positionClassName,
  reduceMotion,
}: {
  badgeClassName: string;
  delay: number;
  isActive: boolean;
  label: string;
  positionClassName: string;
  reduceMotion: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -18, y: 8 }}
    animate={{ opacity: 1, x: 0, y: isActive && !reduceMotion ? [0, -8, 0] : 0 }}
    transition={{
      opacity: { delay, duration: 0.42, ease: 'easeOut' },
      x: { delay, duration: 0.52, ease: [0.22, 1, 0.36, 1] },
      y:
        isActive && !reduceMotion
          ? {
              delay: delay + 0.28,
              duration: 2.8,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
            }
          : { duration: 0.28, ease: 'easeOut' },
    }}
    className={`absolute -left-6 hidden h-20 w-16 rounded-2xl border border-white/70 bg-white/90 shadow-xl backdrop-blur-md lg:block ${positionClassName}`}
  >
    <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-xl rounded-tr-2xl bg-slate-100" />
    <div className="absolute left-3 top-3 h-1.5 w-7 rounded-full bg-slate-200" />
    <span className={`absolute -right-4 top-7 rounded-md px-2 py-1 text-xs font-bold tracking-wide shadow-lg ${badgeClassName}`}>
      {label}
    </span>
  </motion.div>
);

const ConnectorLines = ({
  isActive,
  reduceMotion,
}: {
  isActive: boolean;
  reduceMotion: boolean;
}) => (
  <svg className="pointer-events-none absolute -left-8 top-16 hidden h-72 w-36 lg:block" viewBox="0 0 160 320" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="connectorFlow" x1="24" y1="0" x2="130" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#93C5FD" stopOpacity="0.45" />
        <stop offset="0.55" stopColor="#2563EB" stopOpacity="0.95" />
        <stop offset="1" stopColor="#6D7CFF" stopOpacity="0.95" />
      </linearGradient>
    </defs>

    {connectorLines.map((line) => (
      <g key={line.d}>
        <path
          d={line.d}
          stroke="#BFDBFE"
          strokeWidth="3"
          strokeDasharray="4 11"
          strokeLinecap="round"
          opacity="0.38"
        />
        <motion.path
          d={line.d}
          stroke="url(#connectorFlow)"
          strokeWidth="3.5"
          strokeDasharray="10 10"
          strokeLinecap="round"
          initial={false}
          animate={
            isActive && !reduceMotion
              ? {
                  opacity: [0.45, 0.95, 0.45],
                  strokeDashoffset: [0, -40],
                  y: [0, -8, 0],
                }
              : {
                  opacity: 0.68,
                  strokeDashoffset: 0,
                  y: 0,
                }
          }
          transition={{
            delay: line.delay,
            duration: 4,
            ease: [0.22, 1, 0.36, 1],
            repeat: isActive && !reduceMotion ? Infinity : 0,
            repeatType: 'mirror',
          }}
        />
        <motion.circle
          cx={line.end.x}
          cy={line.end.y}
          r="3.5"
          fill="#2563EB"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={
            isActive && !reduceMotion
              ? {
                  opacity: [0.12, 0.72, 0.12],
                  scale: [0.85, 1.22, 0.85],
                  y: [0, -8, 0],
                }
              : {
                  opacity: 0.58,
                  scale: 1,
                  y: 0,
                }
          }
          transition={{
            delay: line.delay + 0.28,
            duration: 4,
            ease: [0.22, 1, 0.36, 1],
            repeat: isActive && !reduceMotion ? Infinity : 0,
            repeatType: 'mirror',
          }}
        />
      </g>
    ))}
  </svg>
);

export const ProductPreview = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotion);
  const isInView = useInView(rootRef, { amount: 0.2, margin: '160px 0px' });
  const shouldAnimateDecor = isInView && !shouldReduceMotion;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const scaleTarget = useMotionValue(1);
  const smoothX = useSpring(pointerX, { stiffness: 170, damping: 24, mass: 0.35 });
  const smoothY = useSpring(pointerY, { stiffness: 170, damping: 24, mass: 0.35 });
  const scale = useSpring(scaleTarget, { stiffness: 180, damping: 22, mass: 0.35 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, -1]);
  const sheenX = useTransform(smoothX, [-0.5, 0.5], [-90, 90]);
  const sheenY = useTransform(smoothY, [-0.5, 0.5], [-70, 70]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    scaleTarget.set(1.025);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    scaleTarget.set(1);
  };

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[360px] overflow-visible sm:max-w-5xl">
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_68%_30%,rgba(191,219,254,0.9),transparent_46%),radial-gradient(circle_at_32%_78%,rgba(59,130,246,0.24),transparent_36%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-12 top-0 hidden h-[28rem] w-[28rem] rounded-full bg-blue-100/80 lg:block" />

      <ConnectorLines isActive={shouldAnimateDecor} reduceMotion={shouldReduceMotion} />

      {documentTiles.map((doc) => (
        <FloatingDocument
          key={doc.label}
          {...doc}
          isActive={shouldAnimateDecor}
          reduceMotion={shouldReduceMotion}
        />
      ))}

      <motion.div
        ref={previewRef}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="group/preview relative lg:pl-16"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_0_0_1px_rgba(37,99,235,0.08)] backdrop-blur-xl will-change-transform"
          style={{ rotateX, rotateY, rotateZ: -1.5, scale, transformPerspective: 1200 }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-24 z-10 opacity-0 transition-opacity duration-300 group-hover/preview:opacity-100"
            style={{ x: sheenX, y: sheenY }}
          >
            <div className="h-48 w-48 rounded-full bg-white/35 blur-3xl" />
          </motion.div>
          <div className="flex items-center justify-between border-b border-blue-100 bg-white/85 px-4 py-3 sm:px-5">
            <BrandLogo size="sm" priority />
            <div className="flex items-center gap-3 text-blue-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 10v4m9-9h-4M7 12H3m15.36-6.36l-2.83 2.83M8.47 15.53l-2.83 2.83m12.72 0l-2.83-2.83M8.47 8.47L5.64 5.64" />
              </svg>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
              </svg>
            </div>
          </div>

          <div className="grid min-h-[31rem] grid-cols-[4.25rem_1fr] bg-white/80 sm:grid-cols-[5rem_1fr]">
            <aside className="flex flex-col items-center gap-4 bg-[#061E45] px-3 py-8 text-white shadow-[18px_0_40px_-35px_rgba(6,30,69,0.8)]">
              {navIcons.map((path, index) => (
                <div
                  key={path}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                    index === 0 ? 'bg-white/12 text-white ring-1 ring-white/18' : 'text-blue-100/70'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                  </svg>
                </div>
              ))}
            </aside>

            <div className="min-w-0 p-4 sm:p-6">
              <p className="text-base font-semibold text-ink">Project Overview</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {metrics.map(([label, value], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.06, duration: 0.45 }}
                    className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-900/[0.04]"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-bold tracking-tight text-ink">{value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.35fr]">
                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-900/[0.04]">
                  <p className="text-sm font-semibold text-ink">Processing Pipeline</p>
                  <div className="mt-5 space-y-4">
                    {pipelineSteps.map(([title, subtitle], index) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18 + index * 0.08, duration: 0.38 }}
                        className="relative flex gap-3"
                      >
                        {index < pipelineSteps.length - 1 && (
                          <span className="absolute left-4 top-8 h-8 w-px bg-emerald-200" />
                        )}
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.55 6.54-6.55a1 1 0 011.42 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-ink">{title}</span>
                          <span className="block text-xs text-slate-500">{subtitle}</span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-900/[0.04]">
                    <p className="text-sm font-semibold text-ink">Generated Outputs</p>
                    <div className="mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-4">
                      <p className="text-sm font-bold tracking-wide text-ink">PROJECT PROPOSAL</p>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-20 rounded-full bg-accent/45" />
                        <div className="h-2 rounded-full bg-blue-100" />
                        <div className="h-2 rounded-full bg-blue-100" />
                        <div className="h-2 w-4/5 rounded-full bg-blue-100" />
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <svg className="h-8 w-20 text-accent" fill="none" viewBox="0 0 96 32" stroke="currentColor" strokeWidth={2}>
                          <path d="M4 22c8-17 11-17 13 0 2 15 8-18 12-8 4 9 7 7 13 1 7-7 10 11 20 1 8-8 18-2 30-7" strokeLinecap="round" />
                        </svg>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
                          Extraction complete
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-900/[0.04]">
                    <p className="text-sm font-semibold text-ink">Timeline Overview</p>
                    <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-500">
                      {['Planning', 'Design', 'Development', 'Deploy'].map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <div className="relative mt-4 h-7">
                      <div className="absolute left-3 right-3 top-3 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-red-400" />
                      {[12, 38, 66, 90].map((left, index) => (
                        <span
                          key={left}
                          className={`absolute top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white shadow-lg ${
                            index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-indigo-500' : 'bg-red-500'
                          }`}
                          style={{ left: `${left}%` }}
                        >
                          <span className="h-2 w-2 rounded-full bg-white" />
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-slate-400">
                      {['2 weeks', '3 weeks', '5 weeks', '2 weeks'].map((item, index) => (
                        <span key={`${item}-${index}`}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
