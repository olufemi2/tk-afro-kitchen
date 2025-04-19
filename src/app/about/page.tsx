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
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-100 to-yellow-50 py-16 mb-12">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500">
                  About TK Afro Kitchen
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Bringing authentic Nigerian cuisine to your doorstep
                </p>
                <div className="prose prose-lg">
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
                <div key={index} className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Services Overview */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Delivery Service</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Next-day delivery across UK mainland</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Temperature-controlled packaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Same-day delivery in Milton Keynes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Minimum order value: £70</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Catering Service</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Corporate events and functions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Private parties and celebrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Customized menu options</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Professional service staff</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Cuisine?</h2>
            <p className="text-lg opacity-90 mb-8">
              Order now and discover why we're Milton Keynes' premier African kitchen
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-white/90">
                <a href="/menu">View Menu</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 