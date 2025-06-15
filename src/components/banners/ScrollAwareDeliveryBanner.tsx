'use client';

import { Truck, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

export function ScrollAwareDeliveryBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll position to banner opacity and position
  const opacity = useTransform(scrollY, [0, 100, 200], [1, 0.8, 0.3]);
  const x = useTransform(scrollY, [0, 100, 300], [0, -20, -80]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUserActivity = () => {
      setIsUserInteracting(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsUserInteracting(false), 2000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{ opacity, x }}
      className={`
        fixed z-30 transition-all duration-300
        left-4 top-1/2 -translate-y-1/2
        hidden md:block
        ${isUserInteracting ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
      `}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      {/* Banner Card */}
      <div className="relative">
        <motion.div 
          className="bg-gradient-to-r from-orange-500/90 to-yellow-500/90 p-3 rounded-r-lg shadow-lg border-r border-y border-orange-900/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-3 pr-2">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Truck className="w-6 h-6 text-black" />
            </motion.div>
            <div>
              <p className="font-bold text-lg text-black">UK Delivery</p>
              <p className="text-sm font-medium text-black">£27.99 • Free Collection</p>
            </div>
          </div>
        </motion.div>

        {/* Side indicator */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-l-full" />
      </div>

      {/* Mobile Alternative - Bottom Toast */}
      <motion.div 
        className="md:hidden fixed bottom-4 left-4 right-4 z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-black" />
            <div>
              <p className="font-bold text-black text-sm">UK Delivery £27.99</p>
              <p className="text-xs text-black/80">or Free Collection</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 bg-black/20 hover:bg-black/40 text-black rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}