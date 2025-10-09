'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSceneController } from '@/lib/scene-controller';

const timeline = [
  {
    year: '2024',
    title: 'Immersive Frontend Architect',
    description:
      'Leading the build of experiential design systems that combine WebGL, advanced motion, and data storytelling for venture-backed startups.',
  },
  {
    year: '2022',
    title: 'Interactive Systems Engineer',
    description:
      'Designed component libraries and micro-interactions for multi-platform products, working closely with brand and product teams.',
  },
  {
    year: '2019',
    title: 'Product Engineer & Researcher',
    description:
      'Explored ML-assisted prototyping, bridging user research findings into rapid experiments and analytics dashboards.',
  },
];

const pillars = [
  {
    label: 'Immersion',
    copy: 'Crafting interfaces that feel alive through light, motion, and responsive space.',
  },
  {
    label: 'Clarity',
    copy: 'Turning complex ideas into intuitive spatial narratives with purposeful pacing.',
  },
  {
    label: 'Partnership',
    copy: 'Embedding with founders and teams to iterate fast, ship confidently, and evolve together.',
  },
];

const AboutPage = () => {
  const { updateMetrics } = useSceneController();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      updateMetrics({
        projectCount: 8,
        collaborationFactor: 0.74,
        outreachLevel: 0.62,
      });
    }, 720);

    return () => window.clearTimeout(timeout);
  }, [updateMetrics]);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 36 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
      },
    }),
    [],
  );

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-32 md:px-12">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <section className="relative flex flex-col items-center gap-6 text-center">
          <motion.span
            className="rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white/60 backdrop-blur"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            About
          </motion.span>

          <motion.h1
            className="text-balance text-4xl font-semibold text-white drop-shadow-[0_0_40px_rgba(255,111,191,0.45)] md:text-6xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Deconstructing ideas to craft truly immersive experiences.
          </motion.h1>

          <motion.p
            className="max-w-2xl text-balance text-base text-white/70 md:text-lg"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            I break ideas into fragments—observe, analyze, then reweave them with space, light, and rhythm. My work blends engineering and narrative so interfaces feel like places you can roam.
          </motion.p>
        </section>

        <motion.section
          className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:grid-cols-3"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          {pillars.map((pillar) => (
            <div key={pillar.label} className="flex flex-col gap-3">
              <h2 className="text-sm uppercase tracking-[0.3em] text-white/75">{pillar.label}</h2>
              <p className="text-sm text-white/70">{pillar.copy}</p>
            </div>
          ))}
        </motion.section>

        <motion.section
          className="grid gap-6 md:grid-cols-[1fr_1.3fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1, ease: [0.2, 0.9, 0.2, 1] }}
        >
          <div className="rounded-3xl border border-white/12 bg-gradient-to-b from-white/10 to-white/5 p-6 text-white/75 backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">现在</h3>
            <p className="mt-4 text-balance text-lg font-medium text-white">
              站在创意和工程的交汇点，把复杂的系统与细腻的情感融合成一体。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              与创始人、设计师并肩作战——快速迭代、量化结果、寻找最具沉浸感的表达。
            </p>
          </div>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <motion.article
                key={item.year}
                className="rounded-3xl border border-white/12 bg-white/4 p-6 text-white/70 backdrop-blur-xl"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                  <span>{item.year}</span>
                  <span className="h-px flex-1 bg-white/15" />
                  <span>
                    {timeline.length - index}&frasl;{timeline.length}
                  </span>
                </div>
                <h4 className="mt-4 text-lg font-medium text-white">{item.title}</h4>
                <p className="mt-3 text-sm leading-relaxed">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="rounded-3xl border border-white/12 bg-white/4 p-6 text-white/75 backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Education</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-white font-medium">The University of Sydney</div>
                <div className="text-sm text-white/70">Master of Software Engineering — Expected Dec 2025</div>
              </div>
              <div>
                <div className="text-white font-medium">The University of Sydney</div>
                <div className="text-sm text-white/70">Bachelor of Software Engineering (Honours, Class 2 Division 2), 2020–2024</div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="rounded-3xl border border-white/12 bg-white/4 p-6 text-white/75 backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Work Experience</h3>
            <div className="mt-4">
              <div className="text-white font-medium">Software Engineer Intern — Yanfeng Automotive Interiors</div>
              <div className="text-sm text-white/70">Shanghai, China • 2023–2024</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
                <li>Developed embedded Python modules and test scripts for in-vehicle infotainment/HMI systems.</li>
                <li>Collaborated with cross-functional hardware and UX teams to validate features and reliability.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="rounded-3xl border border-white/12 bg-white/4 p-6 text-white/75 backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Programming & ML</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Python (TensorFlow/PyTorch, FastAPI, Django); JavaScript/TypeScript (React, Next.js, Node.js, Vue); Java (Spring Boot); SQL (PostgreSQL, MySQL).</li>
              <li>ML/AI: hands-on with CNN/LSTM, attention and diffusion models, data preprocessing, feature engineering, GPU-based training.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/12 bg-white/4 p-6 text-white/75 backdrop-blur-xl">
            <h3 className="text-sm uppercase tracking-[0.3em] text-white/60">Engineering & Collaboration</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Testing & QA: unit/integration/E2E with pytest, JUnit, React Testing Library; static analysis, coverage and CI (GitHub Actions, Bitbucket CI).</li>
              <li>Software Engineering & PM: Agile/Scrum/XP, user stories, acceptance criteria, architecture diagrams, feasibility & risk assessments (Jira/Trello).</li>
              <li>Soft skills: clear technical communication, analytical problem‑solving, collaborative teamwork, mentoring juniors, stakeholder presentations.</li>
            </ul>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
};

export default AboutPage;
