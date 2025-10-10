// 'use client';
// import { motion } from 'framer-motion';

// export default function ProjectCard({ title, desc, tags, href }: { title: string; desc: string; tags: string[]; href: string; }) {
//   return (
//     <motion.a
//       href={href}
//       target="_blank"
//       rel="noreferrer"
//       className="block p-6 rounded-2xl border bg-white/60 dark:bg-white/5 backdrop-blur"
//       whileHover={{ y: -4 }}
//       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//     >
//       <h3 className="text-xl font-semibold">{title}</h3>
//       <p className="mt-2 text-gray-600 dark:text-gray-300">{desc}</p>
//       <div className="mt-4 flex flex-wrap gap-2">
//         {tags.map((t) => (
//           <span key={t} className="text-xs px-2 py-1 rounded-full border bg-white/60 dark:bg-white/10">{t}</span>
//         ))}
//       </div>
//     </motion.a>
//   );
// }
