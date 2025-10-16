'use client';

import { ChangeEvent, FormEvent, RefObject, useEffect, useId, useRef, useState } from 'react';
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
  type FieldName = keyof typeof formState;

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<FieldName, string>>({
    name: '',
    email: '',
    message: '',
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const successMessageRef = useRef<HTMLParagraphElement>(null);
  const errorMessageRef = useRef<HTMLParagraphElement>(null);

  const responseExpectationId = useId();
  const privacyAssuranceId = useId();
  const nameHintId = useId();
  const emailHintId = useId();
  const successMessageId = useId();
  const errorMessageId = useId();

  const nameErrorId = useId();
  const emailErrorId = useId();
  const messageErrorId = useId();

  const fieldErrorIdMap: Record<FieldName, string> = {
    name: nameErrorId,
    email: emailErrorId,
    message: messageErrorId,
  };

  const fieldHintIdMap: Partial<Record<FieldName, string>> = {
    name: nameHintId,
    email: emailHintId,
  };

  const fieldRefMap: Record<FieldName, RefObject<HTMLInputElement | HTMLTextAreaElement>> = {
    name: nameInputRef,
    email: emailInputRef,
    message: messageInputRef,
  };

  const resetStatusMessages = () => {
    if (status === 'error' || status === 'success') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const validateField = (field: FieldName, value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      switch (field) {
        case 'name':
          return 'Please enter your name.';
        case 'email':
          return 'Please add the best email to reach you.';
        case 'message':
          return 'Let me know how I can help before sending.';
        default:
          return 'This field is required.';
      }
    }

    if (field === 'email') {
      const emailPattern = /.+@.+\..+/;
      if (!emailPattern.test(trimmed)) {
        return 'Use a valid email address so I can get back to you.';
      }
    }

    if (field === 'message' && trimmed.length < 20) {
      return 'Share a few more details so I can prepare a thoughtful response.';
    }

    return '';
  };

  const updateFieldError = (field: FieldName, value: string) => {
    setFieldErrors((previous) => {
      const next = { ...previous };
      next[field] = validateField(field, value);
      return next;
    });
  };

  const handleFieldChange = (
    field: FieldName,
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFormState((previous) => ({ ...previous, [field]: value }));

      updateFieldError(field, value);
      resetStatusMessages();
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFieldErrors = (Object.entries(formState) as Array<[FieldName, string]>).reduce<Record<FieldName, string>>(
      (accumulator, [field, value]) => {
        accumulator[field] = validateField(field, value);
        return accumulator;
      },
      { name: '', email: '', message: '' },
    );

    setFieldErrors(nextFieldErrors);

    const invalidField = (Object.entries(nextFieldErrors) as Array<[FieldName, string]>).find(
      ([, message]) => Boolean(message),
    )?.[0];

    if (invalidField) {
      setErrorMessage('Please review the highlighted fields and try again.');
      setStatus('error');
      fieldRefMap[invalidField].current?.focus();
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
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      setFormState({ name: '', email: '', message: '' });
      setFieldErrors({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      setFieldErrors({ name: '', email: '', message: '' });
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while sending your message. Please try again later.'
      );
    }
  };

  useEffect(() => {
    if (status === 'success' && successMessageRef.current) {
      successMessageRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'error' && errorMessage && Object.values(fieldErrors).every((value) => !value) && errorMessageRef.current) {
      errorMessageRef.current.focus();
    }
  }, [status, errorMessage, fieldErrors]);

  const describedByFor = (field: FieldName) => {
    const describedBy = [
      fieldHintIdMap[field],
      fieldErrors[field] ? fieldErrorIdMap[field] : null,
    ].filter(Boolean);

    return describedBy.length > 0 ? describedBy.join(' ') : undefined;
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded-3xl border border-white/12 bg-white/4 p-8 text-left text-white/75 backdrop-blur-xl"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      noValidate
      aria-busy={status === 'submitting'}
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
          ref={nameInputRef}
          value={formState.name}
          onChange={handleFieldChange('name')}
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="Your name"
          required
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={describedByFor('name')}
        />
        <p id={nameHintId} className="text-xs text-white/50">
          Introduce yourself with the name you prefer to be addressed by.
        </p>
        {fieldErrors.name && (
          <p
            id={nameErrorId}
            className="text-xs text-rose-200"
            aria-live="assertive"
            role="alert"
          >
            {fieldErrors.name}
          </p>
        )}
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        Email
        <input
          type="email"
          name="email"
          ref={emailInputRef}
          value={formState.email}
          onChange={handleFieldChange('email')}
          className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="you@example.com"
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={describedByFor('email')}
        />
        <p id={emailHintId} className="text-xs text-white/50">
          I’ll reply directly to this inbox when I’ve reviewed your message.
        </p>
        {fieldErrors.email && (
          <p
            id={emailErrorId}
            className="text-xs text-rose-200"
            aria-live="assertive"
            role="alert"
          >
            {fieldErrors.email}
          </p>
        )}
      </label>

      <label className="flex flex-col gap-2 text-sm text-white/70">
        Message
        <textarea
          name="message"
          ref={messageInputRef}
          value={formState.message}
          onChange={handleFieldChange('message')}
          className="min-h-[140px] rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-black/30"
          placeholder="How can I help?"
          required
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={describedByFor('message')}
        />
        {fieldErrors.message && (
          <p
            id={messageErrorId}
            className="text-xs text-rose-200"
            aria-live="assertive"
            role="alert"
          >
            {fieldErrors.message}
          </p>
        )}
      </label>

      <div
        className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-xs text-white/65"
        role="note"
      >
        <p className="text-sm font-medium text-white/80">What to expect next</p>
        <ul className="mt-2 space-y-1">
          <li id={responseExpectationId}>I respond to most inquiries within two business days.</li>
          <li id={privacyAssuranceId}>Your details stay private and are only used to follow up on this request.</li>
        </ul>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/50"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'success' && (
        <p
          id={successMessageId}
          ref={successMessageRef}
          role="status"
          aria-live="polite"
          tabIndex={-1}
          className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 focus:outline-none"
        >
          Thanks for reaching out! Your message has been delivered.
        </p>
      )}

      {status === 'error' && errorMessage && (
        <p
          id={errorMessageId}
          ref={errorMessageRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200 focus:outline-none"
        >
          {errorMessage}
        </p>
      )}
    </motion.form>
  );
};

export default ContactPage;
