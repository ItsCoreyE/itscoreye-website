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
    return milestonesData.milestones.filter(m => m.category === category);
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

  const getCompletedCount = (category: string) => {
    const categoryMilestones = getCategoryData(category);
    return categoryMilestones.filter(m => m.isCompleted).length;
  };

  if (isLoading) {
    return (
      <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-amber-200 mb-4 flex items-center">
          🏆 Milestone Management
        </h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-amber-800/30 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-900/30 border border-amber-600 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-amber-200 flex items-center">
          🏆 Milestone Management
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveMilestones}
          disabled={isSaving}
          className="brass-button px-6 py-3 text-sm font-bold disabled:opacity-50"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save Changes'}
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6">
          <p className="text-green-300">{successMessage}</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {['revenue', 'sales', 'items'].map(category => {
          const completed = getCompletedCount(category);
          const total = getCategoryData(category).length;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={category} className="bg-amber-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{getCategoryIcon(category)}</div>
              <div className="text-amber-200 font-semibold text-sm mb-1">
                {getCategoryTitle(category)}
              </div>
              <div className="text-amber-100 font-bold">
                {completed}/{total} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Categories */}
      <div className="space-y-8">
        {['revenue', 'sales', 'items'].map(category => (
          <div key={category} className="bg-amber-800/20 rounded-lg p-6">
            <h4 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(category)}</span>
              {getCategoryTitle(category)}
            </h4>
            
            <div className="space-y-3">
              {getCategoryData(category).map(milestone => (
                <div
                  key={milestone.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    milestone.isCompleted
                      ? 'bg-green-900/20 border-green-600/40'
                      : 'bg-amber-900/20 border-amber-600/30'
                  }`}
                >
                  {/* Toggle Switch */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={milestone.isCompleted}
                      onChange={() => handleMilestoneToggle(milestone.id)}
                      className="sr-only"
                    />
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${
                      milestone.isCompleted ? 'bg-green-600' : 'bg-amber-700'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        milestone.isCompleted ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </label>

                  {/* Milestone Info */}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      milestone.isCompleted ? 'text-green-300' : 'text-amber-200'
                    }`}>
                      {milestone.description}
                    </p>
                    <p className="text-xs text-amber-400">
                      Target: {milestone.target.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-amber-800/20 rounded-lg border border-amber-700">
        <h5 className="text-amber-200 font-semibold mb-2">📋 Instructions:</h5>
        <ul className="text-amber-300 text-sm space-y-1">
          <li>• Toggle milestones on/off as you achieve them</li>
          <li>• Click &quot;Save Changes&quot; to update your live website</li>
          <li>• All changes are immediately visible to visitors</li>
        </ul>
      </div>

      {milestonesData && (
        <div className="mt-6 text-center">
          <p className="text-amber-400 text-sm">
            Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </motion.div>
  );
}
