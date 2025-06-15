'use client';

import { useState } from 'react';
import { SmartDeliveryBanner } from './SmartDeliveryBanner';
import { CollapsibleDeliveryBanner } from './CollapsibleDeliveryBanner';
import { ScrollAwareDeliveryBanner } from './ScrollAwareDeliveryBanner';
import { HeaderDeliveryInfo } from './HeaderDeliveryInfo';
import { DeliveryTicker } from './DeliveryTicker';
import { DeliveryBanner } from './DeliveryBanner'; // Original
import { ShippingBanner } from './ShippingBanner'; // Original

type BannerType = 'smart' | 'collapsible' | 'scroll-aware' | 'header' | 'ticker' | 'original' | 'shipping' | 'none';

interface DeliveryBannerSelectorProps {
  defaultType?: BannerType;
  showSelector?: boolean; // For testing/demo purposes
}

export function DeliveryBannerSelector({ 
  defaultType = 'smart', 
  showSelector = false 
}: DeliveryBannerSelectorProps) {
  const [selectedType, setSelectedType] = useState<BannerType>(defaultType);

  const bannerComponents = {
    'smart': <SmartDeliveryBanner />,
    'collapsible': <CollapsibleDeliveryBanner />,
    'scroll-aware': <ScrollAwareDeliveryBanner />,
    'header': <HeaderDeliveryInfo />,
    'ticker': <DeliveryTicker />,
    'original': <DeliveryBanner />,
    'shipping': <ShippingBanner />,
    'none': null,
  };

  const bannerDescriptions = {
    'smart': 'Smart Floating (Recommended) - Auto-hides when scrolling, minimizable',
    'collapsible': 'Collapsible Notification - Expandable info panel',
    'scroll-aware': 'Scroll-Aware - Fades during user interaction',
    'header': 'Header Integration - Subtle top banner',
    'ticker': 'Animated Ticker - Scrolling text banner',
    'original': 'Original Fixed Banner - Current implementation',
    'shipping': 'Shipping Banner - Top notification bar',
    'none': 'No Banner - Clean interface',
  };

  return (
    <>
      {/* Demo Selector (only shown if showSelector is true) */}
      {showSelector && (
        <div className="fixed top-4 left-4 z-50 bg-black/80 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-2">Banner Demo</h3>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as BannerType)}
            className="bg-gray-800 text-white p-2 rounded text-sm"
          >
            {Object.entries(bannerDescriptions).map(([key, description]) => (
              <option key={key} value={key}>
                {description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render Selected Banner */}
      {bannerComponents[selectedType]}
    </>
  );
}

// Pre-configured exports for easy use
export function RecommendedDeliveryBanner() {
  return <DeliveryBannerSelector defaultType="smart" />;
}

export function HeaderOnlyDeliveryBanner() {
  return <DeliveryBannerSelector defaultType="header" />;
}

export function MobileOptimizedDeliveryBanner() {
  return <DeliveryBannerSelector defaultType="collapsible" />;
}