'use client';

import { Truck, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function DeliveryTicker() {
  const deliveryMessages = [
    { icon: Truck, text: "🚚 UK-Wide Delivery for just £27.99", color: "text-orange-400" },
    { icon: MapPin, text: "📍 Free Collection Available", color: "text-green-400" },
    { icon: Clock, text: "⏰ Fresh Nigerian Cuisine Daily", color: "text-blue-400" },
    { icon: Truck, text: "🌍 Nationwide Delivery to Any UK Postcode", color: "text-orange-400" },
  ];

  return (
    <div className="bg-[#1a1a1a] border-b border-orange-900/20 overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -100 * deliveryMessages.length + '%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Duplicate messages for seamless loop */}
          {[...deliveryMessages, ...deliveryMessages].map((message, index) => {
            const Icon = message.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-8 py-2 min-w-max"
              >
                <Icon className={`w-4 h-4 ${message.color}`} />
                <span className="text-slate-300 text-sm font-medium">
                  {message.text}
                </span>
                {index < deliveryMessages.length * 2 - 1 && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full mx-4" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1a1a1a] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}