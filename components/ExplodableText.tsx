'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSceneController } from '@/lib/scene-controller';

type ExplodableTextProps = {
  text: string;
  className?: string;
};

const ExplodableText = ({ text, className = '' }: ExplodableTextProps) => {
  const { phase } = useSceneController();

  const letters = useMemo(() => text.split(''), [text]);
  const offsets = useMemo(
    () =>
      letters.map(() => ({
        x: (Math.random() * 2 - 1) * 240,
        y: (Math.random() * 2 - 1) * 180,
        r: (Math.random() * 2 - 1) * 30,
      })),
    [letters],
  );

  return (
    <span className={className} aria-label={text} style={{ display: 'inline-block' }}>
      {letters.map((ch, i) => {
        const o = offsets[i];
        const isSpace = ch === ' ';
        return (
          <motion.span
            key={`${ch}-${i}`}
            style={{ display: 'inline-block', whiteSpace: isSpace ? 'pre' : 'normal' }}
            animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
};

export default ExplodableText;
