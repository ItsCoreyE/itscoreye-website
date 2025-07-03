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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-amber-100 mb-4 steampunk-font">
            ItsCoreyE
          </h1>
          <p className="text-2xl md:text-3xl text-amber-200 mb-8">
            UGC Creator
          </p>
        </motion.div>
        
        <LiveStats />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex gap-4"
        >
          <a href="https://www.roblox.com/users/3504185/profile" target="_blank" className="brass-button px-6 py-3 rounded-lg">
            View ROBLOX Profile
          </a>
          <a href="https://www.tiktok.com/@itscoreye" target="_blank" className="brass-button px-6 py-3 rounded-lg">
            Follow on TikTok
          </a>
        </motion.div>
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
      
      {/* Large prominent gear */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-40 h-40 opacity-30"
      >
        <GearSVG />
      </motion.div>
      
      {/* Medium gear */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 left-16 w-32 h-32 opacity-25"
      >
        <GearSVG />
      </motion.div>
      
      {/* Small gear */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/4 w-24 h-24 opacity-20"
      >
        <GearSVG />
      </motion.div>
      
      {/* Extra small decorative gear */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/3 w-16 h-16 opacity-15"
      >
        <GearSVG />
      </motion.div>
    </div>
  );
}

// Steam Particles Component
function SteamParticles() {
  return (
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/40 rounded-full"
          style={{
            left: `${20 + i * 10}%`,
            bottom: '10%',
          }}
          animate={{
            y: [-20, -300],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 1.5],
            x: [0, Math.sin(i) * 50]
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
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
