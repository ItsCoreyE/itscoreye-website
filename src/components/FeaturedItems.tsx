'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight gradient-text">
              Best Sellers
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
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
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
            </p>
          </motion.div>

          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
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
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
            </p>
          </motion.div>

          <div className="text-center">
            <div className="text-amber-400 text-4xl mb-4">📦</div>
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
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
            Discover this month&apos;s top-performing designs that have captured the community&apos;s attention
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card hover-lift p-6 rounded-xl group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 overflow-hidden">
                {item.thumbnail ? (
                  <motion.img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl opacity-30 group-hover:opacity-50 transition-opacity">
                      🎮
                    </span>
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
                <span className="text-green-400 font-semibold text-sm modern-badge bg-green-500/10 border-green-500/20">
                  {typeof item.sales === 'number' ? item.sales.toLocaleString() : item.sales} sold
                </span>
                <span className="text-amber-400 text-sm font-semibold modern-badge">
                  {item.price} R$
                </span>
              </div>

              {/* Asset Type Badge */}
              {item.assetType && (
                <div className="text-center">
                  <span className="inline-block text-xs font-medium text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700/50">
                    {item.assetType}
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
