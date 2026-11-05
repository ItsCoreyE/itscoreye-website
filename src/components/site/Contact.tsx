import { ArrowUpRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Reveal from './Reveal';
import { CONTACT_EMAIL, DISCORD_URL, iconPaths, BrandIcon } from './links';

export default function Contact() {
  return (
    <section id="contact" className="section scroll-mt-24">
      <div className="container-page">
        <Reveal>
          <div className="card-gradient-border relative overflow-hidden rounded-[var(--radius-panel)] shadow-card">
            {/* Soft brand light inside the panel */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="bg-grid absolute inset-0 opacity-70" />
              <div
                className="absolute -top-24 -left-24 h-80 w-80"
                style={{ background: 'radial-gradient(closest-side, rgb(147 51 234 / 0.14), transparent 70%)' }}
              />
              <div
                className="absolute -right-24 -bottom-24 h-80 w-80"
                style={{ background: 'radial-gradient(closest-side, rgb(6 182 212 / 0.14), transparent 70%)' }}
              />
            </div>

            <div className="relative px-5 py-12 text-center sm:px-12 sm:py-20">
              <span className="section-label mb-4">Contact</span>
              <h2 className="heading-section mx-auto max-w-2xl">
                Have an idea, a collab or a question? <span className="gradient-text">Let&apos;s talk.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
                Whether it&apos;s a UGC collaboration, one of my ventures or something new, I&apos;d love
                to hear from you.
              </p>

              <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary group">
                  <EnvelopeIcon className="h-5 w-5" />
                  Email Me
                </a>
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary group">
                  <BrandIcon path={iconPaths.discord} className="h-5 w-5 text-[#5865F2]" />
                  Join the Discord
                  <ArrowUpRightIcon className="h-4 w-4 text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <p className="mt-8 text-sm text-ink-muted">
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 items-center font-medium break-all text-ink-secondary underline-offset-4 hover:text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
                <span className="mx-2 hidden sm:inline" aria-hidden>
                  &middot;
                </span>
                <span className="mt-1 block sm:mt-0 sm:inline">Usually replies within 24 hours</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
