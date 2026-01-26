'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import VenturesOverview from '@/components/VenturesOverview';
import LiveStats from '@/components/LiveStats';
import FeaturedItems from '@/components/FeaturedItems';
import MilestonesSection from '@/components/MilestonesSection';
import AboutSection from '@/components/AboutSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navigation />

      <main className="relative min-h-screen modern-gradient-bg overflow-hidden">
        {/* Modern animated background */}
        <div className="absolute inset-0">
          <ModernBackground />
        </div>

        {/* Hero Section */}
        <div className="relative z-10">
          <Hero />
        </div>

        {/* Section Divider */}
        <div className="flex justify-center px-5 sm:px-6 lg:px-8">
          <div className="section-divider w-full max-w-4xl" />
        </div>

        {/* About Section */}
        <div className="relative z-10">
          <AboutSection />
        </div>

        {/* Section Divider */}
        <div className="flex justify-center px-5 sm:px-6 lg:px-8">
          <div className="section-divider w-full max-w-4xl" />
        </div>

        {/* Ventures Overview */}
        <div className="relative z-10">
          <VenturesOverview />
        </div>

        {/* Section Divider */}
        <div className="flex justify-center px-5 sm:px-6 lg:px-8">
          <div className="section-divider w-full max-w-4xl" />
        </div>

        {/* UGC Business Section - Featured Venture */}
        <section id="ugc-business" className="relative z-10 scroll-mt-20 section-padding px-5 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-purple-300 font-medium text-sm">FEATURED VENTURE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
                ItsCoreyE - UGC Creator
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
                Verified success in the Roblox marketplace with transparent, real-time metrics
              </p>
            </motion.div>

            {/* Live Stats */}
            <div className="flex flex-col items-center justify-center">
              <LiveStats />

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-3xl mt-6 mb-8 sm:mt-8 sm:mb-12"
              >
                <a
                  href="https://www.roblox.com/users/3504185/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2.5 whitespace-nowrap text-gray-300 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                >
                  <svg className="w-5 h-5 shrink-0 text-purple-400 transition-colors duration-300 group-hover:text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 14.727l-4.04-1.06 1.058-4.041 4.04 1.06-1.058 4.04z"/>
                  </svg>
                  <span>ROBLOX Profile</span>
                </a>
                <a
                  href="https://www.tiktok.com/@itscoreye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2.5 whitespace-nowrap text-gray-300 transition-all duration-300 hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
                >
                  <svg className="w-5 h-5 shrink-0 text-pink-400 transition-colors duration-300 group-hover:text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span>Follow on TikTok</span>
                </a>
                <a
                  href="https://discord.gg/nbQArRaq8m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2.5 whitespace-nowrap text-gray-300 transition-all duration-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                >
                  <svg className="w-5 h-5 shrink-0 text-indigo-400 transition-colors duration-300 group-hover:text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Join Discord Server</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Featured Items */}
          <FeaturedItems />

          {/* Milestones */}
          <MilestonesSection />
        </section>

        {/* Section Divider */}
        <div className="flex justify-center px-5 sm:px-6 lg:px-8">
          <div className="section-divider w-full max-w-4xl" />
        </div>

        {/* Contact Section */}
        <div className="relative z-10">
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

// Modern Animated Background with subtle particles
function ModernBackground() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, delay: number}>>([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animation: 'particle-float 20s linear infinite'
          }}
        />
      ))}
    </div>
  );
}
