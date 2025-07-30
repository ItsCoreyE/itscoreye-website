'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MilestoneAdmin from './MilestoneAdmin';

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
        
        // Trigger CSV stats webhook
        try {
          const webhookData = {
            ...processedData,
            uploadType: 'single'
          };
          
          const webhookResponse = await fetch('/api/discord/csv-stats-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statsData: webhookData })
          });
          
          if (webhookResponse.ok) {
            console.log('✅ CSV stats webhook sent successfully');
          } else {
            console.log('⚠️ CSV stats webhook failed, but data was saved');
          }
        } catch (webhookError) {
          console.log('⚠️ CSV stats webhook error:', webhookError);
        }
        
        alert(`✅ CSV processed and saved automatically!\n🎨 ${processedData.topItems.length} featured items loaded with thumbnails!\n🌐 Data is now live for all visitors!\n📢 Discord notification sent!`);
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

  const handleGrowthCalculation = async () => {
    const previousFile = document.getElementById('previousFile') as HTMLInputElement;
    const currentFile = document.getElementById('currentFile') as HTMLInputElement;
    
    if (!previousFile.files?.[0] || !currentFile.files?.[0]) {
      alert('❌ Please select both previous month and current month CSV files');
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('📊 Processing both CSV files for growth calculation...');
      
      // Process previous month file (simplified - just need totals)
      const previousText = await previousFile.files[0].text();
      const previousData = await processCSVDataForGrowth(previousText, 'Previous Month');
      
      // Process current month file (FULL processing with thumbnails and featured items)
      const currentText = await currentFile.files[0].text();
      const currentData = await processCSVData(currentText);
      
      // Calculate growth
      const revenueGrowth = previousData.totalRevenue > 0 
        ? ((currentData.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100
        : 0;
      
      const salesGrowth = previousData.totalSales > 0
        ? ((currentData.totalSales - previousData.totalSales) / previousData.totalSales) * 100  
        : 0;
      
      // Use revenue growth as the main growth metric
      const growthPercentage = Math.round(revenueGrowth * 10) / 10; // Round to 1 decimal
      
      // Create final data with growth calculation and featured items
      const finalData = {
        ...currentData,
        growthPercentage: growthPercentage,
        lastUpdated: new Date().toLocaleString(),
        dataPeriod: `${previousData.dataPeriod} → ${currentData.dataPeriod}`
      };
      
      // Save to Upstash automatically
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      
      if (response.ok) {
        setSalesData(finalData);
        
        // Trigger CSV stats webhook for growth calculation
        try {
          const webhookData = {
            ...finalData,
            uploadType: 'growth'
          };
          
          const webhookResponse = await fetch('/api/discord/csv-stats-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statsData: webhookData })
          });
          
          if (webhookResponse.ok) {
            console.log('✅ Growth calculation webhook sent successfully');
          } else {
            console.log('⚠️ Growth calculation webhook failed, but data was saved');
          }
        } catch (webhookError) {
          console.log('⚠️ Growth calculation webhook error:', webhookError);
        }
        
        alert(`✅ Growth calculation complete!\n📈 Revenue Growth: ${growthPercentage > 0 ? '+' : ''}${growthPercentage}%\n📊 Sales Growth: ${salesGrowth > 0 ? '+' : ''}${Math.round(salesGrowth * 10) / 10}%\n🎨 ${finalData.topItems.length} featured items loaded with thumbnails!\n🌐 Data is now live for all visitors!\n📢 Discord notification sent!`);
      } else {
        alert('❌ Failed to save processed data');
      }
    } catch (error) {
      console.error('Error processing growth calculation:', error);
      alert('❌ Error processing files. Please check the CSV format.');
    } finally {
      setIsUploading(false);
    }
  };

  const processCSVDataForGrowth = async (csvText: string, periodLabel: string): Promise<SalesData> => {
    console.log(`Processing ${periodLabel} CSV data...`);
    
    const lines = csvText.split('\n');
    let totalRevenue = 0;
    let totalSales = 0;
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    // Process CSV data (simplified for growth calculation)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',');
      
      if (columns.length >= 13) {
        const revenue = parseFloat(columns[11]);
        const dateStr = columns[2].replace(/"/g, '').trim();
        
        const saleDate = new Date(dateStr);
        if (!isNaN(saleDate.getTime())) {
          if (!earliestDate || saleDate < earliestDate) earliestDate = saleDate;
          if (!latestDate || saleDate > latestDate) latestDate = saleDate;
        }
        
        if (!isNaN(revenue) && revenue > 0) {
          totalRevenue += revenue;
          totalSales += 1;
        }
      }
    }

    // Calculate period
    let dataPeriod = periodLabel;
    if (earliestDate && latestDate) {
      const earliestMonth = earliestDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      const latestMonth = latestDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      dataPeriod = earliestMonth === latestMonth ? earliestMonth : `${earliestMonth} - ${latestMonth}`;
    }

    return {
      totalRevenue: Math.round(totalRevenue),
      totalSales,
      growthPercentage: 0, // Will be calculated later
      lastUpdated: new Date().toLocaleString(),
      dataPeriod,
      topItems: [] // Not needed for growth calculation
    };
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
      <div className="min-h-screen modern-gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 max-w-md w-full mx-4 relative z-10"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-6xl mb-4"
            >
              🔐
            </motion.div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Admin Access
            </h2>
            <p className="text-gray-400 mt-2">ItsCoreyE Control Panel</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="modern-input w-full"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="modern-button w-full py-4 text-lg font-bold"
            >
              🔓 Login to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen modern-gradient-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
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
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-400">Manage Your UGC Business</p>
          </motion.div>

          {/* Main Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Quick Update */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6"
              >
                <h3 className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
                  ⚡ Quick Update
                </h3>
                <p className="text-gray-400 mb-4">
                  Instantly update your stats for milestone announcements
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManualUpdate}
                  className="modern-button w-full py-4 text-lg font-bold"
                >
                  📊 Update Stats Manually
                </motion.button>
              </motion.div>

              {/* CSV Upload */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6"
              >
                <h3 className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
                  📁 CSV Upload
                </h3>
                <p className="text-gray-400 mb-4">
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
                  className="modern-button w-full py-4 text-lg font-bold disabled:opacity-50"
                >
                  {isUploading ? '⏳ Processing...' : '📈 Upload CSV File'}
                </motion.button>
              </motion.div>
            </div>

            {/* Growth Calculation Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-100 mb-4 flex items-center">
                📊 Growth Calculation
              </h3>
              <p className="text-gray-400 mb-6">
                Upload two CSV files to calculate real month-over-month growth percentage
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    📅 Previous Month CSV
                  </label>
                  <input
                    id="previousFile"
                    type="file"
                    accept=".csv"
                    className="modern-input w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">
                    📅 Current Month CSV
                  </label>
                  <input
                    id="currentFile"
                    type="file"
                    accept=".csv"
                    className="modern-input w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700 transition-colors"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGrowthCalculation}
                disabled={isUploading}
                className="modern-button w-full py-4 text-lg font-bold disabled:opacity-50"
              >
                {isUploading ? '⏳ Calculating Growth...' : '🧮 Calculate Real Growth'}
              </motion.button>
              
              <div className="mt-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                <p className="text-gray-400 text-sm">
                  <strong>💡 How it works:</strong> Upload your previous and current month CSV files, and the system will automatically calculate the real revenue growth percentage between the two months.
                </p>
              </div>
            </motion.div>

            {/* Current Stats Display */}
            {salesData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-3xl font-bold text-gray-100 mb-6 text-center">
                  📊 Current Live Stats
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="stats-card">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {salesData.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-gray-400 font-semibold">💰 Total Revenue</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="stats-card">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {salesData.totalSales.toLocaleString()}
                    </div>
                    <div className="text-gray-400 font-semibold">🛍️ Total Sales</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="stats-card">
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      ↗ {salesData.growthPercentage}%
                    </div>
                    <div className="text-gray-400 font-semibold">📈 Growth</div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="stats-card">
                    <div className="text-sm text-amber-400 mb-2 font-mono">
                      {salesData.lastUpdated}
                    </div>
                    <div className="text-gray-400 font-semibold">🕒 Last Updated</div>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="modern-button px-8 py-3 inline-block"
                  >
                    🏠 View Live Website
                  </motion.a>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Milestone Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <MilestoneAdmin />
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8"
          >
            <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
              📋 Dashboard Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <strong className="text-gray-300">Quick Update:</strong> Perfect for milestone announcements and instant updates
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📁</span>
                  <div>
                    <strong className="text-gray-300">CSV Upload:</strong> Go to create.roblox.com → Analytics → Sales → Download Data
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <strong className="text-gray-300">Update Frequency:</strong> ROBLOX updates CSV files every 48 hours
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <strong className="text-gray-300">Security:</strong> All data stored securely in the cloud
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
