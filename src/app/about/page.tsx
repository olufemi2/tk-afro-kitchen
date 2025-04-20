'use client';

import { Header } from "@/components/layout/header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Award, Truck, Clock, Star, Shield } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "5-Star Food Hygiene",
    description: "Certified by Milton Keynes Council for maintaining the highest food safety standards"
  },
  {
    icon: Truck,
    title: "UK-Wide Delivery",
    description: "Next-day delivery service available across UK mainland for £21.99"
  },
  {
    icon: Clock,
    title: "Fresh Preparation",
    description: "All meals are cooked fresh to order with no preservatives"
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Licensed and insured catering service for your peace of mind"
  }
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h1 className="hero-title">
                  About TK Afro Kitchen
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  Bringing authentic Nigerian cuisine to your doorstep
                </p>
                <div className="prose prose-lg text-slate-400">
                  <p className="mb-4">
                    TK Afro Kitchen Ltd is a premier African food catering and kitchen service based in Milton Keynes. 
                    We take pride in delivering authentic Nigerian cuisine across the UK mainland, bringing the rich flavors 
                    and traditions of African cooking to your home.
                  </p>
                  <p>
                    Our commitment to quality and food safety has earned us a 5-star food hygiene certification, 
                    and we maintain the highest standards in food preparation and delivery.
                  </p>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/dishes/kitchen.jpg"
                  alt="TK Afro Kitchen"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 rounded-xl bg-[#1e1e1e] border border-orange-900/20 hover:border-orange-500/50 transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-400">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Overview */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-orange-900/20">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Delivery Service</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Next-day delivery across UK mainland</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Temperature-controlled packaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Same-day delivery in Milton Keynes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Minimum order value: £70</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-orange-900/20">
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Catering Service</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Professional event catering</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Customized menu options</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Full service setup and cleanup</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Corporate and private events</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl p-12 text-center border border-orange-900/20">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Ready to Experience Our Cuisine?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Browse our menu and place your order today
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <a href="/menu">View Menu</a>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
} 