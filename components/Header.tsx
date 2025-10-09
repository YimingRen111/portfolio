'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSceneController } from '@/lib/scene-controller';
import { MouseEvent, useCallback } from 'react';

const navLinks = [
  { href: '/', label: 'Home', scene: 'home' as const },
  { href: '/projects', label: 'Projects', scene: 'projects' as const },
  { href: '/about', label: 'About', scene: 'about' as const },
  { href: '/contact', label: 'Contact', scene: 'contact' as const },
];

export default function Header() {
  const pathname = usePathname();
  const { transitionTo } = useSceneController();

  const handleNav = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string, scene: typeof navLinks[number]['scene']) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      if (pathname === href) {
        transitionTo(scene);
        return;
      }
      transitionTo(scene, { route: href });
    },
    [pathname, transitionTo],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/70 backdrop-blur dark:bg-gray-900/60">
      <div className="container-app flex h-16 items-center justify-center">
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={(event) => handleNav(event, link.href, link.scene)}
                className={`text-sm uppercase tracking-[0.32em] transition ${
                  isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
