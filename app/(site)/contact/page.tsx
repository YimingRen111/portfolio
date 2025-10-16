'use client';

import { FormEvent, useEffect, useState } from 'react';
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

        <ContactForm />
      </motion.section>
    </main>
  );
};

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setErrorMessage('Please complete all fields before sending your message.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/renyiming7@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      setFormState({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while sending your message. Please try again later.'
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl border border-white/12 bg-white/4 p-8 text-left text-white/75 backdrop-blur-xl"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Send a message</h3>
        <p className="text-sm text-white/60">
          Share a little about yourself and how I can help. You’ll receive a reply directly at the email you provide.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        Name
        <input
          type="text"
          name="name"
          value={formState.name}
          onChange={(event) => setFormState((previous) => ({ ...previous, name: event.target.value }))}
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="Your name"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        Email
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={(event) => setFormState((previous) => ({ ...previous, email: event.target.value }))}
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="you@example.com"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        Message
        <textarea
          name="message"
          value={formState.message}
          onChange={(event) => setFormState((previous) => ({ ...previous, message: event.target.value }))}
          className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="How can I help?"
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/50"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Thanks for reaching out! Your message has been delivered.
        </p>
      )}

      {status === 'error' && errorMessage && (
        <p className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </p>
      )}
    </motion.form>
  );
};

export default ContactPage;
