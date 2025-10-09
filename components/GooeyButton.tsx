'use client';

import { motion } from 'framer-motion';
import type { ComponentProps } from 'react';

type MotionButtonProps = ComponentProps<typeof motion.button>;

type GooeyButtonProps = Omit<MotionButtonProps, 'children'> & {
  children?: React.ReactNode;
};

/**
 * Liquid-styled button using SVG gooey filter and motion hover.
 */
const GooeyButton = ({ children, className = '', ...props }: GooeyButtonProps) => {
  return (
    <div className="relative inline-block">
      <svg className="absolute -z-10" width="0" height="0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 36 -16"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`relative rounded-2xl px-6 py-3 font-medium text-white ${className}`}
        style={{ filter: 'url(#goo)', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
        {...props}
      >
        <motion.span
          className="absolute inset-0 -z-10 rounded-2xl"
          animate={{ borderRadius: ['24px', '26px 22px 28px 20px', '22px 28px 24px 26px'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
          }}
        />
        {children ?? null}
      </motion.button>
    </div>
  );
};

export default GooeyButton;
