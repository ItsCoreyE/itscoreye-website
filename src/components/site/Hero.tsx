import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative px-5 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
      {/* Soft brand-coloured orbs behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[-6rem] left-[-10rem] h-[clamp(18rem,45vw,34rem)] w-[clamp(18rem,45vw,34rem)]"
          style={{ background: 'radial-gradient(closest-side, rgb(147 51 234 / 0.16), transparent 70%)' }}
        />
        <div
          className="absolute top-[40%] right-[-8rem] h-[clamp(16rem,40vw,30rem)] w-[clamp(16rem,40vw,30rem)]"
          style={{ background: 'radial-gradient(closest-side, rgb(6 182 212 / 0.13), transparent 70%)' }}
        />
        <div
          className="absolute top-[-2rem] left-1/2 h-[clamp(14rem,30vw,22rem)] w-[clamp(14rem,30vw,22rem)] -translate-x-1/2"
          style={{ background: 'radial-gradient(closest-side, rgb(59 130 246 / 0.1), transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="animate-rise mx-auto mb-8 w-fit rounded-full bg-[image:var(--gradient-brand)] p-[3px] shadow-card">
          <Image
            src="/profile.png"
            alt="Corey Edwards"
            width={144}
            height={144}
            priority
            className="h-28 w-28 rounded-full border-4 border-canvas object-cover sm:h-36 sm:w-36"
          />
        </div>

        <h1
          className="animate-rise gradient-text text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '75ms' }}
        >
          Corey Edwards
        </h1>

        <div
          className="animate-rise mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
          style={{ animationDelay: '150ms' }}
        >
          <span className="inline-flex items-center rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
            ItsCoreyE
          </span>
          <span className="text-lg text-ink-muted">Entrepreneur &amp; Creator</span>
        </div>

        <p
          className="animate-rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl"
          style={{ animationDelay: '225ms' }}
        >
          Building transparent businesses and digital experiences people can trust.
        </p>

        <div
          className="animate-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '300ms' }}
        >
          <a href="#ventures" className="btn-primary w-full min-w-[170px] sm:w-auto">
            View my work
          </a>
          <a href="#contact" className="btn-secondary w-full min-w-[170px] sm:w-auto">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
