'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  PaintBrushIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

interface Milestone {
  id: string;
  category: 'revenue' | 'sales' | 'items' | 'collectibles' | 'verification';
  target: number;
  description: string;
  isCompleted: boolean;
  assetId?: string;
}

interface MilestonesData {
  milestones: Milestone[];
  lastUpdated: string;
}

export default function MilestonesSection() {
  const [milestonesData, setMilestonesData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { duration, delay, staggerDelay, enableHover, enableComplex } = usePerformanceMode();

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const [response] = await Promise.all([
          fetch('/api/milestones'),
          new Promise(resolve => setTimeout(resolve, 800))
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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getCategoryData = (category: string) => {
    if (!milestonesData) return { milestones: [], completed: 0, total: 0 };
    
    const categoryMilestones = milestonesData.milestones
      .filter(m => m.category === category)
      .sort((a, b) => a.target - b.target);
    const completed = categoryMilestones.filter(m => m.isCompleted).length;
    
    return {
      milestones: categoryMilestones,
      completed,
      total: categoryMilestones.length
    };
  };

  const getVerificationMilestone = () => {
    if (!milestonesData) return null;
    return milestonesData.milestones.find(m => m.category === 'verification');
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-8 h-8 sm:w-10 sm:h-10";
    switch (category) {
      case 'revenue': return <BanknotesIcon className={iconClass} />;
      case 'sales': return <ShoppingBagIcon className={iconClass} />;
      case 'items': return <PaintBrushIcon className={iconClass} />;
      case 'collectibles': return <SparklesIcon className={iconClass} />;
      default: return <SparklesIcon className={iconClass} />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'revenue': return 'Revenue Milestones';
      case 'sales': return 'Sales Milestones';
      case 'items': return 'Item Release Milestones';
      case 'collectibles': return 'Collectible Goals';
      default: return 'Milestones';
    }
  };

  const getCategorySubtitle = (category: string) => {
    switch (category) {
      case 'revenue': return 'Earned Robux - Financial growth and credibility';
      case 'sales': return 'Units Sold - Popularity and demand for items';
      case 'items': return 'Creative output and consistency';
      case 'collectibles': return 'Personal Roblox limited collection targets';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen modern-gradient-bg section-padding">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 gradient-text">
              Achievement Milestones
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero skeleton */}
            <div className="glass-card p-8 rounded-xl animate-pulse">
              <div className="h-32 bg-gray-700/50 rounded"></div>
            </div>
            
            {/* Category skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                <div className="h-20 bg-gray-700/50 rounded"></div>
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
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="glass-card p-8 rounded-xl text-center max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mb-4 mx-auto" />
            <p className="text-gray-300 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const verificationMilestone = getVerificationMilestone();
  const categories = ['revenue', 'sales', 'items', 'collectibles'];

  return (
    <section className="modern-gradient-bg section-padding">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 gradient-text">
            Achievement Milestones
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Track my verified progress and achievements in the UGC marketplace. 
            All milestones are manually verified for complete transparency.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Verification Milestone Hero Section */}
          {verificationMilestone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration, delay }}
              className={`relative overflow-hidden rounded-2xl border-2 ${
                verificationMilestone.isCompleted 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10' 
                  : 'border-blue-500/30 bg-gradient-to-br from-gray-800/50 via-blue-900/20 to-gray-800/50'
              }`}
            >
              {/* Animated background effect - only on desktop */}
              {enableComplex && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent shimmer-effect"></div>
              )}
              
              <div className="relative p-6 sm:p-8 md:p-10">
                {/* Badge */}
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <motion.svg 
                      animate={enableComplex ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-6 h-6 text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </motion.svg>
                    <span className="text-blue-300 font-bold text-sm sm:text-base">MAIN GOAL</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
                  <span className={`${verificationMilestone.isCompleted ? 'text-blue-400' : 'text-gray-100'}`}>
                    Roblox Verified Creator
                  </span>
                  {verificationMilestone.isCompleted && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: delay * 1.5 }}
                      className="ml-3 text-blue-400"
                    >
                      ✓
                    </motion.span>
                  )}
                </h3>

                {/* Requirements */}
                <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-700/50">
                  <p className="text-gray-300 text-center mb-4 font-semibold">Requirements for Verification:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
                      <BanknotesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-gray-400">Revenue (90 days)</div>
                        <div className="text-sm sm:text-lg font-bold text-amber-400">2,000,000 Robux</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
                      <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-gray-400">Items Sold</div>
                        <div className="text-sm sm:text-lg font-bold text-green-400">200,000 Sales</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  {verificationMilestone.isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: delay * 2 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border-2 border-blue-400"
                    >
                      <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" opacity="0.5"/>
                        <path d="M12 12L2 7L12 2L22 7L12 12Z"/>
                        <path d="M12 12V22"/>
                        <path d="M2 7V17"/>
                        <path d="M22 7V17"/>
                      </svg>
                      <span className="text-xl font-bold text-blue-300">VERIFIED CREATOR!</span>
                      <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" opacity="0.5"/>
                        <path d="M12 12L2 7L12 2L22 7L12 12Z"/>
                        <path d="M12 12V22"/>
                        <path d="M2 7V17"/>
                        <path d="M22 7V17"/>
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-700/50 border border-gray-600">
                      <ClockIcon className="w-6 h-6 text-gray-300" />
                      <span className="text-lg font-semibold text-gray-300">In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Milestones - Collapsible */}
          <div className="space-y-4">
            {categories.map((category, index) => {
              const data = getCategoryData(category);
              const isExpanded = expandedCategories.has(category);
              const progressPercentage = data.total > 0 ? (data.completed / data.total) * 100 : 0;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration * 0.625, delay: (delay * 2) + index * staggerDelay }}
                  className="glass-card rounded-xl overflow-hidden"
                  style={{ willChange: 'transform' }}
                >
                  {/* Category Header - Clickable */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        whileHover={enableHover ? { scale: 1.1, rotate: 5 } : undefined}
                        className="text-3xl sm:text-4xl"
                        style={{ willChange: 'transform' }}
                      >
                        {getCategoryIcon(category)}
                      </motion.div>
                      
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-100 mb-1 truncate">
                          {getCategoryTitle(category)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">
                          {getCategorySubtitle(category)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Progress Badge */}
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-amber-400">
                            {data.completed}/{data.total}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(progressPercentage)}% Complete
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-400"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </button>

                  {/* Progress Bar */}
                  <div className="px-6 pb-4">
                    <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration, delay: (delay * 2.5) + index * staggerDelay }}
                        style={{ willChange: 'width' }}
                      />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: duration * 0.375 }}
                        className="overflow-hidden"
                        style={{ willChange: 'height, opacity' }}
                      >
                        <div className="p-6 pt-0 space-y-2">
                          {data.milestones.map((milestone, milestoneIndex) => (
                            <motion.div
                              key={milestone.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: milestoneIndex * 0.05
                              }}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                milestone.isCompleted
                                  ? 'bg-green-500/10 border-green-500/30'
                                  : 'bg-gray-800/30 border-gray-700/50'
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {milestone.isCompleted ? (
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">✓</span>
                                  </div>
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
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {milestonesData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration, delay: delay * 4 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 text-gray-300 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">
                Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300 text-xs mt-2">
              All milestones are manually verified for transparency and credibility
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
