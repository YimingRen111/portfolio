'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function MotionFadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
  }, [inView, controls]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} animate={controls}>
      {children}
    </motion.div>
  );
}
