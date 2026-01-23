'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BriefcaseIcon, CogIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

export default function AboutSection() {
  const skillCategories = [
    {
      title: 'Business',
      Icon: BriefcaseIcon,
      skills: ['Customer Service', 'Operations', 'CRM Systems', 'Process Improvement'],
      color: 'purple'
    },
    {
      title: 'Technical',
      Icon: CogIcon,
      skills: ['Web Development', 'Payment Integration', 'API Design', 'IT Support'],
      color: 'cyan'
    },
    {
      title: 'Creative',
      Icon: PaintBrushIcon,
      skills: ['UGC Design', 'Marketing', 'Social Media', 'Brand Development'],
      color: 'pink'
    }
  ];

  const highlights = [
    { value: '5+', label: 'Years Experience', color: 'text-purple-400' },
    { value: '3', label: 'Active Ventures', color: 'text-cyan-400' },
    { value: '100%', label: 'Commitment', color: 'text-pink-400' },
  ];

  return (
    <section id="about" className="section-padding px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
            About Me
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Profile Photo & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 flex flex-col items-center"
          >
            {/* Profile Photo with Gradient Border */}
            <div className="profile-frame mb-6">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-800 overflow-hidden">
                <Image
                  src="/profile.png"
                  alt="Corey Edwards"
                  width={176}
                  height={176}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                          <span class="text-4xl sm:text-5xl font-bold gradient-text">CE</span>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 sm:gap-6">
              {highlights.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-6 sm:p-8">
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-5">
                A results-driven entrepreneur with over <span className="text-purple-400 font-medium">5 years of experience</span> in customer operations and service roles. I&apos;m passionate about building transparent businesses that solve real problems and deliver measurable value.
              </p>
              <p className="text-base text-gray-400 leading-relaxed mb-6">
                Whether it&apos;s creating digital items for millions of Roblox users, building fair competition platforms, or providing reliable IT support - I focus on <span className="text-cyan-400 font-medium">trust, quality, and customer satisfaction</span>. I thrive in fast-paced environments and demonstrate a consistent commitment to professional development.
              </p>

              {/* Pull Quote */}
              <div className="pull-quote text-base sm:text-lg">
                &ldquo;Building businesses that people can trust, one venture at a time.&rdquo;
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Section - Horizontal Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-center text-white mb-6">
            Skills & Expertise
          </h3>

          <div className="space-y-4">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + catIndex * 0.1 }}
                className="flex flex-wrap items-center gap-2 justify-center"
              >
                <span className={`text-sm font-medium text-${category.color}-400 mr-2`}>
                  {category.title}:
                </span>
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + catIndex * 0.1 + skillIndex * 0.05 }}
                    className="skill-tag"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
