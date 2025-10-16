'use client';

import { useSceneController } from '@/lib/scene-controller';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Route } from 'next';
import { type MouseEvent, useCallback, useEffect } from 'react';

const subtleTextVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] },
  }),
};

const CONTACT_ROUTE = '/contact' as Route;

const HomePage = () => {
  const { transitionTo, updateMetrics } = useSceneController();

  const handleHireMe = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

      event.preventDefault();
      transitionTo('contact', { route: CONTACT_ROUTE });
    },
    [transitionTo],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateMetrics({
        projectCount: 6,
        collaborationFactor: 0.6,
        outreachLevel: 0.55,
      });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [updateMetrics]);

  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-28 md:pt-32 lg:px-12 min-h-[80vh]">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-28 md:top-32 flex justify-center gap-4 text-[11px] uppercase tracking-[0.4em] text-slate-200/70 dark:text-slate-100/60"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <span className="rounded-full border border-white/10 px-4 py-1 backdrop-blur-sm">
          Yiming Ren
        </span>
      </motion.div>

      <motion.div
        className="relative z-10 mt-24 md:mt-32 flex w-full max-w-5xl flex-col items-center gap-12 md:gap-14 text-center"
        initial={false}
        animate="visible"
        variants={subtleTextVariants}
      >
        <motion.h1
          className="text-balance text-4xl font-semibold leading-tight text-slate-100 drop-shadow-[0_0_25px_rgba(93,147,255,0.45)] md:text-6xl lg:text-7xl"
          custom={0.35}
          variants={subtleTextVariants}
          initial={false}
          >
          Crafting interactive products at the intersection of Frontend and ML.
        </motion.h1>

        <motion.p
          className="max-w-2xl text-balance text-base text-slate-200/75 md:text-lg"
          custom={0.55}
          variants={subtleTextVariants}
          initial={false}
        >
          Software engineer (USYD MSE ’25) shipping end‑to‑end systems. I focus on modern front‑end experience design and applied machine learning. I prototype quickly, collaborate closely, and ship production‑ready systems—adapting to the problem rather than a fixed stack.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          custom={0.75}
          variants={subtleTextVariants}
          initial={false}
        >
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Download Resume
          </a>
          <Link
            href={CONTACT_ROUTE}
            prefetch={false}
            onClick={handleHireMe}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-gray-900 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Hire me
          </Link>
        </motion.div>
      </motion.div>

      
    </main>
  );
};

export default HomePage;
