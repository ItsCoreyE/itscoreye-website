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
      <section className="min-h-screen modern-gradient-bg section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
              Achievement Milestones
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
              Track my verified progress and achievements in the UGC marketplace. 
              All milestones are manually verified for complete transparency.
            </p>
          </motion.div>

          {/* Loading skeleton grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {['revenue', 'sales', 'items'].map((category, index) => (
              <div key={category} className="glass-card p-6 sm:p-8 rounded-xl">
                {/* Category header skeleton */}
                <div className="text-center mb-6">
                  <div className="text-4xl sm:text-5xl mb-3 animate-pulse">
                    {index === 0 ? '💰' : index === 1 ? '🛍️' : '🎨'}
                  </div>
                  <div className="h-8 bg-gray-700/50 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700/30 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>

                {/* Progress bar skeleton */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-5 bg-gray-700/50 rounded w-16 animate-pulse"></div>
                    <div className="h-5 bg-gray-700/30 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-amber-500/20 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                  <div className="text-center mt-2">
                    <div className="h-6 bg-amber-500/20 rounded w-24 mx-auto animate-pulse"></div>
                  </div>
                </div>

                {/* Milestones list skeleton */}
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, milestoneIndex) => (
                    <div
                      key={milestoneIndex}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 border-2 border-gray-700 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-gray-700/50 rounded mb-1 animate-pulse"></div>
                      </div>
                    </div>
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
      <section className="modern-gradient-bg section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-xl text-center max-w-2xl mx-auto">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-gray-300 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="modern-gradient-bg section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
            Achievement Milestones
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
            Track my verified progress and achievements in the UGC marketplace. 
            All milestones are manually verified for complete transparency.
          </p>
        </motion.div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {['revenue', 'sales', 'items'].map((category, index) => {
            const categoryData = getCategoryData(category);
            const progressPercentage = categoryData.total > 0 
              ? (categoryData.completed / categoryData.total) * 100 
              : 0;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card hover-lift p-6 sm:p-8 rounded-xl group"
              >
                {/* Category Header */}
                <div className="text-center mb-6">
                  <motion.div 
                    className="text-4xl sm:text-5xl mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getCategoryIcon(category)}
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
                    {getCategoryTitle(category)}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {getCategorySubtitle(category)}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-semibold">Progress</span>
                    <span className="text-amber-400 font-bold">
                      {categoryData.completed}/{categoryData.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer-effect"></div>
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
                  {categoryData.milestones.map((milestone, milestoneIndex) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: milestoneIndex * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        milestone.isCompleted
                          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                          : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {milestone.isCompleted ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          >
                            ✓
                          </motion.div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          milestone.isCompleted ? 'text-green-400' : 'text-gray-300'
                        }`}>
                          {milestone.description}
                        </p>
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
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 text-xs mt-2">
              All milestones are manually verified for transparency and credibility
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
