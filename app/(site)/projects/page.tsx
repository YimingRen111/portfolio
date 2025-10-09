'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSceneController } from '@/lib/scene-controller';

type Project = {
  title: string;
  description: string;
  role: string;
  year: number;
  period?: string;
  stack?: string;
  link?: string;
};

const projects: Project[] = [
  {
    title: 'Bookmania',
    description:
      'Built a bookstore e‑commerce stack covering auth, search, cart, and checkout for a team of four.',
    role: 'Full‑stack Developer',
    year: 2022,
    period: 'Mar – Jun 2022',
    stack: 'Django REST, React/Redux, Bootstrap',
  },
  {
    title: '“King of Bots” Game Platform',
    description:
      'Real‑time matchmaking and bot‑execution microservices with WebSocket push to the front end.',
    role: 'Back‑end Lead',
    year: 2023,
    period: 'Aug – Nov 2023',
    stack: 'Spring Boot, Vue.js, MySQL, WebSocket',
  },
  {
    title: 'ECG ↔ PPG Reconstruction',
    description:
      'Trained CNN‑LSTM + attention models to reconstruct 12‑lead ECG signals from single‑channel PPG.',
    role: 'Lead ML Engineer (Capstone)',
    year: 2023,
    period: 'Aug – Nov 2023',
    stack: 'TensorFlow/Keras, Python',
  },
  {
    title: 'Character Management Web App',
    description:
      'MERN dashboard with REST endpoints, JWT auth, and a character comparison view.',
    role: 'Full‑stack Developer',
    year: 2023,
    period: 'Aug – Nov 2023',
    stack: 'Next.js, Node/Express, MongoDB, JWT',
  },
  {
    title: 'X‑ray Bone‑Shadow Suppression',
    description:
      'Developed three diffusion pipelines (DDPM/DDIM/Elucidated) to remove rib and clavicle shadows in chest X‑rays.',
    role: 'Thesis Project',
    year: 2024,
    stack: 'PyTorch, Diffusion',
  },
  {
    title: 'Campus Tutor Web App',
    description:
      'AI‑assisted teaching platform for students and teachers to share materials, prepare lessons, and chat via GPT‑powered Q&A.',
    role: 'Full‑stack Developer (team of 6)',
    year: 2024,
    period: 'Aug – Nov 2024',
    stack: 'FastAPI, React, Docker, PostgreSQL, OpenAI API',
  },
  {
    title: 'Low‑Light Enhancement for Surgical Videos',
    description:
      'A video enhancement pipeline using diffusion models for low‑light surgical footage; explored temporal consistency via 3D CNN and attention.',
    role: 'Thesis Project',
    year: 2025,
    stack: 'PyTorch, BasicSR, DDPM, 3D CNN',
  },
];

const ProjectsPage = () => {
  const { updateMetrics } = useSceneController();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateMetrics({
        projectCount: projects.length,
        collaborationFactor: 0.86,
        outreachLevel: 0.58,
      });
    }, 760);

    return () => window.clearTimeout(timeout);
  }, [updateMetrics]);

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-10">
      <motion.header
        className="mx-auto flex max-w-6xl flex-col items-start gap-6 text-white"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <span className="rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.4em] text-white/60 backdrop-blur">
          Projects
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold md:text-6xl">
          A universe of work—fragments assemble into a navigable matrix.
        </h1>
        <p className="max-w-2xl text-sm text-white/70 md:text-base">
          Across industries—from investor storytelling to music worlds—these projects are organized as an explorable space. Each node is the outcome of deep collaboration.
        </p>
      </motion.header>

      <motion.section
        className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-6 text-white/75 backdrop-blur-xl transition duration-500 hover:border-white/30 hover:bg-white/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 + index * 0.12, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
         >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
              <span>{project.year}</span>
              <span className="h-px flex-1 bg-white/15" />
              <span>{project.role}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">{project.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{project.description}</p>
            {project.stack ? (
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">{project.stack}</p>
            ) : null}
            {project.period ? (
              <p className="mt-1 text-xs text-white/50">{project.period}</p>
            ) : null}
            {project.link ? (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
                whileHover={{ x: 4 }}
              >
                View Case Study
                <span aria-hidden>↗</span>
              </motion.a>
            ) : null}
            <motion.div
              className="pointer-events-none absolute -inset-0.5 rounded-3xl opacity-0 blur-xl transition duration-500 group-hover:opacity-40"
              style={{
                background:
                  'linear-gradient(135deg, rgba(95,255,213,0.55), rgba(58,112,255,0.35))',
              }}
            />
          </motion.article>
        ))}
      </motion.section>
    </main>
  );
};

export default ProjectsPage;
