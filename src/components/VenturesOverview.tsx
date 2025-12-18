'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, TrophyIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface SalesData {
  totalRevenue: number;
  totalSales: number;
}

export default function VenturesOverview() {
  const [statsData, setStatsData] = useState<SalesData | null>(null);

  useEffect(() => {
    // Fetch live stats for ItsCoreyE card
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
      iconBorder: 'border-purple-500/30',
      name: 'ItsCoreyE',
      subtitle: 'Roblox UGC Creator',
      description: 'Quality UGC items for Roblox avatars',
      stats: statsData ? [
        { label: 'Revenue', value: statsData.totalRevenue.toLocaleString(), color: 'text-purple-400' },
        { label: 'Sales', value: statsData.totalSales.toLocaleString(), color: 'text-cyan-400' }
      ] : null,
      gradient: 'from-purple-600/20 to-purple-500/10',
      borderGradient: 'from-purple-500 via-pink-500 to-purple-500',
      link: '#ugc-business',
      isInternal: true
    },
    {
      id: 'oddsup',
      Icon: TrophyIcon,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      iconBorder: 'border-cyan-500/30',
      name: 'Odds Up',
      subtitle: 'Prize Competition Platform',
      description: 'Fair competitions with realistic odds',
      stats: [
        { label: 'Status', value: 'Active', color: 'text-green-400' },
        { label: 'Founded', value: 'Dec 2025', color: 'text-cyan-400' }
      ],
      gradient: 'from-cyan-600/20 to-cyan-500/10',
      borderGradient: 'from-cyan-500 via-blue-500 to-cyan-500',
      link: 'https://www.oddsup.co.uk',
      isInternal: false
    },
    {
      id: 'fixmyrig',
      Icon: ComputerDesktopIcon,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10',
      iconBorder: 'border-pink-500/30',
      name: 'Fix My Rig',
      subtitle: 'Remote IT Support',
      description: 'Expert tech assistance from anywhere',
      stats: [
        { label: 'Status', value: 'Active', color: 'text-green-400' },
        { label: 'Founded', value: 'Feb 2025', color: 'text-pink-400' }
      ],
      gradient: 'from-coral-600/20 to-orange-500/10',
      borderGradient: 'from-pink-500 via-orange-500 to-pink-500',
      link: 'https://www.fixmyrig.co.uk',
      isInternal: false
    }
  ];

  return (
    <section className="section-padding px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 gradient-text">
            My Ventures
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
            Three businesses focused on transparency, quality, and customer satisfaction
          </p>
        </motion.div>

        {/* Venture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ventures.map((venture, index) => (
            <motion.a
              key={venture.id}
              href={venture.link}
              target={venture.isInternal ? undefined : '_blank'}
              rel={venture.isInternal ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 p-[2px]"
            >
              {/* Gradient border using background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${venture.borderGradient} rounded-2xl`}></div>
              
              {/* Animated glow effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${venture.borderGradient} blur-xl -z-10`}></div>
              
              <div className={`relative p-6 sm:p-8 bg-gradient-to-br ${venture.gradient} backdrop-blur-sm h-full flex flex-col rounded-2xl`}>
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl ${venture.iconBg} border ${venture.iconBorder} mb-6 inline-flex items-center justify-center w-20 h-20 group-hover:shadow-lg transition-shadow`}
                >
                  <venture.Icon className={`w-12 h-12 ${venture.iconColor}`} />
                </motion.div>

                {/* Name & Subtitle */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
                  {venture.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-200 mb-4">
                  {venture.subtitle}
                </p>
                <p className="text-sm text-gray-300 mb-6 flex-grow">
                  {venture.description}
                </p>

                {/* Stats */}
                {venture.stats ? (
                  <div className="space-y-3 mb-4">
                    {venture.stats.map((stat, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{stat.label}</span>
                        <span className={`text-lg font-bold ${stat.color}`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    <div className="h-6 bg-gray-800/50 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-800/50 rounded animate-pulse"></div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-cyan-400 transition-colors pt-4 border-t border-gray-800">
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
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
