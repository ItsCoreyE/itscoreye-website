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
    // Load data from localStorage on component mount (client-side only)
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('ugc-sales-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setStatsData(parsedData);
      }
    }

    // Set up interval to check for updates every 30 seconds
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('ugc-sales-data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setStatsData(parsedData);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="bg-amber-800/30 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-8 mb-8"
    >
      {/* Data Period Header */}
      {statsData.dataPeriod && (
        <div className="text-center mb-4">
          <span className="text-amber-400 text-lg font-semibold">
            📅 {statsData.dataPeriod}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-8 text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        >
          <motion.h3 
            key={statsData.totalRevenue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-amber-100"
          >
            {statsData.totalRevenue.toLocaleString()}
          </motion.h3>
          <p className="text-amber-300">Total Revenue</p>
          <span className="text-green-400 text-sm">↗ {statsData.growthPercentage}%</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
        >
          <motion.h3 
            key={statsData.totalSales}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-amber-100"
          >
            {statsData.totalSales.toLocaleString()}
          </motion.h3>
          <p className="text-amber-300">Total Sales</p>
        </motion.div>
      </div>
      
      <div className="text-center mt-4">
        <span className="text-amber-400 text-sm">🔴 {statsData.lastUpdated}</span>
      </div>
    </motion.div>
  );
}
