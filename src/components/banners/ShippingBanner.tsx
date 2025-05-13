'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function ShippingBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-[#1e1e1e] border-b border-orange-900/20"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <MapPin className="w-4 h-4 text-orange-400" />
          </motion.div>
          <p className="text-center text-sm md:text-base">
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Nationwide Delivery
            </span>
            <span className="text-slate-300 ml-2">
              • Flat rate shipping £21.99
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}