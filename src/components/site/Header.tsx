'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { navLinks, socialLinks, BrandIcon } from './links';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav link for whichever section sits in the middle of the viewport
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
          else if (entry.boundingClientRect.top > 0) {
            setActiveId((current) => (current === entry.target.id ? null : current));
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const floating = isScrolled || isMenuOpen;

  return (
    <>
      {/* Tap-away backdrop for the mobile menu */}
      <div
        aria-hidden
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/10 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <div className="container-page relative">
          <nav
            aria-label="Main"
            className={`-mx-3 flex h-14 items-center justify-between rounded-full border px-3 transition-[background-color,border-color,box-shadow] duration-500 sm:-mx-4 sm:px-4 ${
              floating
                ? 'glass shadow-float'
                : 'border-transparent bg-transparent'
            }`}
          >
            <a
              href="#"
              className="flex h-11 items-center gap-2.5 text-base font-semibold tracking-tight text-ink"
              aria-label="Corey Edwards, back to top"
            >
              <Image src="/icons/android-chrome-512x512.png" alt="" width={64} height={64} className="h-7 w-7" />
              Corey Edwards
            </a>

            {/* Desktop */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = activeId === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-current={active ? 'true' : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-surface-muted text-ink' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a href="#contact" className="btn-primary ml-3 min-h-10 px-5 py-2 text-sm">
                Get in Touch
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted md:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile menu */}
          <div
            id="mobile-menu"
            className={`shadow-float absolute inset-x-0 top-full mt-3 -mx-3 origin-top rounded-3xl border border-line/80 bg-surface/95 p-3 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:-mx-4 md:hidden ${
              isMenuOpen ? 'scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
            }`}
            inert={!isMenuOpen}
          >
            <ul className="flex flex-col">
              {navLinks.map((link, index) => (
                <li
                  key={link.name}
                  className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                  style={{ transitionDelay: isMenuOpen ? `${60 + index * 40}ms` : '0ms' }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-medium transition-colors hover:bg-surface-muted ${
                      activeId === link.id ? 'bg-surface-muted text-ink' : 'text-ink-secondary'
                    }`}
                  >
                    {link.name}
                    <span aria-hidden className="text-ink-muted">
                      &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {/* Near-opaque panel and a darker rule so the divider stays visible over the hero photo */}
            {/* Below 360px the button takes its own row so its label never wraps */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 border-t border-ink/15 px-1 pt-3">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary w-full px-5 text-sm whitespace-nowrap min-[360px]:w-auto min-[360px]:flex-1"
              >
                Get in Touch
              </a>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-muted transition-colors hover:text-accent"
                >
                  <BrandIcon path={social.iconPath} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
