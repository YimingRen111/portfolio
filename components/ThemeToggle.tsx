// 'use client';
// import { useEffect, useState } from 'react';

// export default function ThemeToggle() {
//   const [dark, setDark] = useState(false);

//   useEffect(() => {
//     const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     document.documentElement.classList.toggle('dark', isDark);
//     setDark(isDark);
//   }, []);

//   const toggle = () => {
//     setDark((d) => {
//       document.documentElement.classList.toggle('dark', !d);
//       return !d;
//     });
//   };

//   return (
//     <button onClick={toggle} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition">
//       {dark ? 'Dark' : 'Light'}
//     </button>
//   );
// }
