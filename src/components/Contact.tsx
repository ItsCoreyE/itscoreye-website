'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('itscoreye');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Discord username:', err);
    }
  };

  return (
    <section className="dark-rich-gradient py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-amber-100">
            Get In Touch
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 sm:w-24"></div>
            <span className="text-2xl sm:text-3xl">💬</span>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 sm:w-24"></div>
          </div>
          <p className="text-base sm:text-lg text-amber-300/90 max-w-2xl mx-auto leading-relaxed">
            Got questions or want to chat? Drop me a message on Discord
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative premium-card enhanced-glass deep-shadow hover-lift glow-border rounded-xl p-8 sm:p-10 max-w-md w-full"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400/60"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400/60"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400/60"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400/60"></div>

            <div className="text-center">
              {/* Discord Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-full border border-indigo-500/40 mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-100 mb-2">Discord</h3>
                <p className="text-amber-300/80 text-sm mb-4">Always happy to have a chat</p>
              </div>

              {/* Discord Username */}
              <motion.button
                onClick={handleCopyDiscord}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg border border-indigo-500/40 shadow-lg hover:shadow-xl transition-all duration-300 w-full group"
                style={{
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>itscoreye</span>
                  {copied ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </span>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Copied!
                  </motion.div>
                )}
              </motion.button>
              
              <p className="text-amber-400/60 text-xs mt-3">Click to copy username</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
