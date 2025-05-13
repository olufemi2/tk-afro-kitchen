'use client';

import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export function DeliveryBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
    >
      <div className="relative">
        {/* Main Banner */}
        <div className="bg-gradient-to-r from-orange-500/90 to-yellow-500/90 p-4 rounded-r-lg shadow-lg border-r border-y border-orange-900/20">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-black animate-bounce" />
            <div>
              <p className="font-bold text-lg text-black">UK-Wide Delivery</p>
              <p className="text-sm font-medium text-black">Standard shipping £21.99</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-l-full" />
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full" />
      </div>
    </motion.div>
  );
}