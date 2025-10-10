'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSceneController } from '@/lib/scene-controller';

const contactChannels = [
  {
    label: 'Email',
    value: 'renyiming7@gmail.com',
    href: 'mailto:renyiming7@gmail.com',
    description: 'Project collaborations, experience consulting, workshops & talks.',
  },
  {
    label: 'Phone',
    value: '(+61) 422009106',
    href: 'tel:+61422009106',
    description: 'Available 9am–6pm AEST for introductions and scheduling.',
  },
];

const ContactPage = () => {
  const { updateMetrics } = useSceneController();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateMetrics({
        projectCount: 6,
        collaborationFactor: 0.6,
        outreachLevel: 0.96,
      });
    }, 720);
    return () => window.clearTimeout(timeout);
  }, [updateMetrics]);

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-12">
      <motion.section
        className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center text-white"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.92, duration: 1.1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <span className="rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.4em] text-white/60 backdrop-blur">
          Contact
        </span>
        <h1 className="text-balance text-4xl font-semibold md:text-6xl">
          Step through the light—let’s talk.
        </h1>
        <p className="max-w-2xl text-balance text-sm text-white/70 md:text-base">
          Whether you’re crafting immersive products, redefining brand experiences, or validating experimental interactions, I’m here to help.
        </p>
      </motion.section>

      <motion.section
        className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-[1.1fr_0.9fr]"
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <div className="flex flex-col gap-6 rounded-3xl border border-white/12 bg-gradient-to-br from-white/10 to-white/5 p-8 text-left text-white/75 backdrop-blur-xl">
          <h2 className="text-sm uppercase tracking-[0.3em] text-white/60">Start a conversation</h2>
          {contactChannels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
              rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/4 px-5 py-4 transition hover:border-white/30 hover:bg-white/8"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">{channel.label}</span>
              <span className="text-lg font-medium text-white">{channel.value}</span>
              <span className="text-xs text-white/60">{channel.description}</span>
            </a>
          ))}
        </div>

        <motion.div
          className="rounded-3xl border border-white/12 bg-white/4 p-8 text-left text-white/75 backdrop-blur-xl"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Project fit</h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
            <li>⌁ Need an immersive WebGL/Three.js experience—pitch decks, product demos, realtime dashboards.</li>
            <li>⌁ Want senior-level frontend ownership from prototype to launch across Next.js/FastAPI stacks.</li>
            <li>⌁ Have ML research (TensorFlow/PyTorch) that needs a polished, user-ready interface.</li>
            <li>⌁ Looking for a long-term partner to ship data-driven, interactive products with measurable impact.</li>
          </ul>
        </motion.div>
      </motion.section>
    </main>
  );
};

export default ContactPage;
