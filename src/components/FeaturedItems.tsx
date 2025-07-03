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
    // Load featured items from localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('ugc-sales-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.topItems && parsedData.topItems.length > 0) {
          setFeaturedItems(parsedData.topItems);
        }
      }
    }

    // Check for updates every 30 seconds
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('ugc-sales-data');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.topItems && parsedData.topItems.length > 0) {
            setFeaturedItems(parsedData.topItems);
          }
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-amber-800 to-orange-900 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-amber-100 mb-6 steampunk-font">
            Featured Creations ⚙️
          </h2>
          <p className="text-xl text-amber-300 max-w-2xl mx-auto">
            Discover my most popular steampunk UGC items that have captured the imagination of thousands of players
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="bg-amber-900/40 backdrop-blur-sm border-2 border-amber-600 rounded-lg p-6 hover:border-amber-400 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-amber-800/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {item.thumbnail ? (
                  <motion.img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    initial={{ scale: 1.1 }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <span className="text-4xl">⚙️</span>
                )}
              </div>

              {/* Item Details */}
              <h3 className="text-xl font-bold text-amber-100 mb-2">{item.name}</h3>
              <p className="text-amber-300 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>
              
              {/* Stats */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-400 font-bold">
                  {typeof item.sales === 'number' ? item.sales.toLocaleString() : item.sales} sales
                </span>
                <span className="text-amber-400">
                  {item.price} R$
                </span>
              </div>

              {/* Asset Type Badge */}
              {item.assetType && (
                <div className="text-center">
                  <span className="bg-amber-700 text-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
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
