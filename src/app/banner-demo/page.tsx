'use client';

import { Header } from "@/components/layout/header";
import { DeliveryBannerSelector } from '@/components/banners/DeliveryBannerSelector';

export default function BannerDemoPage() {
  return (
    <>
      <Header />
      <DeliveryBannerSelector defaultType="smart" showSelector={true} />
      
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Delivery Banner Options Demo
            </h1>
            
            <div className="space-y-8">
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-orange-900/20">
                <h2 className="text-xl font-semibold mb-4 text-orange-400">Available Options</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-green-400 mb-2">🌟 Smart Floating (Recommended)</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Auto-hides when scrolling down</li>
                        <li>• Minimizable by user</li>
                        <li>• Responsive positioning</li>
                        <li>• Non-intrusive design</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-blue-400 mb-2">📱 Collapsible Notification</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Expandable info panel</li>
                        <li>• Mobile-optimized</li>
                        <li>• Detailed delivery info</li>
                        <li>• Call-to-action included</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-2">👁️ Scroll-Aware</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Fades during interaction</li>
                        <li>• Scroll-responsive opacity</li>
                        <li>• Desktop + mobile versions</li>
                        <li>• Smooth animations</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-yellow-400 mb-2">📍 Header Integration</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Subtle top banner</li>
                        <li>• Always visible</li>
                        <li>• Clean, minimal design</li>
                        <li>• No UI obstruction</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-cyan-400 mb-2">🎬 Animated Ticker</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Scrolling text animation</li>
                        <li>• Multiple messages</li>
                        <li>• Eye-catching design</li>
                        <li>• Seamless loop</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-[#1e1e1e] rounded-lg">
                      <h3 className="font-semibold text-red-400 mb-2">❌ No Banner</h3>
                      <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Clean interface</li>
                        <li>• No distractions</li>
                        <li>• Minimalist approach</li>
                        <li>• Rely on menu/checkout info</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-orange-900/20">
                <h2 className="text-xl font-semibold mb-4 text-orange-400">Mobile Optimization Features</h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                  <div>
                    <h3 className="font-semibold text-green-400 mb-2">✅ Smart Positioning</h3>
                    <p>Automatically adjusts position based on screen size and user interaction</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">📱 Touch Friendly</h3>
                    <p>Large touch targets and gesture-based interactions for mobile users</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">🎯 Context Aware</h3>
                    <p>Hides during critical user actions to prevent workflow interruption</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-8">
                <p className="text-lg text-slate-300 mb-4">
                  Use the selector above to test different banner styles
                </p>
                <p className="text-sm text-slate-400">
                  The Smart Floating banner is recommended for the best user experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}