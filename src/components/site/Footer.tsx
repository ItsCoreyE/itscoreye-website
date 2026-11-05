import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { navLinks, socialLinks, BrandIcon } from './links';
import { ventures } from './ventureData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface pb-[env(safe-area-inset-bottom)]">
      <div aria-hidden className="gradient-hairline opacity-60" />
      <div className="px-5 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-8">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-10">
            <div className="col-span-2 md:col-span-5">
              <a href="#" className="inline-flex min-h-11 items-center gap-2.5 text-lg font-semibold tracking-tight text-ink">
                <Image src="/icons/android-chrome-512x512.png" alt="" width={64} height={64} className="h-8 w-8" />
                Corey Edwards
              </a>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                Roblox UGC creator known as <span className="font-medium text-accent">ItsCoreyE</span>, and
                founder of {ventures.map((v) => v.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
              </p>
              <div className="mt-6 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-muted transition-colors hover:border-accent-border hover:text-accent"
                  >
                    <BrandIcon path={social.iconPath} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
              <h4 className="text-xs font-semibold tracking-[0.12em] text-ink uppercase">Explore</h4>
              <ul className="mt-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-ink md:min-h-9"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:col-span-3">
              <h4 className="text-xs font-semibold tracking-[0.12em] text-ink uppercase">Ventures</h4>
              <ul className="mt-3">
                {ventures.map((venture) => (
                  <li key={venture.id}>
                    <a
                      href={venture.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-ink md:min-h-9"
                    >
                      {venture.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
            <p className="text-center text-sm text-ink-muted sm:text-left">&copy; {currentYear} Corey Edwards. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink-muted shadow-sm transition-colors hover:border-accent-border hover:text-accent"
              >
                <LockClosedIcon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
                Admin
              </Link>
              <a
                href="#"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Back to Top
                <ArrowUpIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
