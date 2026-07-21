import Reveal from './Reveal';
import { EnvelopeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <span className="section-label mb-3">Contact</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            Interested in my ventures, UGC collaborations, or just want to connect?
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          <Reveal delay={75}>
            <div className="card flex h-full flex-col p-6 text-center sm:p-7">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
                <EnvelopeIcon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">Email</h3>
              <p className="mt-1 flex-grow text-sm text-ink-muted">Professional inquiries</p>
              <a href="mailto:itscoreyedwards@gmail.com" className="btn-primary mt-5 w-full text-sm">
                <span className="truncate">itscoreyedwards@gmail.com</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="card flex h-full flex-col p-6 text-center sm:p-7">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-soft">
                <UserGroupIcon className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">Discord Server</h3>
              <p className="mt-1 flex-grow text-sm text-ink-muted">Join the community</p>
              <a
                href="https://discord.gg/itscoreye"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-5 w-full text-sm"
              >
                Join server
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-sm text-ink-muted">
            Response time: usually within 24 hours
          </p>
        </Reveal>
      </div>
    </section>
  );
}
