'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveStats from '@/components/LiveStats';
import FeaturedItems from '@/components/FeaturedItems';
import Contact from '@/components/Contact';
import MilestonesSection from '@/components/MilestonesSection';

export default function Home() {
  return (
    <main className="relative min-h-screen modern-gradient-bg overflow-hidden">
      {/* Modern animated background */}
      <div className="absolute inset-0">
        <ModernBackground />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
            ItsCoreyE
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent w-16 sm:w-24"></div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light">
              UGC Creator
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent w-16 sm:w-24"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Crafting quality UGC items for your Roblox avatar
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <LiveStats />
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-sm sm:max-w-2xl mt-8 sm:mt-12"
        >
          <a 
            href="https://www.roblox.com/users/3504185/profile" 
            target="_blank" 
            className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center group hover:scale-105 transition-transform"
          >
            <span className="mr-2">🎮</span>
            View ROBLOX Profile
          </a>
          <a 
            href="https://www.tiktok.com/@itscoreye" 
            target="_blank" 
            className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center group hover:scale-105 transition-transform"
          >
            <span className="mr-2">📱</span>
            Follow on TikTok
          </a>
          <a 
            href="https://discord.gg/bkY6wTseTS" 
            target="_blank" 
            className="modern-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center group hover:scale-105 transition-transform"
          >
            <span className="mr-2">💬</span>
            Join Discord Server
          </a>
        </motion.div>
      </div>
      
      {/* Featured Items Section */}
      <FeaturedItems />
      
      {/* Milestones Section */}
      <MilestonesSection />
      
      {/* Contact Section */}
      <Contact />
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
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
