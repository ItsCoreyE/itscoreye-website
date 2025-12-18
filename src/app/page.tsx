'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import Hero from '@/components/Hero';
import VenturesOverview from '@/components/VenturesOverview';
import LiveStats from '@/components/LiveStats';
import FeaturedItems from '@/components/FeaturedItems';
import MilestonesSection from '@/components/MilestonesSection';
import AboutSection from '@/components/AboutSection';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen modern-gradient-bg overflow-hidden">
      {/* Modern animated background */}
      <div className="absolute inset-0">
        <ModernBackground />
      </div>
      
      {/* NEW: Portfolio Hero */}
      <div className="relative z-10">
        <Hero />
      </div>
      
      {/* NEW: Ventures Overview */}
      <div className="relative z-10">
        <VenturesOverview />
      </div>
      
      {/* UGC Business Section - Featured Venture */}
      <section id="ugc-business" className="relative z-10 scroll-mt-20 section-padding px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-purple-300 font-bold text-sm sm:text-base">FEATURED VENTURE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 gradient-text">
              ItsCoreyE - UGC Creator
            </h2>
            <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
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
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-sm sm:max-w-2xl mt-8 mb-16 sm:mb-20"
            >
              <a 
                href="https://www.roblox.com/users/3504185/profile" 
                target="_blank" 
                className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center gap-2 group hover:scale-105 transition-transform whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
                <span>View ROBLOX Profile</span>
              </a>
              <a 
                href="https://www.tiktok.com/@itscoreye" 
                target="_blank" 
                className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center gap-2 group hover:scale-105 transition-transform whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <DevicePhoneMobileIcon className="w-5 h-5 flex-shrink-0" />
                <span>Follow on TikTok</span>
              </a>
              <a 
                href="https://discord.gg/nbQArRaq8m" 
                target="_blank" 
                className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center gap-2 group hover:scale-105 transition-transform whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 flex-shrink-0" />
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
      
      {/* NEW: About Section */}
      <div className="relative z-10">
        <AboutSection />
      </div>
      
      {/* Contact Section */}
      <div className="relative z-10">
        <Contact />
      </div>
    </main>
  );
}

// Modern Animated Background with subtle particles
function ModernBackground() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, delay: number}>>([]);

  useEffect(() => {
    // Generate particles only on client side
    const particleArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animation: 'particle-float 15s linear infinite'
          }}
        />
      ))}
    </div>
  );
}
