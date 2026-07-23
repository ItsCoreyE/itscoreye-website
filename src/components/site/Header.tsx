'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Ventures', href: '#ventures' },
  { name: 'UGC', href: '#ugc-business' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = isScrolled || isMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        solid ? 'bg-surface/90 border-line backdrop-blur' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="px-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
            <Image
              src="/icons/android-chrome-512x512.png"
              alt=""
              width={64}
              height={64}
              className="h-8 w-8"
            />
            Corey Edwards
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary px-5 py-2 text-sm">
              Get in touch
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="-mr-2 rounded-lg p-2 text-ink md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-line px-5 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="btn-primary mt-2 py-2.5 text-sm"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
