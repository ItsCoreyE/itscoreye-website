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
      <div className="relative premium-card enhanced-glass deep-shadow hover-lift glow-border rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400/60"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400/60"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400/60"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400/60"></div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center">
          <div className="relative">
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/20 rounded-lg p-4 border border-green-600/30">
              <div className="h-12 sm:h-16 md:h-20 bg-green-300/20 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-amber-200/20 rounded mb-2 animate-pulse"></div>
              <div className="h-6 bg-green-400/20 rounded-full w-24 mx-auto animate-pulse"></div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-800/20 rounded-lg p-4 border border-blue-600/30">
              <div className="h-12 sm:h-16 md:h-20 bg-blue-300/20 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-amber-200/20 rounded mb-2 animate-pulse"></div>
              <div className="h-6 bg-blue-400/20 rounded-full w-20 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400/40 rounded-full animate-pulse"></div>
            <div className="h-4 w-20 bg-amber-400/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative premium-card enhanced-glass deep-shadow hover-lift glow-border rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400/60"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400/60"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400/60"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400/60"></div>

        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">⚠️</div>
          <p className="text-amber-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="brass-button px-4 py-2 text-sm"
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
    <div className="relative premium-card enhanced-glass deep-shadow hover-lift glow-border rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400/60"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400/60"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400/60"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400/60"></div>

      {/* Data Period Header */}
      {statsData.dataPeriod && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-700/30 px-4 py-2 rounded-full border border-amber-500/40">
            <span className="text-amber-300 text-sm sm:text-base font-semibold tracking-wide">
              {statsData.dataPeriod}
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/20 rounded-lg p-4 border border-green-600/30 group-hover:border-green-500/50 transition-all duration-300">
            <motion.h3 
              key={statsData.totalRevenue}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-300 leading-tight mb-2 steampunk-font"
              style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
            >
              {statsData.totalRevenue.toLocaleString()}
            </motion.h3>
            <p className="text-amber-200 text-sm sm:text-base font-medium tracking-wide">Total Revenue</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-green-400 text-xs sm:text-sm font-bold bg-green-900/30 px-2 py-1 rounded-full">
                {statsData.growthPercentage}% Growth
              </span>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-800/20 rounded-lg p-4 border border-blue-600/30 group-hover:border-blue-500/50 transition-all duration-300">
            <motion.h3 
              key={statsData.totalSales}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-300 leading-tight mb-2 steampunk-font"
              style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
            >
              {statsData.totalSales.toLocaleString()}
            </motion.h3>
            <p className="text-amber-200 text-sm sm:text-base font-medium tracking-wide">Total Sales</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-blue-400 text-xs sm:text-sm font-bold bg-blue-900/30 px-2 py-1 rounded-full">
                Items Sold
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center mt-6">
        <div className="inline-flex items-center gap-2 text-amber-400 text-xs sm:text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-medium">{statsData.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
