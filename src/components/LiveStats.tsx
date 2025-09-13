'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SalesData {
  totalRevenue: number;
  totalSales: number;
  growthPercentage: number;
  lastUpdated: string;
  dataPeriod?: string;
  topItems: Array<{
    name: string;
    sales: number;
    revenue: number;
    price: number;
    assetId?: string;
    assetType?: string;
    thumbnail?: string;
  }>;
}

export default function LiveStats() {
  const [statsData, setStatsData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
          setError(null);
        } else {
          console.error('Failed to fetch data from API:', response.status);
          setError('Failed to load data');
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval to check for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="glass-card subtle-glow rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
        {/* Data Period Header Skeleton */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-900/20 px-4 py-2 rounded-full h-8 w-32 mx-auto animate-pulse"></div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="stats-card">
            <div className="h-12 sm:h-16 bg-amber-500/10 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded mb-2 animate-pulse w-24 mx-auto"></div>
            <div className="h-6 bg-green-500/10 rounded-full w-20 mx-auto animate-pulse mt-2"></div>
          </div>
          
          <div className="stats-card">
            <div className="h-12 sm:h-16 bg-amber-500/10 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded mb-2 animate-pulse w-20 mx-auto"></div>
            <div className="h-6 bg-blue-500/10 rounded-full w-16 mx-auto animate-pulse mt-2"></div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="glass-card subtle-glow rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">⚠️</div>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="modern-button px-4 py-2 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Data loaded successfully
  if (!statsData) return null;

  return (
    <div className="glass-card subtle-glow rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
      {/* Data Period Header */}
      {statsData.dataPeriod && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 modern-badge">
            <span className="text-sm sm:text-base font-semibold">
              {statsData.dataPeriod}
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card cursor-pointer group"
        >
          <motion.h3 
            key={statsData.totalRevenue}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text leading-tight mb-2"
          >
            {statsData.totalRevenue.toLocaleString()}
          </motion.h3>
          <p className="text-gray-400 text-sm sm:text-base font-medium">Total Revenue</p>
          <div className="flex items-center justify-center mt-2">
            <span className="text-green-400 text-xs sm:text-sm font-bold modern-badge bg-green-500/10 border-green-500/20">
              ↗ {statsData.growthPercentage}% Growth
            </span>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card cursor-pointer group"
        >
          <motion.h3 
            key={statsData.totalSales}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text leading-tight mb-2"
          >
            {statsData.totalSales.toLocaleString()}
          </motion.h3>
          <p className="text-gray-400 text-sm sm:text-base font-medium">Total Sales</p>
          <div className="flex items-center justify-center mt-2">
            <span className="text-blue-400 text-xs sm:text-sm font-bold modern-badge bg-blue-500/10 border-blue-500/20">
              Items Sold
            </span>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Live • {new Date(statsData.lastUpdated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
