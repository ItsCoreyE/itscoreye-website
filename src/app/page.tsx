'use client';
import { motion } from 'framer-motion';
import LiveStats from '@/components/LiveStats';
import FeaturedItems from '@/components/FeaturedItems';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-amber-800 overflow-hidden">
      {/* Animated gears background */}
      <div className="absolute inset-0">
        <AnimatedGears />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 sm:mb-6 steampunk-font leading-none"
            data-text="ItsCoreyE"
          >
            ItsCoreyE
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 sm:w-24"></div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl steampunk-subtitle whitespace-nowrap">
              UGC Creator
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16 sm:w-24"></div>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-amber-300/80 max-w-2xl mx-auto leading-relaxed">
            Crafting extraordinary virtual experiences through innovative design and meticulous attention to detail
          </p>
        </div>
        
        <div>
          <LiveStats />
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-sm sm:max-w-lg mt-8 sm:mt-12">
          <a 
            href="https://www.roblox.com/users/3504185/profile" 
            target="_blank" 
            className="brass-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center group hover:scale-105 transition-transform"
          >
            <span className="mr-2">🎮</span>
            View ROBLOX Profile
          </a>
          <a 
            href="https://www.tiktok.com/@itscoreye" 
            target="_blank" 
            className="brass-button px-6 sm:px-8 py-4 text-sm sm:text-base font-medium min-h-[52px] flex items-center justify-center group hover:scale-105 transition-transform"
          >
            <span className="mr-2">📱</span>
            Follow on TikTok
          </a>
        </div>
      </div>
      
      {/* Featured Items Section */}
      <FeaturedItems />
    </main>
  );
}


// Enhanced Animated Gears with Steam Particles
function AnimatedGears() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Steam Particles */}
      <SteamParticles />
      
      {/* Large prominent gear - hidden on mobile, smaller on tablet */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute top-20 right-20 w-24 md:w-32 lg:w-40 h-24 md:h-32 lg:h-40 opacity-20 md:opacity-30"
      >
        <GearSVG />
      </motion.div>
      
      {/* Medium gear - repositioned for mobile */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 sm:bottom-32 left-4 sm:left-16 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 opacity-15 sm:opacity-20 md:opacity-25"
      >
        <GearSVG />
      </motion.div>
      
      {/* Small gear - repositioned and resized for mobile */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 sm:top-1/2 left-1/6 sm:left-1/4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 opacity-10 sm:opacity-15 md:opacity-20"
      >
        <GearSVG />
      </motion.div>
      
      {/* Extra small decorative gear - hidden on small mobile */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="hidden sm:block absolute top-1/4 md:top-1/3 right-1/4 md:right-1/3 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 opacity-10 sm:opacity-12 md:opacity-15"
      >
        <GearSVG />
      </motion.div>
    </div>
  );
}

// Steam Particles Component
function SteamParticles() {
  // Reduce particle count on mobile for better performance
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 4 : 8;
  
  return (
    <div className="absolute inset-0">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 sm:bg-white/40 rounded-full"
          style={{
            left: `${20 + i * (60 / particleCount)}%`,
            bottom: '10%',
          }}
          animate={{
            y: [-20, -200, -300],
            opacity: [0, 0.6, 0.8, 0],
            scale: [0.5, 1, 1.2, 1.5],
            x: [0, Math.sin(i) * 30, Math.sin(i) * 50]
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

// Enhanced Gear SVG
function GearSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current drop-shadow-lg">
      <defs>
        <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DAA520" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#8B4513" />
        </radialGradient>
      </defs>
      <path 
        d="M50,15 L58,8 L66,15 L74,8 L82,15 L85,25 L78,32 L85,40 L85,50 L85,60 L78,68 L85,75 L82,85 L74,92 L66,85 L58,92 L50,85 L42,92 L34,85 L26,92 L18,85 L15,75 L22,68 L15,60 L15,50 L15,40 L22,32 L15,25 L18,15 L26,8 L34,15 L42,8 Z" 
        fill="url(#gearGradient)"
        stroke="#654321"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="15" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      <circle cx="50" cy="50" r="8" fill="#CD7F32"/>
    </svg>
  );
}
