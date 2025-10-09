'use client';

import { useSceneController } from '@/lib/scene-controller';
import { motion } from 'framer-motion';

export default function ContentAnimator({ children }: { children: React.ReactNode }) {
  const { phase } = useSceneController();
  return (
    <motion.div
      className="relative z-10 flex flex-col flex-1"
      // Keep content visually stable during route transitions; only disable pointer events
      animate={{ scale: 1, x: 0, y: 0, opacity: 1, filter: 'none' }}
      transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
      style={{ pointerEvents: phase === 'idle' ? 'auto' : 'none', transformOrigin: '50% 50%' }}
    >
      {children}
    </motion.div>
  );
}
