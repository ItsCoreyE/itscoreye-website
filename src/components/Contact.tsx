'use client';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const contactOptions = [
    {
      id: 'email',
      title: 'Email',
      subtitle: 'Professional inquiries',
      icon: (
        <EnvelopeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
      ),
      iconBg: 'bg-purple-500/10',
      action: 'link',
      href: 'mailto:itscoreyedwards@gmail.com',
      buttonText: 'itscoreyedwards@gmail.com',
      buttonStyle: 'primary'
    },
    {
      id: 'discord-server',
      title: 'Discord Server',
      subtitle: 'Join the community',
      icon: (
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconBg: 'bg-cyan-500/10',
      action: 'link',
      href: 'https://discord.gg/nbQArRaq8m',
      buttonText: 'Join Server',
      buttonStyle: 'green'
    }
  ];

  return (
    <section id="contact" className="section-padding px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="container mx-auto max-w-3xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Interested in my ventures, UGC collaborations, or just want to connect?
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {contactOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="contact-card p-5 sm:p-6 text-center"
            >
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${option.iconBg} flex items-center justify-center mx-auto mb-4`}>
                {option.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 sm:mb-5">
                {option.subtitle}
              </p>

              {/* Action Button */}
              <a
                href={option.href}
                target={option.id === 'discord-server' ? '_blank' : undefined}
                rel={option.id === 'discord-server' ? 'noopener noreferrer' : undefined}
                className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm transition-all ${
                  option.buttonStyle === 'primary'
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90'
                    : option.buttonStyle === 'green'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <span className="truncate">{option.buttonText}</span>
                {option.id === 'discord-server' && (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Response Time Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Response time: Usually within 24 hours
        </motion.p>
      </div>
    </section>
  );
}
