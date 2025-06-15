'use client';

import { Truck, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function SmartDeliveryBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isScrollingDown ? 0.7 : 1,
          scale: isScrollingDown ? 0.9 : 1,
          y: isScrollingDown ? 20 : 0
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`
          fixed z-40 transition-all duration-300
          ${isMinimized ? 'bottom-4 right-4' : 'bottom-4 right-4 md:left-4 md:top-1/2 md:-translate-y-1/2'}
        `}
      >
        <div className={`
          relative bg-gradient-to-r from-orange-500/95 to-yellow-500/95 
          backdrop-blur-sm rounded-lg shadow-lg border border-orange-900/20
          ${isMinimized ? 'p-2' : 'p-3 md:p-4'}
        `}>
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Minimize/Expand button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <AnimatePresence mode="wait">
            {isMinimized ? (
              <motion.div
                key="minimized"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Truck className="w-5 h-5 text-black" />
                <span className="font-bold text-sm text-black">£27.99</span>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Truck className="w-6 h-6 text-black" />
                </motion.div>
                <div>
                  <p className="font-bold text-base md:text-lg text-black">UK-Wide Delivery</p>
                  <p className="text-sm font-medium text-black">Flat rate £27.99</p>
                  <p className="text-xs text-black/80 hidden md:block">or Free Collection</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse indicator */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg opacity-30 animate-pulse -z-10" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}