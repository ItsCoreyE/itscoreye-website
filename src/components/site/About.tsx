import Reveal from './Reveal';

const facts = [
  { value: '5+', label: 'Years Experience', colour: 'text-brand-purple' },
  { value: '4', label: 'Active Ventures', colour: 'text-brand-blue' },
  { value: '100%', label: 'Commitment', colour: 'text-brand-cyan-deep' },
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
    <section id="about" className="scroll-mt-20 px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="section-label mb-3">About</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            A little about me
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal delay={75} className="lg:col-span-3">
            <p className="text-lg leading-relaxed text-ink-secondary">
              A results-driven entrepreneur with over five years of experience in customer
              operations and service roles. I&apos;m passionate about building transparent
              businesses that solve real problems and deliver measurable value.
            </p>
            <p className="mt-4 leading-relaxed text-ink-secondary">
              Whether it&apos;s creating digital items for millions of Roblox users, building fair
              competition platforms, or providing reliable IT support, I focus on trust, quality,
              and customer satisfaction. I thrive in fast-paced environments and demonstrate a
              consistent commitment to professional development.
            </p>
            <blockquote className="mt-6 flex gap-4">
              <span aria-hidden className="w-[3px] shrink-0 self-stretch rounded-full bg-[image:var(--gradient-brand)]" />
              <span className="text-ink italic">
                &ldquo;Building businesses that people can trust, one venture at a time.&rdquo;
              </span>
            </blockquote>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-2">
            <div className="card grid grid-cols-3 gap-3 p-5 text-center sm:gap-4 sm:p-6">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <div className={`text-2xl font-semibold ${fact.colour}`}>{fact.value}</div>
                  <div className="mt-1 text-xs leading-tight text-ink-muted">{fact.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-5">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                    <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${group.dot}`} />
                    {group.title}
                  </h3>
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
    </section>
  );
}
