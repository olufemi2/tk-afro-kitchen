'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Award, Users, Utensils, Settings, Truck, Home, Sun } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

const services: Service[] = [
  {
    title: "UK-Wide Delivery",
    description: "Fresh, hot meals delivered to your doorstep across the UK. Experience authentic African flavors without leaving your home.",
    icon: Truck,
  },
  {
    title: "Home Catering",
    description: "Let us cater your special events with our delicious menu. Perfect for parties, corporate events, and celebrations.",
    icon: Home,
  },
  {
    title: "Special Events",
    description: "Make your events memorable with our premium catering service. We handle everything from setup to cleanup.",
    icon: Sun,
  },
];

const features = [
  {
    icon: Award,
    title: "Certified Excellence",
    description: "Fully certified by Milton Keynes Council for food safety and hygiene standards."
  },
  {
    icon: Utensils,
    title: "Authentic Experience",
    description: "Traditional Nigerian recipes prepared with authentic techniques and ingredients."
  },
  {
    icon: Users,
    title: "Professional Team",
    description: "Experienced staff trained in both Nigerian cuisine and professional service."
  },
  {
    icon: Settings,
    title: "Custom Solutions",
    description: "Tailored menus and services to meet your specific event requirements."
  }
];

function ServiceCard({ title, description, icon: Icon }: Service) {
  return (
    <div className="p-6 bg-[#242424] rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="flex items-center gap-4 mb-4">
        <Icon className="w-8 h-8 text-orange-500" />
        <h3 className="text-xl font-semibold text-slate-200">{title}</h3>
      </div>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content text-center">
            <h1 className="hero-title">
              Our Services
            </h1>
            <p className="hero-description">
              Experience authentic African cuisine through our premium food services. 
              From nationwide delivery to event catering, we bring the taste of Africa to you.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 bg-[#1a1a1a]">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} title={service.title} description={service.description} icon={service.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#121212]">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Quality Ingredients",
                  description: "We source the finest authentic African ingredients for our dishes."
                },
                {
                  title: "Expert Chefs",
                  description: "Our experienced chefs bring authentic recipes and techniques."
                },
                {
                  title: "Reliable Service",
                  description: "Punctual delivery and professional service guaranteed."
                },
                {
                  title: "Custom Solutions",
                  description: "Tailored menus and services to match your needs."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-lg bg-[#242424] border border-orange-900/20"
                >
                  <h3 className="text-lg font-semibold mb-2 text-orange-400">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Ready to Experience Our Services?
            </h2>
            <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
              Whether you're planning an event or craving authentic African cuisine, 
              we're here to serve you with excellence.
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <Link href="/menu">
                Explore Our Menu
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
} 