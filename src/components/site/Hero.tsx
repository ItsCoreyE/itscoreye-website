import Image from 'next/image';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import CountUp from './CountUp';
import { ROBLOX_PROFILE_URL } from './links';
import { ventures, ventureCount } from './ventureData';
import type { SalesData } from '@/types/ugc';

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero({ sales }: { sales: SalesData }) {
  const bestSeller = sales.topItems[0];
  const newestLaunch = ventures.find((v) => v.id === 'muzzle');

  const stats = [
    { label: 'Robux Earned', value: sales.totalRevenue },
    { label: 'UGC Items Sold', value: sales.totalSales },
    { label: 'Ventures', value: ventureCount },
    { label: 'Years Experience', value: 5, suffix: '+' },
  ];

  return (
    <section className="relative overflow-hidden px-5 pt-28 pb-8 sm:px-6 sm:pt-40 sm:pb-12 lg:px-8 lg:pt-44 lg:pb-16">
      {/* Background: faint grid plus soft brand light */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute top-[-8rem] left-[-10rem] h-[clamp(20rem,50vw,40rem)] w-[clamp(20rem,50vw,40rem)]"
          style={{ background: 'radial-gradient(closest-side, rgb(147 51 234 / 0.16), transparent 70%)' }}
        />
        <div
          className="absolute top-[30%] right-[-10rem] h-[clamp(18rem,45vw,36rem)] w-[clamp(18rem,45vw,36rem)]"
          style={{ background: 'radial-gradient(closest-side, rgb(6 182 212 / 0.14), transparent 70%)' }}
        />
        <div
          className="absolute top-[-4rem] left-1/2 h-[clamp(14rem,32vw,26rem)] w-[clamp(14rem,32vw,26rem)] -translate-x-1/2"
          style={{ background: 'radial-gradient(closest-side, rgb(59 130 246 / 0.1), transparent 70%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-canvas" />
      </div>

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <a
            href={ROBLOX_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass animate-rise group inline-flex min-h-11 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm shadow-card transition-colors hover:border-accent-border"
          >
            <Image
              src="/profile.webp"
              alt=""
              width={64}
              height={64}
              priority
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-semibold text-ink">ItsCoreyE</span>
            <span aria-hidden className="h-4 w-px bg-line" />
            <span className="text-ink-muted transition-colors group-hover:text-accent">Roblox UGC Creator</span>
          </a>

          <h1
            className="animate-rise mt-7 max-w-3xl text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-ink sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]"
            style={delay(80)}
          >
            I design <span className="gradient-text">Roblox UGC</span> and build businesses people trust.
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl"
            style={delay(160)}
          >
            I&apos;m Corey Edwards. I create avatar accessories for the Roblox marketplace and run three
            ventures of my own: Odds Up, Muzzle and Fix My Rig.
          </p>

          <div className="animate-rise mt-9 grid grid-cols-2 gap-3 sm:flex" style={delay(240)}>
            <a href="#ventures" className="btn-primary group px-4 sm:px-6">
              See What I Do
              <ArrowRightIcon className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
            </a>
            <a href="#contact" className="btn-secondary px-4 sm:px-6">
              Get in Touch
            </a>
          </div>

          <dl
            className="animate-rise mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line shadow-card sm:grid-cols-4"
            style={delay(320)}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-surface/90 px-4 py-4 sm:px-5">
                <dt className="mt-1 text-xs leading-snug text-ink-muted sm:text-sm">{stat.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.65rem]">
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait with floating proof chips (desktop) */}
        <div className="relative mx-auto hidden w-full max-w-[22rem] lg:block">
          <div
            className="animate-float-in relative aspect-[4/5] rounded-[var(--radius-panel)] bg-[image:var(--gradient-brand)] p-[1.5px] shadow-portrait"
            style={delay(200)}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[calc(var(--radius-panel)-1.5px)] bg-surface">
              <Image
                src="/profile.webp"
                alt="Corey Edwards"
                fill
                priority
                sizes="352px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="text-lg font-semibold tracking-tight">Corey Edwards</p>
                <p className="text-sm text-white/85">Creator and Founder</p>
              </div>
            </div>
          </div>

          {bestSeller && (
            <div className="animate-float-in absolute top-14 -left-16" style={delay(520)}>
              <div className="glass animate-drift flex items-center gap-3 rounded-2xl p-2.5 pr-4 shadow-float">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  {bestSeller.thumbnail && (
                    <Image
                      src={bestSeller.thumbnail}
                      alt=""
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink-muted">Best Seller</p>
                  <p className="max-w-[9rem] truncate text-sm font-semibold text-ink">{bestSeller.name}</p>
                  <p className="text-xs font-medium text-success">
                    {bestSeller.sales.toLocaleString('en-GB')} sold
                  </p>
                </div>
              </div>
            </div>
          )}

          {newestLaunch && (
            <div className="animate-float-in absolute -right-10 bottom-24" style={delay(680)}>
              <a
                href={newestLaunch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass animate-drift flex items-center gap-3 rounded-2xl p-2.5 pr-4 shadow-float transition-colors hover:border-emerald-border"
                style={{ animationDelay: '-3.5s' }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft">
                  <ShieldCheckIcon className="h-5 w-5 text-success" />
                </span>
                <span>
                  <span className="block text-xs font-medium text-ink-muted">Newest Launch</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    {newestLaunch.name}
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  </span>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
