'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
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
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-2xl mt-6 mb-8 sm:mt-8 sm:mb-12"
              >
                <a
                  href="https://www.roblox.com/users/3504185/profile"
                  target="_blank"
                  className="modern-button px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ color: '#ffffff' }}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  <span>View ROBLOX Profile</span>
                </a>
                <a
                  href="https://www.tiktok.com/@itscoreye"
                  target="_blank"
                  className="modern-button px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ color: '#ffffff' }}
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  <span>Follow on TikTok</span>
                </a>
                <a
                  href="https://discord.gg/nbQArRaq8m"
                  target="_blank"
                  className="modern-button px-5 sm:px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ color: '#ffffff' }}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
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
