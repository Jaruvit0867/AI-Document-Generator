'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const routeKey = pathname ?? 'root';

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={routeKey}
          className="flex min-h-screen flex-col"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!reduceMotion && (
        <motion.div
          key={`route-progress-${routeKey}`}
          className="pointer-events-none fixed left-0 top-0 z-[100] h-0.5 w-full overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full bg-gradient-to-r from-blue-700 via-sky-500 to-blue-500"
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: ['-100%', '0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </>
  );
};
