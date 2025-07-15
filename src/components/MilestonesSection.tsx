'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  category: 'revenue' | 'sales' | 'items';
  target: number;
  description: string;
  isCompleted: boolean;
  completedDate?: string;
}

interface MilestonesData {
  milestones: Milestone[];
  lastUpdated: string;
}

export default function MilestonesSection() {
  const [milestonesData, setMilestonesData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/api/milestones');
        if (response.ok) {
          const data = await response.json();
          setMilestonesData(data);
          setError(null);
        } else {
          setError('Failed to load milestones');
        }
      } catch (error) {
        console.error('Error fetching milestones:', error);
        setError('Failed to load milestones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const getCategoryData = (category: string) => {
    if (!milestonesData) return { milestones: [], completed: 0, total: 0 };
    
    const categoryMilestones = milestonesData.milestones.filter(m => m.category === category);
    const completed = categoryMilestones.filter(m => m.isCompleted).length;
    
    return {
      milestones: categoryMilestones,
      completed,
      total: categoryMilestones.length
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return '💰';
      case 'sales': return '🛍️';
      case 'items': return '🎨';
      default: return '⭐';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'revenue': return 'Revenue Milestones';
      case 'sales': return 'Sales Milestones';
      case 'items': return 'Item Release Milestones';
      default: return 'Milestones';
    }
  };

  const getCategorySubtitle = (category: string) => {
    switch (category) {
      case 'revenue': return 'Earned Robux - Financial growth and credibility';
      case 'sales': return 'Units Sold - Popularity and demand for items';
      case 'items': return 'Creative output and consistency';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-amber-300/20 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-amber-200/20 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-card enhanced-glass deep-shadow rounded-xl p-6 animate-pulse">
                <div className="h-8 bg-amber-300/20 rounded mb-4"></div>
                <div className="h-4 bg-amber-200/20 rounded mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-12 bg-amber-100/10 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="premium-card enhanced-glass deep-shadow rounded-xl p-8">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-amber-200 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-32 h-32 opacity-10"
        >
          <GearSVG />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 w-24 h-24 opacity-8"
        >
          <GearSVG />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight text-amber-100">
            Achievement Milestones
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20 sm:w-32"></div>
            <span className="text-3xl sm:text-4xl">🏆</span>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20 sm:w-32"></div>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-amber-300/90 max-w-3xl mx-auto px-4 leading-relaxed">
            Track my verified progress and achievements in the UGC marketplace. 
            All milestones are manually verified for complete transparency.
          </p>
        </motion.div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {['revenue', 'sales', 'items'].map((category, categoryIndex) => {
            const categoryData = getCategoryData(category);
            const progressPercentage = (categoryData.completed / categoryData.total) * 100;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
                className="premium-card enhanced-glass deep-shadow hover-lift glow-border rounded-xl p-6 sm:p-8"
              >
                {/* Category Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl mb-3">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
                    {getCategoryTitle(category)}
                  </h3>
                  <p className="text-sm sm:text-base text-amber-300/80 leading-relaxed">
                    {getCategorySubtitle(category)}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-amber-200 font-semibold">Progress</span>
                    <span className="text-amber-300 font-bold">
                      {categoryData.completed}/{categoryData.total}
                    </span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-3 overflow-hidden border border-amber-600/30">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.5, delay: categoryIndex * 0.3 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-amber-400 font-bold text-lg">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  {categoryData.milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (categoryIndex * 0.2) + (index * 0.1) }}
                      viewport={{ once: true }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        milestone.isCompleted
                          ? 'bg-green-900/20 border-green-600/40 hover:bg-green-900/30'
                          : 'bg-amber-900/10 border-amber-600/20 hover:bg-amber-900/20'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {milestone.isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", delay: (categoryIndex * 0.2) + (index * 0.1) + 0.3 }}
                            viewport={{ once: true }}
                            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          >
                            ✓
                          </motion.div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-amber-600/40 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          milestone.isCompleted ? 'text-green-300' : 'text-amber-200'
                        }`}>
                          {milestone.description}
                        </p>
                        {milestone.isCompleted && milestone.completedDate && (
                          <p className="text-xs text-green-400/80 mt-1">
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        {milestonesData && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
              </span>
            </div>
            <p className="text-amber-300/60 text-xs mt-2">
              All milestones are manually verified for transparency and credibility
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Gear SVG Component
function GearSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current drop-shadow-lg">
      <defs>
        <radialGradient id="milestoneGearGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DAA520" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#8B4513" />
        </radialGradient>
      </defs>
      <path 
        d="M50,15 L58,8 L66,15 L74,8 L82,15 L85,25 L78,32 L85,40 L85,50 L85,60 L78,68 L85,75 L82,85 L74,92 L66,85 L58,92 L50,85 L42,92 L34,85 L26,92 L18,85 L15,75 L22,68 L15,60 L15,50 L15,40 L22,32 L15,25 L18,15 L26,8 L34,15 L42,8 Z" 
        fill="url(#milestoneGearGradient)"
        stroke="#654321"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="15" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      <circle cx="50" cy="50" r="8" fill="#CD7F32"/>
    </svg>
  );
}
