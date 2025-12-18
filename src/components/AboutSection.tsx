'use client';
import { motion } from 'framer-motion';
import { BriefcaseIcon, CogIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

export default function AboutSection() {
  const skillCategories = [
    {
      title: 'Business & Operations',
      Icon: BriefcaseIcon,
      skills: [
        'Customer Service Excellence',
        'Operations Management', 
        'CRM Systems',
        'Process Improvement',
        'Relationship Building',
        'Problem Solving'
      ],
      color: 'text-purple-400'
    },
    {
      title: 'Technical Skills',
      Icon: CogIcon,
      skills: [
        'Web Development',
        'Payment Integration (Stripe)',
        'API Design & Management',
        'Database Management',
        'IT Support & Troubleshooting',
        'System Security'
      ],
      color: 'text-cyan-400'
    },
    {
      title: 'Creative & Marketing',
      Icon: PaintBrushIcon,
      skills: [
        'UGC Design (Roblox)',
        'Marketing Strategy',
        'Social Media Management',
        'Community Building',
        'Brand Development',
        'Content Creation'
      ],
      color: 'text-pink-400'
    }
  ];

  return (
    <section className="section-padding px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text">
            About Me
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6"></div>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 md:p-10 mb-12 subtle-glow"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-lg sm:text-xl text-gray-100 leading-relaxed mb-6">
              A results-driven entrepreneur with over <span className="text-purple-400 font-semibold">5 years of experience</span> in customer operations and service roles. I'm passionate about building transparent businesses that solve real problems and deliver measurable value.
            </p>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              Whether it's creating digital items for millions of Roblox users, building fair competition platforms, or providing reliable IT support - I focus on <span className="text-cyan-400 font-semibold">trust, quality, and customer satisfaction</span>. I thrive in fast-paced environments and demonstrate a consistent commitment to professional development and operational excellence.
            </p>
          </div>
        </motion.div>

        {/* Skills Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
              Skills & Expertise
            </h3>
            <p className="text-gray-200">
              A diverse skill set across business, technology, and creativity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 hover-lift"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
                  <div className={`p-2 rounded-lg ${category.color.replace('text-', 'bg-')}/10 border border-${category.color.replace('text-', '')}/20`}>
                    <category.Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h4 className={`text-lg font-bold ${category.color}`}>
                    {category.title}
                  </h4>
                </div>

                {/* Skills List */}
                <ul className="space-y-2">
                  {category.skills.map((skill, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 + idx * 0.05 }}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${category.color.replace('text-', 'bg-')}`}></div>
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats/Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { number: '5+', label: 'Years Experience', color: 'text-purple-400', isText: true },
            { number: '3', label: 'Active Ventures', color: 'text-cyan-400', isText: true },
            { number: '100%', label: 'Commitment', color: 'text-pink-400', isText: true },
            { number: null, label: 'Learning', isInfinity: true }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="glass-card p-4 text-center"
            >
              {stat.isInfinity ? (
                <div className="flex justify-center items-center mb-1">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M18.178 8C21.056 8 23 9.944 23 12.722c0 2.778-1.944 4.722-4.822 4.722-1.667 0-3.167-.667-4.278-1.778L12 13.778l-1.9 1.888C8.989 16.778 7.489 17.444 5.822 17.444 2.944 17.444 1 15.5 1 12.722 1 9.944 2.944 8 5.822 8c1.667 0 3.167.667 4.278 1.778L12 11.666l1.9-1.888C15.011 8.666 16.511 8 18.178 8z" 
                      stroke="url(#infinity-gradient)" 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="infinity-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ) : (
                <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-1 h-12 sm:h-14 flex items-center justify-center`}>
                  {stat.number}
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
