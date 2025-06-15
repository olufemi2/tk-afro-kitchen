'use client';

import { Truck, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function CollapsibleDeliveryBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="fixed top-20 right-4 z-40 w-72 max-w-[calc(100vw-2rem)]"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-t-lg flex items-center justify-between shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-black" />
          <span className="font-semibold text-black text-sm">Delivery Info</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-black" />
        ) : (
          <ChevronDown className="w-4 h-4 text-black" />
        )}
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-sm border-x border-b border-orange-900/20 rounded-b-lg shadow-lg overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Nationwide Delivery */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Truck className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Nationwide Delivery</h3>
                  <p className="text-xs text-gray-600">Any UK postcode - £27.99</p>
                </div>
              </div>

              {/* Free Collection */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Free Collection</h3>
                  <p className="text-xs text-gray-600">Pick up directly from our kitchen</p>
                </div>
              </div>

              {/* Action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold py-2 px-4 rounded-lg text-sm"
                onClick={() => window.location.href = '/menu'}
              >
                Order Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}