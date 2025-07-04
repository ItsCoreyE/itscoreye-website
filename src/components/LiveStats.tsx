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
    description?: string;
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="bg-amber-800/30 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 w-full max-w-lg mx-auto"
    >
      {/* Data Period Header */}
      {statsData.dataPeriod && (
        <div className="text-center mb-3 sm:mb-4">
          <span className="text-amber-400 text-base sm:text-lg font-semibold">
            📅 {statsData.dataPeriod}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer p-2 sm:p-0"
        >
          <motion.h3 
            key={statsData.totalRevenue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100 leading-tight"
          >
            {statsData.totalRevenue.toLocaleString()}
          </motion.h3>
          <p className="text-amber-300 text-sm sm:text-base mt-1">Total Revenue</p>
          <span className="text-green-400 text-xs sm:text-sm">↗ {statsData.growthPercentage}%</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer p-2 sm:p-0"
        >
          <motion.h3 
            key={statsData.totalSales}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100 leading-tight"
          >
            {statsData.totalSales.toLocaleString()}
          </motion.h3>
          <p className="text-amber-300 text-sm sm:text-base mt-1">Total Sales</p>
        </motion.div>
      </div>
      
      <div className="text-center mt-3 sm:mt-4">
        <span className="text-amber-400 text-xs sm:text-sm">🔴 {statsData.lastUpdated}</span>
      </div>
    </motion.div>
  );
}
