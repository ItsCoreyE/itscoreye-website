'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const { duration, delay, enableHover } = usePerformanceMode();

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('itscoreye');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Discord username:', err);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText('https://discord.gg/nbQArRaq8m');
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Discord invite:', err);
    }
  };

  return (
    <section className="modern-gradient-bg section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4 leading-relaxed">
            Interested in my ventures, UGC collaborations, or just want to connect? Reach out on Discord
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Discord Username Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration * 0.625, delay }}
            whileHover={enableHover ? { y: -8 } : undefined}
            className="glass-card hover-lift p-8 sm:p-10 rounded-xl flex-1 group"
            style={{ willChange: 'transform' }}
          >
            <div className="text-center">
              {/* Discord Icon */}
              <motion.div 
                className="mb-6"
                whileHover={enableHover ? { scale: 1.1, rotate: 5 } : undefined}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ willChange: 'transform' }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-4 group-hover:border-indigo-500/40 transition-colors">
                  <svg className="w-10 h-10 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">Direct Message</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">Send me a private message</p>
              </motion.div>

              {/* Discord Username */}
              <motion.button
                onClick={handleCopyDiscord}
                whileHover={enableHover ? { scale: 1.05 } : undefined}
                whileTap={{ scale: 0.98 }}
                className="relative modern-button w-full py-4 text-lg font-bold flex items-center justify-center gap-3 group"
                style={{ willChange: 'transform' }}
              >
                <span className="text-white">itscoreye</span>
                {copied ? (
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 text-green-700" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                  >
                    Copied!
                  </motion.div>
                )}
              </motion.button>
              
              <p className="text-gray-300 text-xs sm:text-sm mt-3">Click to copy username</p>
            </div>
          </motion.div>

          {/* Discord Server Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: duration * 0.625, delay: delay * 1.5 }}
            whileHover={enableHover ? { y: -8 } : undefined}
            className="glass-card hover-lift p-8 sm:p-10 rounded-xl flex-1 group"
            style={{ willChange: 'transform' }}
          >
            <div className="text-center">
              {/* Server Icon */}
              <motion.div 
                className="mb-6"
                whileHover={enableHover ? { scale: 1.1, rotate: -5 } : undefined}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ willChange: 'transform' }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-4 group-hover:border-purple-500/40 transition-colors">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">Join My Server</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">Connect with the community</p>
              </motion.div>

              {/* Server Invite Buttons */}
              <div className="flex flex-col items-center space-y-3">
                <motion.button
                  onClick={handleCopyInvite}
                  whileHover={enableHover ? { scale: 1.05 } : undefined}
                  whileTap={{ scale: 0.98 }}
                  className="relative modern-button px-6 py-3 text-base font-semibold flex items-center justify-center gap-3 group"
                  style={{ willChange: 'transform' }}
                >
                  <span className="text-white">Copy Invite Link</span>
                  {inviteCopied ? (
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 text-green-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-700 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {inviteCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                    >
                      Copied!
                    </motion.div>
                  )}
                </motion.button>

                {/* Direct Join Button */}
                <motion.a 
                  href="https://discord.gg/nbQArRaq8m" 
                  target="_blank"
                  whileHover={enableHover ? { scale: 1.05 } : undefined}
                  whileTap={{ scale: 0.98 }}
                  className="modern-button px-6 py-3 text-base font-semibold flex items-center justify-center gap-3 group"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#ffffff',
                    willChange: 'transform'
                  }}
                >
                  <span>Join Now</span>
                  <svg className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm mt-3">discord.gg/nbQArRaq8m</p>
            </div>
          </motion.div>
        </div>

        {/* Additional Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: delay * 2 }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 text-sm">
            Response time: Usually within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
