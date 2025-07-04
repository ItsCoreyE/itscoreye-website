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
  const [statsData, setStatsData] = useState<SalesData>({
    totalRevenue: 56799,
    totalSales: 2653,
    growthPercentage: 2579,
    lastUpdated: 'Live Data',
    dataPeriod: 'All Time',
    topItems: []
  });

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        } else {
          console.error('Failed to fetch data from API:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval to check for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-orange-900/40 backdrop-blur-md border-3 border-amber-600/60 rounded-xl p-6 sm:p-8 w-full max-w-2xl mx-auto shadow-2xl"
      style={{
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.4),
          inset 0 2px 4px rgba(255, 255, 255, 0.1),
          inset 0 -2px 4px rgba(0, 0, 0, 0.2),
          0 0 30px rgba(218, 165, 32, 0.2)
        `
      }}
    >
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
                ↗ {statsData.growthPercentage}% Growth
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
