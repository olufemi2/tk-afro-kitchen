import Image from 'next/image';
import { Button } from "@/components/ui/button";

export default function CateringPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/catering/hero-catering.jpg"
            alt="Catering Services"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Premium Catering Services
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-8">
            Elevate your events with authentic Nigerian and African cuisine. From intimate gatherings to large celebrations.
          </p>
          <Button className="button-primary text-lg" size="lg">
            Request a Quote
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-[#1e1e1e]">
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
            <Button className="button-primary">
              Contact Us
            </Button>
            <Button variant="outline">
              View Menu
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 