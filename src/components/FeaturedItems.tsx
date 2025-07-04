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
  description?: string;
  thumbnail?: string;
}

export default function FeaturedItems() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([
    // Default steampunk items as fallback
    {
      name: "Steampunk Lantern",
      description: "Illuminating Victorian-era inspired lantern with brass details",
      sales: 1247,
      revenue: 187050,
      price: 150,
      thumbnail: undefined
    },
    {
      name: "Mechanical Backpack", 
      description: "Intricate steampunk backpack with moving gears and pipes",
      sales: 892,
      revenue: 178400,
      price: 200,
      thumbnail: undefined
    },
    {
      name: "Clockwork Wings",
      description: "Majestic bronze wings with spinning clockwork mechanisms",
      sales: 756,
      revenue: 226800,
      price: 300,
      thumbnail: undefined
    },
    {
      name: "Gear Satchel",
      description: "Practical steampunk bag with authentic brass fittings",
      sales: 634,
      revenue: 79250,
      price: 125,
      thumbnail: undefined
    },
    {
      name: "Reporter Camera",
      description: "Vintage-style camera perfect for steampunk adventures",
      sales: 523,
      revenue: 91525,
      price: 175,
      thumbnail: undefined
    },
    {
      name: "Brass Goggles",
      description: "Classic steampunk eyewear with adjustable lenses",
      sales: 412,
      revenue: 41200,
      price: 100,
      thumbnail: undefined
    }
  ]);

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
        } else {
          console.error('Failed to fetch featured items from API:', response.status);
        }
      } catch (error) {
        console.error('Error fetching featured items from API:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Check for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-800 to-orange-900 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 steampunk-font leading-tight"
            data-text="Featured Creations"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            Featured Creations
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20 sm:w-32"></div>
            <span className="text-3xl sm:text-4xl">⚙️</span>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20 sm:w-32"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-amber-300/90 max-w-3xl mx-auto px-4 leading-relaxed"
          >
            Discover my most popular UGC items that have captured the imagination of thousands of players across all categories
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 40, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ scale: 1.03, rotateY: 3, z: 50 }}
              className="relative group bg-gradient-to-br from-amber-900/50 via-amber-800/40 to-orange-900/50 backdrop-blur-md border-2 border-amber-600/60 rounded-xl p-5 sm:p-6 hover:border-amber-400/80 transition-all duration-500 shadow-xl hover:shadow-2xl"
              style={{
                boxShadow: `
                  0 10px 30px rgba(0, 0, 0, 0.3),
                  inset 0 1px 2px rgba(255, 255, 255, 0.1),
                  0 0 20px rgba(218, 165, 32, 0.1)
                `
              }}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
              <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
              <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>
              <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-amber-400/40 group-hover:border-amber-300/60 transition-colors"></div>

              {/* Thumbnail */}
              <div className="relative aspect-square bg-gradient-to-br from-amber-800/60 to-orange-900/60 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-amber-600/30 group-hover:border-amber-500/50 transition-all duration-300">
                {item.thumbnail ? (
                  <motion.img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <motion.span 
                    className="text-4xl sm:text-5xl opacity-60 group-hover:opacity-80 transition-opacity"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                  >
                    ⚙️
                  </motion.span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Item Details */}
              <motion.h3 
                className="text-lg sm:text-xl font-bold text-amber-100 mb-3 leading-tight group-hover:text-amber-50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {item.name}
              </motion.h3>
              <p className="text-amber-300/80 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-amber-300 transition-colors">
                {item.description}
              </p>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 mb-4">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-green-400 font-bold text-sm sm:text-base bg-green-900/20 px-3 py-1 rounded-full border border-green-600/30">
                    📈 {typeof item.sales === 'number' ? item.sales.toLocaleString() : item.sales}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-amber-400 text-sm sm:text-base font-bold bg-amber-900/20 px-3 py-1 rounded-full border border-amber-600/30">
                    💰 {item.price} R$
                  </span>
                </motion.div>
              </div>

              {/* Asset Type Badge */}
              {item.assetType && (
                <div className="text-center">
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border border-amber-500/40 shadow-lg"
                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(218, 165, 32, 0.4)" }}
                  >
                    {item.assetType}
                  </motion.span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
