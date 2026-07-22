import Image from 'next/image';
import Reveal from './Reveal';
import { BanknotesIcon, ShoppingBagIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getCategoryProgress } from '@/lib/milestones';
import type { Milestone, SalesData } from '@/types/ugc';

const formatNumber = (value: number) => value.toLocaleString('en-GB');

// "HairAccessory" → "Hair Accessory"
const formatAssetType = (assetType: string) => assetType.replace(/([A-Z])/g, ' $1').trim();

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const socialLinks = [
  {
    name: 'Roblox Profile',
    href: 'https://www.roblox.com/users/3504185/profile',
    iconPath:
      'M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 14.727l-4.04-1.06 1.058-4.041 4.04 1.06-1.058 4.04z',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@itscoreye',
    iconPath:
      'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
  },
  {
    name: 'Discord Server',
    href: 'https://discord.gg/itscoreye',
    iconPath:
      'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
];

interface UgcShowcaseProps {
  sales: SalesData;
  milestones: Milestone[];
}

export default function UgcShowcase({ sales, milestones }: UgcShowcaseProps) {
  const topItems = sales.topItems.slice(0, 3);
  const lastUpdated = formatDate(sales.lastUpdated);
  const verification = milestones.find((m) => m.id === 'verify-roblox');
  const isVerified = verification?.isCompleted ?? false;
  const categoryProgress = getCategoryProgress(milestones);
  const growth = sales.growthPercentage;

  return (
    <section
      id="ugc-business"
      className="scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:px-8 [background-image:linear-gradient(180deg,var(--color-wash-violet),var(--color-wash-cyan))]"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3">Featured venture</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            <span className="gradient-text">ItsCoreyE</span> UGC Creator
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Real numbers from the Roblox marketplace: every figure below is pulled from actual
            sales reports.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal delay={75}>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            <div className="card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                <BanknotesIcon className="h-5 w-5 text-accent" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">
                  {formatNumber(sales.totalRevenue)}
                </span>
                {growth !== 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      growth > 0 ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
                    }`}
                  >
                    {growth > 0 ? '+' : ''}
                    {growth}%
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-ink-muted">Total Revenue (R$)</div>
            </div>
            <div className="card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-soft">
                <ShoppingBagIcon className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-tight text-ink tabular-nums">
                {formatNumber(sales.totalSales)}
              </div>
              <div className="mt-1 text-sm text-ink-muted">Total Sales</div>
            </div>
            <div className="card p-6 sm:col-span-2 lg:col-span-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-soft">
                <CalendarIcon className="h-5 w-5 text-brand-cyan-deep" />
              </div>
              <div className="mt-4 text-lg leading-snug font-semibold break-words text-ink">
                {sales.dataPeriod || 'Current Period'}
              </div>
              <div className="mt-1 text-sm text-ink-muted">Data Period</div>
              {lastUpdated && (
                <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Updated {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Best sellers */}
        {topItems.length > 0 && (
          <Reveal delay={100}>
            <h3 className="mt-14 text-xl font-semibold text-ink">Best sellers</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-6">
              {topItems.map((item) => (
                <div key={item.name} className="card card-interactive overflow-hidden">
                  <div className="relative aspect-square bg-surface-muted">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        width={420}
                        height={420}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-muted">
                        <svg className="h-14 w-14 opacity-40" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          <path d="M14 2v6h6" />
                          <rect x="8" y="12" width="8" height="6" rx="1" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="line-clamp-2 leading-snug font-semibold text-ink">{item.name}</h4>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-success">
                        {formatNumber(item.sales)} sold
                      </span>
                      <span className="font-medium text-ink-secondary">{item.price} R$</span>
                    </div>
                    {item.assetType && (
                      <span className="tag mt-3 text-xs">{formatAssetType(item.assetType)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Road to Verified Creator */}
        <Reveal delay={100}>
          <div className="card-gradient-border rounded-card shadow-card mt-14 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-ink">Road to Verified Creator</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isVerified ? 'bg-success-soft text-success' : 'bg-accent-soft text-accent'
                }`}
              >
                {isVerified ? 'Verified ✓' : 'In progress'}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              Roblox verification requires 2,000,000 Robux earned within 90 days and 200,000 total
              items sold. All milestones below are manually verified for transparency.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
              {categoryProgress.map((category) => {
                const percentage =
                  category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0;
                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink">{category.title}</span>
                      <span className="text-ink-muted tabular-nums">
                        {category.completed}/{category.total}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-[image:var(--gradient-brand)]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Social links */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:border-accent-border hover:text-accent"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.iconPath} />
                </svg>
                {social.name}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
