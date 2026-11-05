import { EyeIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Reveal from './Reveal';

const principles = [
  {
    Icon: EyeIcon,
    title: 'Transparent by Default',
    body: 'Real sales figures, realistic odds and clear pricing across everything I run.',
    chip: 'bg-accent-soft',
    icon: 'text-accent',
  },
  {
    Icon: SparklesIcon,
    title: 'Quality over Volume',
    body: 'Every item and every product gets the time it needs before it goes out.',
    chip: 'bg-blue-soft',
    icon: 'text-brand-blue',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'People First',
    body: 'Five years in customer operations taught me that honest, fast support keeps people coming back.',
    chip: 'bg-cyan-soft',
    icon: 'text-brand-cyan-deep',
  },
];

const skillGroups = [
  {
    title: 'Business',
    dot: 'bg-brand-purple',
    skills: ['Customer Service', 'Operations', 'CRM Systems', 'Process Improvement'],
  },
  {
    title: 'Technical',
    dot: 'bg-brand-blue',
    skills: ['Web Development', 'Payment Integration', 'API Design', 'IT Support'],
  },
  {
    title: 'Creative',
    dot: 'bg-brand-cyan-bright',
    skills: ['UGC Design', 'Marketing', 'Social Media', 'Brand Development'],
  },
];

export default function About() {
  return (
    <section id="about" className="section scroll-mt-24 bg-surface">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 sm:gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <span className="section-label mb-4">About</span>
            <h2 className="heading-section">The person behind the work.</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-secondary">
              I&apos;m Corey, a results-driven entrepreneur with over five years of experience in
              customer operations and service roles. I build businesses that solve real problems
              and deliver measurable value.
            </p>
            <p className="mt-4 leading-relaxed text-ink-secondary">
              Whether it&apos;s designing digital items for Roblox players, running fair prize
              competitions or keeping people&apos;s tech working, I focus on trust, quality and
              looking after the people who use what I make.
            </p>
            <figure className="mt-8 flex gap-4">
              <span aria-hidden className="w-[3px] shrink-0 self-stretch rounded-full bg-[image:var(--gradient-brand)]" />
              <blockquote className="text-lg font-medium text-ink">
                &ldquo;Building businesses that people can trust, one venture at a time.&rdquo;
              </blockquote>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              {principles.map((principle, index) => (
                <Reveal key={principle.title} delay={index * 90}>
                  <div className="card card-interactive flex gap-4 p-5 sm:p-6">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${principle.chip}`}>
                      <principle.Icon className={`h-5 w-5 ${principle.icon}`} />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">{principle.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{principle.body}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <h3 className="text-sm font-semibold tracking-[0.12em] text-ink-muted uppercase">Toolkit</h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1">
                {skillGroups.map((group) => (
                  <div key={group.title}>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${group.dot}`} />
                      {group.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span key={skill} className="tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
