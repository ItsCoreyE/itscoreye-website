'use client';
import { useState, useRef, useEffect } from 'react';
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

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

// Load existing data on component mount (client-side only)
useEffect(() => {
  const savedData = localStorage.getItem('ugc-sales-data');
  if (savedData) {
    setSalesData(JSON.parse(savedData));
  }
}, []);

  const ADMIN_PASSWORD = 'steampunk2024';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('❌ Incorrect password!');
    }
  };

const handleManualUpdate = async () => {
  const revenue = prompt('💰 Enter total revenue (numbers only, no commas):\nExample: 56799');
  const sales = prompt('📊 Enter total sales (numbers only, no commas):\nExample: 2653');
  const growth = prompt('📈 Enter growth percentage (optional, default 2579):');
  const period = prompt('📅 Enter data period (e.g., "June 2024", "Q2 2024", "All Time"):') || 'Current Period';
  
  if (revenue && sales) {
    const cleanRevenue = revenue.replace(/[^\d]/g, '');
    const cleanSales = sales.replace(/[^\d]/g, '');
    
    const revenueNum = parseInt(cleanRevenue);
    const salesNum = parseInt(cleanSales);
    
    if (revenueNum > 10000000) {
      if (!confirm(`Revenue of ${revenueNum.toLocaleString()} seems very high. Continue?`)) {
        return;
      }
    }
    
    const manualData = {
      totalRevenue: revenueNum,
      totalSales: salesNum,
      growthPercentage: growth ? parseInt(growth.replace(/[^\d]/g, '')) : 2579,
      lastUpdated: new Date().toLocaleString(),
      dataPeriod: period,
      topItems: salesData?.topItems || []
    };
    
    try {
      // Save automatically to Upstash
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData)
      });
      
      if (response.ok) {
        setSalesData(manualData);
        alert(`✅ Stats updated automatically for all visitors!\n💰 Revenue: ${revenueNum.toLocaleString()}\n📊 Sales: ${salesNum.toLocaleString()}\n📅 Period: ${period}`);
      } else {
        alert('❌ Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('❌ Failed to save data');
    }
  }
};

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  
  try {
    const text = await file.text();
    console.log('📁 Processing CSV and fetching asset details...');
    const processedData = await processCSVData(text);
    
    // Save to Upstash automatically
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    });
    
    if (response.ok) {
      setSalesData(processedData);
      alert(`✅ CSV processed and saved automatically!\n🎨 ${processedData.topItems.length} featured items loaded with thumbnails!\n🌐 Data is now live for all visitors!`);
    } else {
      alert('❌ Failed to save processed data');
    }
  } catch (error) {
    console.error('Error processing CSV:', error);
    alert('❌ Error processing file. Please check the CSV format.');
  } finally {
    setIsUploading(false);
  }
};

