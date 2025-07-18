'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  category: 'revenue' | 'sales' | 'items';
  target: number;
  description: string;
  isCompleted: boolean;
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
        // Add minimum loading duration to ensure loading state is visible
        const [response] = await Promise.all([
          fetch('/api/milestones'),
          new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms loading
        ]);
        
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
    
    const categoryMilestones = milestonesData.milestones
      .filter(m => m.category === category)
      .sort((a, b) => a.target - b.target); // Sort by target value ascending
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
      <section className="min-h-screen rich-gradient py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
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
          </div>

          {/* Loading skeleton grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {['revenue', 'sales', 'items'].map((category, index) => (
              <div key={category} className="relative">
                <div className="relative premium-card enhanced-glass deep-shadow rounded-xl p-6 sm:p-8">
                  {/* Decorative corner accents */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-amber-400/40"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-amber-400/40"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-amber-400/40"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-amber-400/40"></div>

                  {/* Category header skeleton */}
                  <div className="text-center mb-6">
                    <div className="text-4xl sm:text-5xl mb-3 animate-pulse">
                      {index === 0 ? '💰' : index === 1 ? '🛍️' : '🎨'}
                    </div>
                    <div className="h-8 bg-amber-100/20 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-amber-300/20 rounded w-3/4 mx-auto animate-pulse"></div>
                  </div>

                  {/* Progress bar skeleton */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-5 bg-amber-200/20 rounded w-16 animate-pulse"></div>
                      <div className="h-5 bg-amber-300/20 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="w-full bg-amber-900/30 rounded-full h-3 overflow-hidden border border-amber-600/30">
                      <div className="h-full bg-amber-400/20 rounded-full w-1/2 animate-pulse"></div>
                    </div>
                    <div className="text-center mt-2">
                      <div className="h-6 bg-amber-400/20 rounded w-24 mx-auto animate-pulse"></div>
                    </div>
                  </div>

                  {/* Milestones list skeleton */}
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, milestoneIndex) => (
                      <div
                        key={milestoneIndex}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-amber-900/10 border-amber-600/20"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 border-2 border-amber-600/40 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="h-5 bg-amber-200/20 rounded mb-1 animate-pulse"></div>
                          {milestoneIndex % 2 === 0 && (
                            <div className="h-3 bg-green-400/20 rounded w-1/2 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer skeleton */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="h-4 bg-amber-400/20 rounded w-32 animate-pulse"></div>
            </div>
            <div className="h-3 bg-amber-300/20 rounded w-48 mx-auto animate-pulse"></div>
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
        <div className="text-center mb-12 sm:mb-16">
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
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {['revenue', 'sales', 'items'].map((category) => {
            const categoryData = getCategoryData(category);
            const progressPercentage = (categoryData.completed / categoryData.total) * 100;

            return (
              <div
                key={category}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group premium-card enhanced-glass deep-shadow hover-lift rounded-xl p-6 sm:p-8"
                >
                {/* Decorative corner accents */}
                <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
                <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
                <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
                
                {/* Content Container */}
                <div className="relative z-10">
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
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-amber-400 font-bold text-lg">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="space-y-3">
                  {categoryData.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        milestone.isCompleted
                          ? 'bg-green-900/20 border-green-600/40 hover:bg-green-900/30'
                          : 'bg-amber-900/10 border-amber-600/20 hover:bg-amber-900/20'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {milestone.isCompleted ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            ✓
                          </div>
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
                      </div>
                    </div>
                  ))}
                </div>
                </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {milestonesData && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-amber-400 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
              </span>
            </div>
            <p className="text-amber-300/60 text-xs mt-2">
              All milestones are manually verified for transparency and credibility
            </p>
          </div>
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
