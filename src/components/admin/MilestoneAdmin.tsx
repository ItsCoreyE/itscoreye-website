'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

type TabCategory = 'verification' | 'revenue' | 'sales' | 'items' | 'collectibles';

export default function MilestoneAdmin() {
  const [milestonesData, setMilestonesData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabCategory>('verification');

  useEffect(() => {
    fetchMilestones();
  }, []);

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

  const handleMilestoneToggle = (milestoneId: string) => {
    if (!milestonesData) return;

    const updatedMilestones = milestonesData.milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          isCompleted: !milestone.isCompleted
        };
      }
      return milestone;
    });

    setMilestonesData({
      ...milestonesData,
      milestones: updatedMilestones
    });
  };

  const saveMilestones = async () => {
    if (!milestonesData) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestones: milestonesData.milestones })
      });

      if (response.ok) {
        setSuccessMessage('✅ Milestones saved successfully!');
        await fetchMilestones();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('❌ Failed to save milestones');
      }
    } catch (error) {
      console.error('Error saving milestones:', error);
      setError('❌ Failed to save milestones');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryData = (category: string) => {
    if (!milestonesData) return [];
    return milestonesData.milestones
      .filter(m => m.category === category)
      .sort((a, b) => a.target - b.target);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'verification': return '🎯';
      case 'revenue': return '💰';
      case 'sales': return '🛍️';
      case 'items': return '🎨';
      case 'collectibles': return '💎';
      default: return '⭐';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'verification': return 'Main Goal';
      case 'revenue': return 'Revenue';
      case 'sales': return 'Sales';
      case 'items': return 'Items';
      case 'collectibles': return 'Collectibles';
      default: return 'Milestones';
    }
  };

  const getCompletedCount = (category: string) => {
    const categoryMilestones = getCategoryData(category);
    return categoryMilestones.filter(m => m.isCompleted).length;
  };

  const getOverallProgress = () => {
    if (!milestonesData) return { completed: 0, total: 0, percentage: 0 };
    const completed = milestonesData.milestones.filter(m => m.isCompleted).length;
    const total = milestonesData.milestones.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-700/50 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-gray-700/50 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const tabs: TabCategory[] = ['verification', 'revenue', 'sales', 'items', 'collectibles'];
  const progress = getOverallProgress();

  return (
    <div className="glass-card p-6 sm:p-8">
      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-2">
            🏆 Milestone Manager
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {progress.completed} of {progress.total} completed ({progress.percentage}%)
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveMilestones}
          disabled={isSaving}
          className="modern-button px-6 py-3 font-bold disabled:opacity-50 w-full sm:w-auto"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
        </motion.button>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6"
          >
            <p className="text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-900/50 rounded-lg">
        {tabs.map((tab) => {
          const categoryData = getCategoryData(tab);
          const completed = categoryData.filter(m => m.isCompleted).length;
          const total = categoryData.length;
          const isActive = activeTab === tab;

          return (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 min-w-[100px] px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">{getCategoryIcon(tab)}</span>
                <span className="hidden sm:inline">{getCategoryTitle(tab)}</span>
                {tab !== 'verification' && (
                  <span className={`text-xs ${isActive ? 'text-amber-100' : 'text-gray-500'}`}>
                    {completed}/{total}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'verification' ? (
            /* Verification Tab */
            <div className="space-y-4">
              {milestonesData && (() => {
                const verificationMilestone = milestonesData.milestones.find(m => m.category === 'verification');
                if (!verificationMilestone) return null;
                
                return (
                  <div className={`p-6 sm:p-8 rounded-xl border-2 ${
                    verificationMilestone.isCompleted
                      ? 'bg-blue-500/10 border-blue-400'
                      : 'bg-gray-800/30 border-blue-500/30'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-5xl">🎯</div>
                        <div>
                          <div className="text-xs text-blue-400 font-bold mb-2 tracking-wide">
                            🏆 MAIN GOAL 🏆
                          </div>
                          <div className="text-2xl font-bold text-gray-100 mb-2">
                            {verificationMilestone.description}
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>💰 2,000,000 Robux revenue (90 days)</div>
                            <div>🛍️ 200,000 items sold</div>
                          </div>
                        </div>
                      </div>
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={verificationMilestone.isCompleted}
                          onChange={() => handleMilestoneToggle(verificationMilestone.id)}
                          className="sr-only"
                        />
                        <div className={`relative w-20 h-10 rounded-full transition-all duration-300 ${
                          verificationMilestone.isCompleted ? 'bg-blue-500' : 'bg-gray-600'
                        }`}>
                          <motion.div 
                            className="absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                            animate={{ x: verificationMilestone.isCompleted ? 40 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <span className="text-xs">
                              {verificationMilestone.isCompleted ? '✓' : '○'}
                            </span>
                          </motion.div>
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })()}
              
              <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm text-center">
                  <strong>Note:</strong> When you toggle this milestone and save, an @everyone notification will be sent to Discord #milestones channel!
                </p>
              </div>
            </div>
          ) : (
            /* Other Category Tabs */
            <div className="space-y-3">
              {getCategoryData(activeTab).map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all ${
                    milestone.isCompleted
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {/* Toggle Switch */}
                  <label className="flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={milestone.isCompleted}
                      onChange={() => handleMilestoneToggle(milestone.id)}
                      className="sr-only"
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      milestone.isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      <motion.div 
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: milestone.isCompleted ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </label>

                  {/* Milestone Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${
                      milestone.isCompleted ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {milestone.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Target: {milestone.target.toLocaleString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className={`hidden sm:block px-3 py-1 rounded-full text-xs font-bold ${
                    milestone.isCompleted 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {milestone.isCompleted ? '✓' : '○'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer with Last Updated */}
      {milestonesData && (
        <div className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}</span>
          </div>
          <span className="hidden sm:inline">Press Save to update live website</span>
        </div>
      )}
    </div>
  );
}
