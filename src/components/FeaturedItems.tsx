'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

interface FeaturedItem {
  name: string;
  sales: number;
  revenue: number;
  price: number;
  assetId?: string;
  assetType?: string;
  thumbnail?: string;
}

export default function FeaturedItems() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { duration, staggerDelay, enableHover } = usePerformanceMode();

  // Format asset type from camelCase to readable format
  const formatAssetType = (assetType: string): string => {
    // Insert space before capital letters and trim
    return assetType
      .replace(/([A-Z])/g, ' $1')
      .trim();
  };

  useEffect(() => {
    // Function to fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (data.topItems && data.topItems.length > 0) {
            setFeaturedItems(data.topItems);
          }
          setError(null);
        } else {
          console.error('Failed to fetch featured items from API:', response.status);
          setError('Failed to load featured items');
        }
      } catch (error) {
        console.error('Error fetching featured items from API:', error);
        setError('Failed to load featured items');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Check for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen modern-gradient-bg section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
            Best Sellers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
            </p>
          </motion.div>

          {/* Loading skeleton grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-xl"
              >
                {/* Thumbnail skeleton */}
                <div className="relative aspect-square bg-gray-800/50 rounded-lg mb-4 animate-pulse"></div>

                {/* Title skeleton */}
                <div className="h-6 bg-gray-700/50 rounded mb-4 animate-pulse"></div>
                
                {/* Stats skeleton */}
                <div className="flex justify-between items-center gap-3 mb-4">
                  <div className="h-8 bg-green-500/10 rounded-full w-20 animate-pulse"></div>
                  <div className="h-8 bg-amber-500/10 rounded-full w-16 animate-pulse"></div>
                </div>

                {/* Asset type skeleton */}
                <div className="text-center">
                  <div className="h-6 bg-gray-700/30 rounded-full w-24 mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen modern-gradient-bg section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
              Best Sellers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
            </p>
          </motion.div>

          <div className="text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mb-4 mx-auto" />
            <p className="text-gray-300 mb-6 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="modern-button px-6 py-3 text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No items found
  if (featuredItems.length === 0) {
    return (
      <section className="min-h-screen modern-gradient-bg section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
              Best Sellers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
            </p>
          </motion.div>

          <div className="text-center">
            <ArchiveBoxIcon className="w-16 h-16 text-amber-400 mb-4 mx-auto" />
            <p className="text-gray-300 text-lg">No featured items available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  // Data loaded successfully
  return (
    <section className="min-h-screen modern-gradient-bg section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
            Best Sellers
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-4 leading-relaxed">
            Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration * 0.625, delay: index * staggerDelay }}
              whileHover={enableHover ? { y: -8 } : undefined}
              className="glass-card hover-lift p-6 rounded-xl group"
              style={{ willChange: 'transform' }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 overflow-hidden">
                {item.thumbnail ? (
                  <motion.img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={enableHover ? { scale: 1.05 } : undefined}
                    transition={{ duration: duration * 0.375 }}
                    style={{ willChange: 'transform' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 opacity-30 group-hover:opacity-50 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path d="M14 2v6h6"/>
                      <rect x="8" y="12" width="8" height="6" rx="1"/>
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Item Details */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 leading-tight line-clamp-2">
                {item.name}
              </h3>
              
              {/* Stats */}
              <div className="flex justify-between items-center gap-3 mb-4">
                <span className="text-white font-semibold text-sm bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  {typeof item.sales === 'number' ? item.sales.toLocaleString() : item.sales} sold
                </span>
                <span className="text-white text-sm font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                  {item.price} R$
                </span>
              </div>

              {/* Asset Type Badge */}
              {item.assetType && (
                <div className="text-center">
                  <span className="inline-block text-xs font-medium text-gray-200 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                    {formatAssetType(item.assetType)}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
