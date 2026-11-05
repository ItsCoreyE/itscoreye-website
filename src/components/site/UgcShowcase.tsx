import type { CSSProperties } from 'react';
import Image from 'next/image';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import Reveal from './Reveal';
import CountUp from './CountUp';
import { socialLinks, BrandIcon } from './links';
import { getCategoryProgress } from '@/lib/milestones';
import { formatAssetType, formatDate, formatNumber } from '@/lib/format';
import type { Milestone, SalesData } from '@/types/ugc';

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
  const perSale = sales.totalSales > 0 ? sales.totalRevenue / sales.totalSales : 0;

  const tracked = categoryProgress.reduce(
    (sum, category) => ({ done: sum.done + category.completed, total: sum.total + category.total }),
    { done: 0, total: 0 }
  );
  const overall = tracked.total > 0 ? Math.round((tracked.done / tracked.total) * 100) : 0;

  return (
    <section
      id="ugc-business"
      className="section relative scroll-mt-24 overflow-hidden [background-image:linear-gradient(180deg,var(--color-wash-violet),var(--color-wash-cyan))]"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[image:linear-gradient(90deg,transparent,var(--color-accent-border),transparent)]" />

      <div className="container-page relative">
        <Reveal>
          <span className="section-label mb-4">Featured Venture</span>
          <h2 className="heading-section">
            <span className="gradient-text">ItsCoreyE</span> on Roblox
          </h2>
          <p className="section-intro">
            Real numbers from the Roblox marketplace. Every figure below comes straight from my
            sales reports.
          </p>
        </Reveal>

        {/* Headline numbers */}
        <Reveal delay={80}>
          <div className="card mt-12 overflow-hidden">
            <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
              <div className="col-span-2 flex flex-col-reverse bg-surface p-6 sm:col-span-1 sm:p-8">
                <dt className="mt-2 text-sm text-ink-muted">Robux Earned</dt>
                <dd className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    <CountUp value={sales.totalRevenue} gradient />
                  </span>
                  {growth !== 0 && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        growth > 0 ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
                      }`}
                    >
                      {growth > 0 ? '+' : ''}
                      {growth}% vs last month
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex flex-col-reverse bg-surface p-6 sm:p-8">
                <dt className="mt-2 text-sm text-ink-muted">Items Sold</dt>
                <dd className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                  <CountUp value={sales.totalSales} />
                </dd>
              </div>
              <div className="flex flex-col-reverse bg-surface p-6 sm:p-8">
                <dt className="mt-2 text-sm text-ink-muted">Robux per Sale</dt>
                <dd className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                  <CountUp value={perSale} decimals={1} />
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-1 border-t border-line bg-surface-muted/60 px-6 py-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="break-words">Period: {sales.dataPeriod || 'Current period'}</span>
              {lastUpdated && (
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Updated {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* Best sellers */}
        {topItems.length > 0 && (
          <div className="mt-20">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-ink">Best Sellers</h3>
                  <p className="mt-1 text-ink-muted">Ranked by total units sold.</p>
                </div>
                <p className="text-sm text-ink-muted sm:hidden">Swipe to see more</p>
              </div>
            </Reveal>

            {/* Swipeable on phones, a three-up grid from sm */}
            <div className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
              {topItems.map((item, index) => (
                <Reveal
                  key={item.name}
                  delay={index * 90}
                  className="w-[78%] shrink-0 snap-start sm:w-auto"
                >
                  <article className="card card-interactive group h-full overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-[image:radial-gradient(circle_at_50%_40%,var(--color-surface),var(--color-wash-violet)_70%)]">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          width={420}
                          height={420}
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-muted">
                          <svg className="h-14 w-14 opacity-40" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <rect x="8" y="12" width="8" height="6" rx="1" />
                          </svg>
                        </div>
                      )}
                      <span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold text-ink">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="p-5">
                      <h4 className="line-clamp-1 font-semibold text-ink">{item.name}</h4>
                      {item.assetType && (
                        <p className="mt-0.5 text-sm text-ink-muted">{formatAssetType(item.assetType)}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                        <span className="rounded-full bg-success-soft px-2.5 py-1 font-medium text-success">
                          {formatNumber(item.sales)} sold
                        </span>
                        <span className="font-semibold text-ink">{item.price} R$</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Road to Verified Creator */}
        <Reveal className="mt-20">
          <div className="card-gradient-border rounded-[var(--radius-panel)] shadow-card p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    isVerified ? 'bg-success-soft text-success' : 'bg-accent-soft text-accent'
                  }`}
                >
                  {isVerified && <CheckBadgeIcon className="h-4 w-4" />}
                  {isVerified ? 'Verified' : 'In Progress'}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Road to Verified Creator
                </h3>
                <p className="mt-3 leading-relaxed text-ink-muted">
                  Roblox verification needs 2,000,000 Robux earned within 90 days and 200,000 total
                  items sold. Every milestone here is checked by hand, so you are seeing the real
                  progress.
                </p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-5xl font-semibold tracking-tight">
                    <CountUp value={overall} gradient />
                    <span className="gradient-text">%</span>
                  </span>
                  <span className="text-sm text-ink-muted">
                    of {tracked.total} milestones complete
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                {categoryProgress.map((category) => {
                  const ratio = category.total > 0 ? category.completed / category.total : 0;
                  return (
                    <div key={category.category}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-ink">{category.title}</span>
                        <span className="text-ink-muted tabular-nums">
                          {category.completed} of {category.total}
                        </span>
                      </div>
                      <div
                        className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface-muted"
                        role="progressbar"
                        aria-label={`${category.title} milestones`}
                        aria-valuemin={0}
                        aria-valuemax={category.total}
                        aria-valuenow={category.completed}
                      >
                        <div
                          className="progress-fill h-full rounded-full bg-[image:var(--gradient-brand)]"
                          style={{ '--progress': ratio } as CSSProperties}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Follow along */}
        <Reveal className="mt-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm font-medium text-ink-muted">Follow the UGC Journey</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-secondary shadow-sm transition-colors hover:border-accent-border hover:text-accent"
                >
                  <BrandIcon path={social.iconPath} className="h-4 w-4" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
