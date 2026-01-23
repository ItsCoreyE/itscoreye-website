'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const [discordCopied, setDiscordCopied] = useState(false);

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('itscoreye');
      setDiscordCopied(true);
      setTimeout(() => setDiscordCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Discord username:', err);
    }
  };

  const contactOptions = [
    {
      id: 'email',
      title: 'Email',
      subtitle: 'Professional inquiries',
      icon: (
        <EnvelopeIcon className="w-8 h-8 text-purple-400" />
      ),
      iconBg: 'bg-purple-500/10',
      action: 'link',
      href: 'mailto:contact@itscoreye.com',
      buttonText: 'contact@itscoreye.com',
      buttonStyle: 'primary'
    },
    {
      id: 'discord-dm',
      title: 'Discord DM',
      subtitle: 'Direct message',
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      iconBg: 'bg-indigo-500/10',
      action: 'copy',
      buttonText: 'itscoreye',
      buttonStyle: 'secondary'
    },
    {
      id: 'discord-server',
      title: 'Discord Server',
      subtitle: 'Join the community',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Interested in my ventures, UGC collaborations, or just want to connect?
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {contactOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="contact-card p-6 sm:p-7 text-center"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl ${option.iconBg} flex items-center justify-center mx-auto mb-5`}>
                {option.icon}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-bold text-white mb-1">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {option.subtitle}
              </p>

              {/* Action Button */}
              {option.action === 'link' ? (
                <a
                  href={option.href}
                  target={option.id === 'discord-server' ? '_blank' : undefined}
                  rel={option.id === 'discord-server' ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    option.buttonStyle === 'primary'
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90'
                      : option.buttonStyle === 'green'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {option.buttonText}
                  {option.id === 'discord-server' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ) : (
                <button
                  onClick={handleCopyDiscord}
                  className="relative inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-medium text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  <span>{option.buttonText}</span>
                  {discordCopied ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {discordCopied && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-400"
                    >
                      Copied!
                    </motion.span>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Response Time Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          Response time: Usually within 24 hours
        </motion.p>
      </div>
    </section>
  );
}
