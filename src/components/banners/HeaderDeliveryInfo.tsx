'use client';

import { Truck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeaderDeliveryInfo() {
  return (
    <motion.div 
      className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-b border-orange-900/20"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-6 text-sm">
          {/* Nationwide Delivery */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Truck className="w-4 h-4 text-orange-400" />
            </motion.div>
            <span className="text-slate-300">
              <span className="font-semibold text-orange-400">UK Delivery</span> £27.99
            </span>
          </motion.div>

          {/* Separator */}
          <div className="w-1 h-4 bg-orange-900/30 rounded-full hidden sm:block" />

          {/* Free Collection */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <MapPin className="w-4 h-4 text-green-400" />
            </motion.div>
            <span className="text-slate-300">
              <span className="font-semibold text-green-400">Collection</span> Free
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}