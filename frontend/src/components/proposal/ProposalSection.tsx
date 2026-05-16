import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProposalSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const ProposalSection: React.FC<ProposalSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm shadow-black/[0.03] ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between bg-surface-raised px-5 py-4 text-left transition-colors hover:bg-surface sm:px-6"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <svg
          className={`h-5 w-5 text-ink-faint transition-transform ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-surface-raised px-5 py-4 sm:px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
