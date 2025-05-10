'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { QuoteFormModal } from "@/components/forms/quote-form-modal";

export default function CateringPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1e1e1e] pb-16 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-20" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                           bg-gradient-to-r from-orange-400 to-yellow-400 
                           leading-tight md:leading-tight">
                Premium Catering Services
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto 
                          leading-relaxed">
                Elevate your events with authentic Nigerian and African cuisine. 
                From intimate gatherings to large celebrations.
              </p>
              <QuoteFormModal 
                trigger={
                  <Button 
                    className="button-primary text-lg" 
                    size="lg"
                  >
                    Request a Quote
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Our Catering Services</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Corporate Events */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-orange-900/20">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Corporate Events</h3>
                <p className="text-slate-300">Professional catering for business meetings, conferences, and corporate functions.</p>
              </div>

              {/* Private Parties */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-orange-900/20">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Private Parties</h3>
                <p className="text-slate-300">Personalized menus for birthdays, anniversaries, and family gatherings.</p>
              </div>

              {/* Weddings */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-orange-900/20">
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Weddings</h3>
                <p className="text-slate-300">Exquisite wedding catering services with customized menu options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Get in Touch</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Let us help you plan your next event. Contact us for a personalized quote and menu consultation.
            </p>
            <div className="flex justify-center gap-4">
              <QuoteFormModal 
                trigger={
                  <Button className="button-primary">
                    Contact Us
                  </Button>
                }
              />
              <Button variant="outline">
                View Menu
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 