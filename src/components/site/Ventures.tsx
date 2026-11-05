import Image from 'next/image';
import { ArrowRightIcon, ArrowUpRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Reveal from './Reveal';
import SpotlightGroup from './SpotlightGroup';
import StatusBadge, { type StatusTone } from './StatusBadge';
import { ventures, ventureCount, type VentureAccent, type VentureStatus } from './ventureData';
import { DISCORD_URL, iconPaths, BrandIcon } from './links';
import { formatNumber, reportMonth } from '@/lib/format';
import type { SalesData } from '@/types/ugc';

const statusTone: Record<VentureStatus, StatusTone> = {
  Live: 'live',
  'Coming Soon': 'soon',
};

// Full literal class strings: Tailwind's scanner cannot see interpolated names
const accentStyles: Record<VentureAccent, { chip: string; icon: string; link: string; hover: string }> = {
  blue: {
    chip: 'bg-blue-soft',
    icon: 'text-brand-blue',
    link: 'text-brand-blue',
    hover: 'hover:border-blue-border',
  },
  cyan: {
    chip: 'bg-cyan-soft',
    icon: 'text-brand-cyan-deep',
    link: 'text-brand-cyan-deep',
    hover: 'hover:border-cyan-border',
  },
  emerald: {
    chip: 'bg-success-soft',
    icon: 'text-success',
    link: 'text-success',
    hover: 'hover:border-emerald-border',
  },
};

// Slight fan for the featured tile's product stack
const fanStyles = [
  'z-30 rotate-0',
  'z-20 -ml-10 rotate-6 translate-y-2 sm:-ml-8',
  'z-10 -ml-10 rotate-12 translate-y-5 sm:-ml-8',
];

const tileBase =
  'card card-interactive spotlight group flex h-full flex-col p-6 sm:p-7';

export default function Ventures({ sales }: { sales: SalesData }) {
  const showcase = sales.topItems.filter((item) => item.thumbnail).slice(0, 3);
  const month = reportMonth(sales.dataPeriod);

  return (
    <section id="ventures" className="section scroll-mt-24">
      <div className="container-page">
        <Reveal>
          <span className="section-label mb-4">What I Do</span>
          <h2 className="heading-section max-w-3xl">
            One creator, {ventureCount} ventures, all built in the open.
          </h2>
          <p className="section-intro">
            From avatar items on the Roblox marketplace to prize competitions and moderation
            tools, here is everything I run right now.
          </p>
        </Reveal>

        <SpotlightGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {/* Featured: Roblox UGC */}
          <Reveal className="sm:col-span-2">
            <a
              href="#ugc-business"
              className={`${tileBase} hover:border-accent-border overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand-cta)] shadow-glow-brand">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <StatusBadge tone="live">Live</StatusBadge>
              </div>

              <div className="flex flex-1 flex-col lg:flex-row lg:items-center lg:gap-8">
                <div className="flex flex-1 flex-col">
                  <p className="mt-6 text-sm font-medium text-accent">Roblox UGC Creator</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">ItsCoreyE</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-secondary">
                    I design and publish avatar accessories that players buy and wear across Roblox.
                    This is where it all started.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <span className="tag bg-surface font-medium text-ink">
                      {formatNumber(sales.totalRevenue)} R$ {month ? `in ${month.short}` : 'last month'}
                    </span>
                    <span className="tag bg-surface font-medium text-ink">
                      {formatNumber(sales.totalSales)} Sales {month ? `in ${month.short}` : 'last month'}
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    See the Numbers
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>

                {showcase.length > 0 && (
                  <div aria-hidden className="mt-8 flex justify-center pb-4 lg:mt-0 lg:w-[44%] lg:shrink-0">
                    {showcase.map((item, index) => (
                      <div
                        key={item.name}
                        className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-[image:linear-gradient(160deg,var(--color-wash-violet),var(--color-wash-cyan))] shadow-card transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0 sm:h-32 sm:w-32 ${fanStyles[index]}`}
                      >
                        <Image
                          src={item.thumbnail as string}
                          alt=""
                          width={256}
                          height={256}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </a>
          </Reveal>

          {ventures.map((venture, index) => {
            const accent = accentStyles[venture.accent];
            return (
              <Reveal key={venture.id} delay={(index + 1) * 80}>
                <a
                  href={venture.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${tileBase} ${accent.hover}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.chip}`}>
                      <venture.Icon className={`h-6 w-6 ${accent.icon}`} />
                    </div>
                    <StatusBadge tone={statusTone[venture.status]}>{venture.status}</StatusBadge>
                  </div>
                  <p className={`mt-6 text-sm font-medium ${accent.link}`}>{venture.tagline}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{venture.name}</h3>
                  <p className="mt-3 flex-grow text-sm leading-relaxed text-ink-secondary">
                    {venture.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
                    <span className="text-ink-muted">Since {venture.founded}</span>
                    <span className={`inline-flex items-center gap-1 font-medium ${accent.link}`}>
                      {venture.domain}
                      <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}

          {/* Community */}
          <Reveal delay={(ventures.length + 1) * 80}>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${tileBase} border-transparent bg-[image:var(--gradient-brand-cta)] text-white hover:shadow-glow-brand`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <BrandIcon path={iconPaths.discord} className="h-6 w-6 text-white" />
              </div>
              <p className="mt-6 text-sm font-medium text-white/80">Community</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-white">Join the Discord</h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-white/90">
                The ItsCoreyE community: new UGC, updates from every venture, and a place to chat
                with me directly.
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/20 pt-4 text-sm">
                <span className="text-white/75">Free to Join</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  discord.gg/itscoreye
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        </SpotlightGroup>
      </div>
    </section>
  );
}
