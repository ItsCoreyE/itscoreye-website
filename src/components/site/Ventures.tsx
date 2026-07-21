import Reveal from './Reveal';
import {
  RocketLaunchIcon,
  TrophyIcon,
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';
import type { SalesData } from '@/types/ugc';

const formatNumber = (value: number) => value.toLocaleString('en-US');

type VentureStatus = 'Live' | 'Coming Soon';

const statusBadge: Record<VentureStatus, string> = {
  Live: 'bg-success-soft text-success',
  'Coming Soon': 'bg-surface-muted text-ink-muted',
};

type VentureAccent = 'purple' | 'blue' | 'cyan' | 'emerald';

// Full literal class strings: Tailwind's scanner cannot see interpolated names
const accentStyles: Record<
  VentureAccent,
  { chip: string; icon: string; link: string; hover: string }
> = {
  purple: {
    chip: 'bg-accent-soft',
    icon: 'text-accent',
    link: 'text-accent',
    hover: 'hover:border-accent-border',
  },
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

export default function Ventures({ sales }: { sales: SalesData }) {
  const ventures: Array<{
    id: string;
    Icon: typeof RocketLaunchIcon;
    name: string;
    subtitle: string;
    description: string;
    status: VentureStatus;
    accent: VentureAccent;
    detail: string;
    link: string;
    isInternal: boolean;
  }> = [
    {
      id: 'itscoreye',
      Icon: RocketLaunchIcon,
      name: 'ItsCoreyE',
      subtitle: 'Roblox UGC Creator',
      description: 'Quality UGC items for Roblox avatars with a focus on unique designs',
      status: 'Live',
      accent: 'purple',
      detail: `${formatNumber(sales.totalRevenue)} R$ earned · ${formatNumber(sales.totalSales)} sales`,
      link: '#ugc-business',
      isInternal: true,
    },
    {
      id: 'oddsup',
      Icon: TrophyIcon,
      name: 'Odds Up',
      subtitle: 'Prize Competition Platform',
      description: 'Fair competitions with realistic odds and transparent prizes',
      status: 'Coming Soon',
      accent: 'blue',
      detail: 'Founded Dec 2025',
      link: 'https://www.oddsup.co.uk',
      isInternal: false,
    },
    {
      id: 'fixmyrig',
      Icon: ComputerDesktopIcon,
      name: 'Fix My Rig',
      subtitle: 'Remote IT Support',
      description: 'Expert tech assistance from anywhere in the world',
      status: 'Coming Soon',
      accent: 'cyan',
      detail: 'Founded Feb 2025',
      link: 'https://www.fixmyrig.co.uk',
      isInternal: false,
    },
    {
      id: 'clicktheotter',
      Icon: CursorArrowRaysIcon,
      name: 'Click The Otter',
      subtitle: 'Idle Clicker Game',
      description:
        'Free idle clicker game with achievements, prestige mechanics, and endless progression',
      status: 'Live',
      accent: 'emerald',
      detail: 'Founded Feb 2026',
      link: 'https://www.clicktheotter.com',
      isInternal: false,
    },
  ];

  return (
    <section id="ventures" className="scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3">Ventures</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What I&apos;m building
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Four ventures focused on transparency, quality, and customer satisfaction.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {ventures.map((venture, index) => {
            const accent = accentStyles[venture.accent];
            return (
            <Reveal key={venture.id} delay={index * 75}>
              <a
                href={venture.link}
                target={venture.isInternal ? undefined : '_blank'}
                rel={venture.isInternal ? undefined : 'noopener noreferrer'}
                className={`card card-interactive group flex h-full flex-col p-6 sm:p-7 ${accent.hover}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.chip}`}>
                    <venture.Icon className={`h-6 w-6 ${accent.icon}`} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge[venture.status]}`}
                  >
                    {venture.status}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-ink">{venture.name}</h3>
                <p className="text-sm text-ink-muted">{venture.subtitle}</p>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-ink-secondary">
                  {venture.description}
                </p>

                <p className="mt-4 text-sm font-medium text-ink">{venture.detail}</p>

                <div className={`mt-4 flex items-center gap-1.5 border-t border-line pt-4 text-sm font-medium ${accent.link}`}>
                  <span>{venture.isInternal ? 'View details' : 'Visit site'}</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
