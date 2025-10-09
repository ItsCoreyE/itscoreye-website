'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function MilestoneAdmin() {
  const [milestonesData, setMilestonesData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setSuccessMessage('✅ Milestones updated successfully! Changes are now live on your website.');
        // Refresh data to get updated timestamp
        await fetchMilestones();
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
      .sort((a, b) => a.target - b.target); // Sort by target value ascending
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return '💰';
      case 'sales': return '🛍️';
      case 'items': return '🎨';
      case 'collectibles': return '💎';
      default: return '⭐';
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

  const getCompletedCount = (category: string) => {
    const categoryMilestones = getCategoryData(category);
    return categoryMilestones.filter(m => m.isCompleted).length;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8">
        <h3 className="text-3xl font-bold text-gray-100 mb-6 flex items-center">
          🏆 Milestone Management
        </h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-800/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-gray-100 flex items-center">
          🏆 Milestone Management
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveMilestones}
          disabled={isSaving}
          className="modern-button px-6 py-3 text-base font-bold disabled:opacity-50"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
        </motion.button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6"
        >
          <p className="text-green-400">{successMessage}</p>
        </motion.div>
      )}

      {/* Verification Milestone First */}
      {milestonesData && (() => {
        const verificationMilestone = milestonesData.milestones.find(m => m.category === 'verification');
        if (!verificationMilestone) return null;
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-6 rounded-xl border-2 ${
              verificationMilestone.isCompleted
                ? 'bg-blue-500/10 border-blue-400'
                : 'bg-gray-800/30 border-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">🎯</div>
                <div>
                  <div className="text-sm text-blue-400 font-semibold mb-1">MAIN GOAL</div>
                  <div className="text-xl font-bold text-gray-100">{verificationMilestone.description}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    Requirements: 2M Robux (90 days) + 200K Sales
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
                <div className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  verificationMilestone.isCompleted ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  <motion.div 
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: verificationMilestone.isCompleted ? 30 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </label>
            </div>
          </motion.div>
        );
      })()}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['revenue', 'sales', 'items', 'collectibles'].map((category, index) => {
          const completed = getCompletedCount(category);
          const total = getCategoryData(category).length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <motion.div 
              key={category} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="stats-card text-center"
            >
              <motion.div 
                className="text-3xl mb-3"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getCategoryIcon(category)}
              </motion.div>
              <div className="text-gray-400 font-semibold text-sm mb-2">
                {getCategoryTitle(category)}
              </div>
              <div className="text-2xl font-bold gradient-text mb-1">
                {completed}/{total}
              </div>
              <div className="text-amber-400 font-bold text-lg">
                {percentage}% Complete
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Milestone Categories */}
      <div className="space-y-8">
        {['revenue', 'sales', 'items', 'collectibles'].map((category, categoryIndex) => (
          <motion.div 
            key={category} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="glass-card p-6"
          >
            <h4 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-3">
              <span className="text-3xl">{getCategoryIcon(category)}</span>
              {getCategoryTitle(category)}
            </h4>
            
            <div className="space-y-3">
              {getCategoryData(category).map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    milestone.isCompleted
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                  }`}
                >
                  {/* Modern Toggle Switch */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={milestone.isCompleted}
                      onChange={() => handleMilestoneToggle(milestone.id)}
                      className="sr-only"
                    />
                    <div className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                      milestone.isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      <motion.div 
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: milestone.isCompleted ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                  </label>

                  {/* Milestone Info */}
                  <div className="flex-1">
                    <p className={`font-medium text-lg ${
                      milestone.isCompleted ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {milestone.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: {milestone.target.toLocaleString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    milestone.isCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'
                  }`}>
                    {milestone.isCompleted ? 'Completed' : 'Pending'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50"
      >
        <h5 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
          <span className="text-xl">📋</span> Instructions
        </h5>
        <ul className="text-gray-400 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Toggle milestones on/off as you achieve them</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Click &quot;Save Changes&quot; to update your live website</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>All changes are immediately visible to visitors</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Milestones are displayed in order by target value</span>
          </li>
        </ul>
      </motion.div>

      {milestonesData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
