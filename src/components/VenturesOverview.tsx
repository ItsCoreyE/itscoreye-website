'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, TrophyIcon, ComputerDesktopIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

interface SalesData {
  totalRevenue: number;
  totalSales: number;
}

export default function VenturesOverview() {
  const [statsData, setStatsData] = useState<SalesData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const ventures = [
    {
      id: 'itscoreye',
      Icon: RocketLaunchIcon,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      name: 'ItsCoreyE',
      subtitle: 'Roblox UGC Creator',
      description: 'Quality UGC items for Roblox avatars with a focus on unique designs',
      stats: statsData ? [
        { label: 'Revenue', value: `${statsData.totalRevenue.toLocaleString()}`, color: 'text-purple-400' },
        { label: 'Sales', value: statsData.totalSales.toLocaleString(), color: 'text-cyan-400' }
      ] : null,
      accentColor: 'purple',
      link: '#ugc-business',
      isInternal: true
    },
    {
      id: 'oddsup',
      Icon: TrophyIcon,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      name: 'Odds Up',
      subtitle: 'Prize Competition Platform',
      description: 'Fair competitions with realistic odds and transparent prizes',
      stats: [
        { label: 'Status', value: 'Coming Soon', color: 'text-amber-400' },
        { label: 'Founded', value: 'Dec 2025', color: 'text-cyan-400' }
      ],
      accentColor: 'cyan',
      link: 'https://www.oddsup.co.uk',
      isInternal: false
    },
    {
      id: 'fixmyrig',
      Icon: ComputerDesktopIcon,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10',
      name: 'Fix My Rig',
      subtitle: 'Remote IT Support',
      description: 'Expert tech assistance from anywhere in the world',
      stats: [
        { label: 'Status', value: 'Coming Soon', color: 'text-amber-400' },
        { label: 'Founded', value: 'Feb 2025', color: 'text-pink-400' }
      ],
      accentColor: 'pink',
      link: 'https://www.fixmyrig.co.uk',
      isInternal: false
    },
    {
      id: 'clicktheotter',
      Icon: CursorArrowRaysIcon,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      name: 'Click The Otter',
      subtitle: 'Idle Clicker Game',
      description: 'Free browser-based idle clicker game. Click the otter, earn fish, unlock achievements and prestige for endless progression',
      stats: [
        { label: 'Status', value: 'Live', color: 'text-green-400' },
        { label: 'Founded', value: 'Feb 2026', color: 'text-emerald-400' }
      ],
      accentColor: 'emerald',
      link: 'https://clicktheotter.com',
      isInternal: false
    }
  ];

  return (
    <section id="ventures" className="section-padding px-5 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
            My Ventures
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Four ventures focused on transparency, quality, and customer satisfaction
          </p>
        </motion.div>

        {/* Venture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {ventures.map((venture, index) => (
            <motion.a
              key={venture.id}
              href={venture.link}
              target={venture.isInternal ? undefined : '_blank'}
              rel={venture.isInternal ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="professional-card p-5 sm:p-6 md:p-7 cursor-pointer group flex flex-col"
            >
              {/* Icon */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${venture.iconBg} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-105 transition-transform`}>
                <venture.Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${venture.iconColor}`} />
              </div>

              {/* Name & Subtitle */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">
                {venture.name}
              </h3>
              <p className="text-sm text-gray-400 mb-2 sm:mb-3">
                {venture.subtitle}
              </p>
              <p className="text-sm text-gray-500 mb-4 sm:mb-5 flex-grow leading-relaxed">
                {venture.description}
              </p>

              {/* Stats */}
              {venture.stats ? (
                <div className="space-y-2.5 mb-5">
                  {venture.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{stat.label}</span>
                      <span className={`text-base font-semibold ${stat.color}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 mb-5">
                  <div className="h-5 bg-gray-800/50 rounded animate-pulse"></div>
                  <div className="h-5 bg-gray-800/50 rounded animate-pulse"></div>
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                <span>{venture.isInternal ? 'View Details' : 'Visit Site'}</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
