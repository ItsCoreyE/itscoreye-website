import Image from 'next/image';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import CountUp from './CountUp';
import { ventures, ventureCount } from './ventureData';
import { reportMonth } from '@/lib/format';
import type { SalesData } from '@/types/ugc';

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero({ sales }: { sales: SalesData }) {
  const bestSeller = sales.topItems[0];
  const newestLaunch = ventures.find((v) => v.id === 'muzzle');

  // Sales figures are one month's report, so the label names that month.
  // Labels are kept short enough to stay on one line in every grid layout below.
  const month = reportMonth(sales.dataPeriod);
  const monthLabel = (name: string) => (month ? `${name} · ${month.short}` : `${name} Last Month`);

  const stats = [
    { label: monthLabel('Robux'), value: sales.totalRevenue },
    { label: monthLabel('Sales'), value: sales.totalSales },
    { label: 'Ventures', value: ventureCount },
    { label: 'Years Experience', value: 5, suffix: '+' },
  ];

  return (
    <section className="relative overflow-hidden px-5 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-12 lg:px-8 lg:pt-44 lg:pb-16">
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

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        {/* Copy: centred under the portrait on phones and tablets, left-aligned beside it on desktop */}
        <div className="text-center lg:text-left">
          <h1
            className="animate-rise mx-auto max-w-3xl text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-ink sm:text-6xl lg:mx-0 lg:text-[3.6rem] xl:text-[4rem]"
            style={delay(80)}
          >
            I design <span className="gradient-text">Roblox UGC</span> and build businesses people trust.
          </h1>

          <p
            className="animate-rise mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary sm:text-xl lg:mx-0"
            style={delay(160)}
          >
            I&apos;m Corey Edwards, known as ItsCoreyE. I create avatar accessories for the Roblox
            marketplace and run three ventures of my own: Odds Up, Muzzle and Fix My Rig.
          </p>

          <div className="animate-rise mt-9 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:flex sm:justify-center lg:justify-start" style={delay(240)}>
            <a href="#ventures" className="btn-primary group px-4 whitespace-nowrap sm:px-6">
              See What I Do
              <ArrowRightIcon className="hidden h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
            </a>
            <a href="#contact" className="btn-secondary px-4 whitespace-nowrap sm:px-6">
              Get in Touch
            </a>
          </div>

          <dl
            className="animate-rise mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line shadow-card sm:mt-12 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
            style={delay(320)}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse items-center justify-end bg-surface/90 px-4 py-4 sm:px-5 lg:items-start">
                <dt className="mt-1 text-xs whitespace-nowrap text-ink-muted sm:text-sm">{stat.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-ink sm:text-[1.65rem]">
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait with floating proof chips: above the copy on phones and tablets, beside it on desktop.
            On phones the chips sit on opposite corners, clear of the face, and their offsets
            never pass the 20px page margin at 320px wide. */}
        <div className="relative order-first mx-auto w-full max-w-[13.5rem] sm:max-w-[16rem] lg:order-none lg:max-w-[22rem]">
          <div
            className="animate-float-in relative aspect-[4/5] rounded-3xl bg-[image:var(--gradient-brand)] p-[1.5px] shadow-portrait lg:rounded-[var(--radius-panel)]"
            style={delay(200)}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-surface lg:rounded-[calc(var(--radius-panel)-1.5px)]">
              <Image
                src="/profile.webp"
                alt="Corey Edwards"
                fill
                priority
                sizes="(min-width: 1024px) 352px, 256px"
                className="object-cover"
              />
              {/* Name caption is desktop only: on phones the chips frame the corners and the name follows in the copy */}
              <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-ink/55 to-transparent lg:block" />
              <div className="absolute inset-x-5 bottom-5 hidden text-left text-white lg:block">
                <p className="text-lg font-semibold tracking-tight">Corey Edwards</p>
                <p className="text-sm text-white/85">Creator and Founder</p>
              </div>
            </div>
          </div>

          {bestSeller && (
            <div className="animate-float-in absolute -top-4 -left-7 sm:-left-14 lg:top-14 lg:-left-16" style={delay(520)}>
              <div className="glass animate-drift flex items-center gap-2.5 rounded-2xl p-2 pr-3 text-left shadow-float lg:gap-3 lg:p-2.5 lg:pr-4">
                <div className="h-10 w-10 shrink-0 lg:h-12 lg:w-12 overflow-hidden rounded-xl bg-surface-muted">
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
                  <p className="text-xs font-medium text-ink-muted">{month ? `Top Seller in ${month.short}` : 'Top Seller'}</p>
                  <p className="max-w-[7rem] truncate text-sm font-semibold text-ink lg:max-w-[9rem]">{bestSeller.name}</p>
                  <p className="text-xs font-medium text-success">
                    {bestSeller.sales.toLocaleString('en-GB')} sold
                  </p>
                </div>
              </div>
            </div>
          )}

          {newestLaunch && (
            <div className="animate-float-in absolute -right-7 -bottom-5 sm:-right-12 lg:-right-10 lg:bottom-24" style={delay(680)}>
              <a
                href={newestLaunch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass animate-drift flex items-center gap-2.5 rounded-2xl p-2 pr-3 text-left shadow-float transition-colors hover:border-emerald-border lg:gap-3 lg:p-2.5 lg:pr-4"
                style={{ animationDelay: '-3.5s' }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft lg:h-10 lg:w-10">
                  <ShieldCheckIcon className="h-5 w-5 text-success" />
                </span>
                <span>
                  <span className="block text-xs font-medium text-ink-muted">Newest Launch</span>
                  <span className="block text-sm font-semibold text-ink">{newestLaunch.name}</span>
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