const processCSVData = async (csvText: string): Promise<SalesData> => {
  console.log('Processing ROBLOX CSV data...');
  
  const lines = csvText.split('\n');
  let totalRevenue = 0;
  let totalSales = 0;
  const itemSales: { [key: string]: { 
    sales: number; 
    revenue: number; 
    price: number;
    assetId: string;
    assetType: string;
  } } = {};
  let earliestDate: Date | null = null;
  let latestDate: Date | null = null;

  // Process CSV data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',');
    
    if (columns.length >= 13) {
      const revenue = parseFloat(columns[11]);
      const price = parseFloat(columns[12]);
      const assetId = columns[7].replace(/"/g, '').trim();
      const assetName = columns[8].replace(/"/g, '').trim();
      const assetType = columns[9].replace(/"/g, '').trim();
      const dateStr = columns[2].replace(/"/g, '').trim();
      
      const saleDate = new Date(dateStr);
      if (!isNaN(saleDate.getTime())) {
        if (!earliestDate || saleDate < earliestDate) earliestDate = saleDate;
        if (!latestDate || saleDate > latestDate) latestDate = saleDate;
      }
      
      if (!isNaN(revenue) && revenue > 0) {
        totalRevenue += revenue;
        totalSales += 1;

        if (!itemSales[assetName]) {
          itemSales[assetName] = { 
            sales: 0, 
            revenue: 0, 
            price: price || 0,
            assetId: assetId,
            assetType: assetType
          };
        }
        itemSales[assetName].sales += 1;
        itemSales[assetName].revenue += revenue;
      }
    }
  }

  // Get top selling items
  const topItemsRaw = Object.entries(itemSales)
    .map(([name, data]) => ({ 
      name, 
      sales: data.sales,
      revenue: data.revenue,
      price: data.price,
      assetId: data.assetId,
      assetType: data.assetType
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  // Fetch thumbnails for top items
  console.log('🖼️ Fetching thumbnails for top items...');
  const topItems = [];
  
  for (let i = 0; i < topItemsRaw.length; i++) {
    const item = topItemsRaw[i];
    console.log(`📸 Fetching thumbnail ${i + 1}/${topItemsRaw.length} for ${item.name}`);
    
    // Fetch thumbnail details
    const assetDetails = await fetchAssetDetails(item.assetId);
    
    topItems.push({
      ...item,
      thumbnail: assetDetails.thumbnail
    });
    
    // Add delay between requests to avoid rate limiting
    if (i < topItemsRaw.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  console.log('✅ Thumbnail fetching complete');

  // Calculate period
  let dataPeriod = 'CSV Data';
  if (earliestDate && latestDate) {
    const earliestMonth = earliestDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const latestMonth = latestDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    dataPeriod = earliestMonth === latestMonth ? earliestMonth : `${earliestMonth} - ${latestMonth}`;
  }

  const result = {
    totalRevenue: Math.round(totalRevenue),
    totalSales,
    growthPercentage: 2579,
    lastUpdated: new Date().toLocaleString(),
    dataPeriod,
    topItems
  };
  
  console.log('✅ CSV processed with enhanced featured items:', result.topItems);
  return result;
};

// Function to fetch asset thumbnails (descriptions no longer needed)
const fetchAssetDetails = async (assetId: string) => {
  try {
    console.log(`🔍 Fetching thumbnail for asset ${assetId} via proxy...`);
    
    // Use our internal API route for thumbnails only
    const response = await fetch(`/api/roblox?assetId=${assetId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Successfully fetched thumbnail for ${assetId}`);
      return {
        thumbnail: data.thumbnail
      };
    } else {
      console.log(`⚠️ API returned error for ${assetId}:`, data.error);
      return {
        thumbnail: null
      };
    }
  } catch (error) {
    console.log(`❌ Failed to fetch thumbnail for asset ${assetId}:`, error);
    return {
      thumbnail: null
    };
  }
};

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-amber-800 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Rotating Gears */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-32 h-32 opacity-20"
          >
            <GearSVG />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-20 w-24 h-24 opacity-15"
          >
            <GearSVG />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-amber-800/40 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative z-10"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl mb-4"
            >
              ⚙️
            </motion.div>
            <h2 className="text-3xl font-bold text-amber-100 steampunk-font">
              Admin Access
            </h2>
            <p className="text-amber-300 mt-2">ItsCoreyE Control Panel</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full p-4 rounded-lg bg-amber-900/50 border-2 border-amber-600 text-amber-100 placeholder-amber-400 focus:border-amber-400 focus:outline-none transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="brass-button w-full py-4 text-lg font-bold"
            >
              🔓 Login to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-orange-900 to-amber-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-40 h-40 opacity-20"
        >
          <GearSVG />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-32 h-32 opacity-15"
        >
          <GearSVG />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-1/4 w-24 h-24 opacity-10"
        >
          <GearSVG />
        </motion.div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 steampunk-font">
              Admin Dashboard
            </h1>
            <p className="text-xl text-amber-300">Authorised Users Only</p>
          </motion.div>

          {/* Main Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-amber-800/40 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-8 mb-8 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Quick Update */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-amber-900/30 border border-amber-600 rounded-lg p-6"
              >
                <h3 className="text-2xl font-bold text-amber-200 mb-4 flex items-center">
                  ⚡ Quick Update
                </h3>
                <p className="text-amber-300 mb-4">
                  Instantly update your stats for milestone announcements
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManualUpdate}
                  className="brass-button w-full py-4 text-lg font-bold"
                >
                  📊 Update Stats Manually
                </motion.button>
              </motion.div>

              {/* CSV Upload */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-amber-900/30 border border-amber-600 rounded-lg p-6"
              >
                <h3 className="text-2xl font-bold text-amber-200 mb-4 flex items-center">
                  📁 CSV Upload
                </h3>
                <p className="text-amber-300 mb-4">
                  Upload ROBLOX analytics data from Create Dashboard
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="brass-button w-full py-4 text-lg font-bold disabled:opacity-50"
                >
                  {isUploading ? '⏳ Processing...' : '📈 Upload CSV File'}
                </motion.button>
              </motion.div>
            </div>

            {/* Current Stats Display */}
            {salesData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-900/30 border border-amber-600 rounded-lg p-6"
              >
                <h3 className="text-3xl font-bold text-amber-100 mb-6 text-center">
                  📊 Current Live Stats
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-amber-800/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {salesData.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-amber-300 font-semibold">💰 Total Revenue</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-amber-800/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {salesData.totalSales.toLocaleString()}
                    </div>
                    <div className="text-amber-300 font-semibold">🛍️ Total Sales</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-amber-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      ↗ {salesData.growthPercentage}%
                    </div>
                    <div className="text-amber-300 font-semibold">📈 Growth</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="bg-amber-800/50 rounded-lg p-4">
                    <div className="text-sm text-amber-400 mb-2 font-mono">
                      {salesData.lastUpdated}
                    </div>
                    <div className="text-amber-300 font-semibold">🕒 Last Updated</div>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="brass-button px-8 py-3 inline-block"
                  >
                    🏠 View Live Website
                  </motion.a>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-amber-800/40 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-amber-100 mb-6 text-center">
              📋 Dashboard Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-amber-300">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <strong className="text-amber-200">Quick Update:</strong> Perfect for milestone announcements and instant updates
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📁</span>
                  <div>
                    <strong className="text-amber-200">CSV Upload:</strong> Go to create.roblox.com → Analytics → Sales → Download Data
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <strong className="text-amber-200">Update Frequency:</strong> ROBLOX updates CSV files every 48 hours
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <strong className="text-amber-200">Security:</strong> All data stored locally, no API keys exposed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Gear SVG Component
function GearSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current drop-shadow-lg">
      <defs>
        <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DAA520" />
          <stop offset="50%" stopColor="#CD7F32" />
          <stop offset="100%" stopColor="#8B4513" />
        </radialGradient>
      </defs>
      <path 
        d="M50,15 L58,8 L66,15 L74,8 L82,15 L85,25 L78,32 L85,40 L85,50 L85,60 L78,68 L85,75 L82,85 L74,92 L66,85 L58,92 L50,85 L42,92 L34,85 L26,92 L18,85 L15,75 L22,68 L15,60 L15,50 L15,40 L22,32 L15,25 L18,15 L26,8 L34,15 L42,8 Z" 
        fill="url(#gearGradient)"
        stroke="#654321"
        strokeWidth="1"
      />
      <circle cx="50" cy="50" r="15" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      <circle cx="50" cy="50" r="8" fill="#CD7F32"/>
    </svg>
  );
}
