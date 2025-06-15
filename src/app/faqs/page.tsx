'use client';

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Getting Started",
    question: "How can I get my authentic Nigerian food?",
    answer: "We offer two convenient ways to enjoy our carefully crafted dishes: Free collection directly from our kitchen, or nationwide delivery to any UK postcode for just £27.99. Choose what works best for you!"
  },
  {
    category: "Collection",
    question: "Tell me about collection - is it really free?",
    answer: "Yes, collection is completely free! Simply select 'Collection/Pickup' during checkout, complete your order, and come collect your freshly prepared Nigerian delicacies directly from our kitchen. It's that simple!"
  },
  {
    category: "Nationwide Delivery",
    question: "Where do you deliver across the UK?",
    answer: "We bring authentic Nigerian cuisine to every corner of the UK! From London to Edinburgh, Manchester to Cardiff - any UK postcode for one flat rate of £27.99. No hidden fees, no postcode restrictions."
  },
  {
    category: "Nationwide Delivery",
    question: "How much does delivery cost?",
    answer: "Just £27.99 to anywhere in the UK - that's it! Whether you're ordering for yourself or hosting a dinner party, whether you're in central London or the Scottish Highlands, the price stays the same."
  },
  {
    category: "Orders",
    question: "Is there a minimum order amount?",
    answer: "No minimum for collection - order as little or as much as you like! For delivery, while there's no strict minimum, our £27.99 delivery fee makes it perfect for sharing with family and friends."
  },
  {
    category: "Payment",
    question: "How do I pay for my order?",
    answer: "We make payment simple and secure! Pay with any debit or credit card through our PayPal checkout - no PayPal account needed. Your payment details are fully protected."
  },
  {
    category: "Our Food",
    question: "Is your Nigerian food freshly prepared?",
    answer: "Absolutely! Every dish is cooked fresh to order using traditional Nigerian recipes passed down through generations. We use only the finest ingredients and never serve pre-made or frozen meals. Taste the difference authenticity makes!"
  },
  {
    category: "Nationwide Delivery",
    question: "How will my food arrive?",
    answer: "Your delicious Nigerian dishes arrive in premium food-safe containers, carefully sealed and insulated to preserve that fresh-cooked taste and aroma during the journey to your door."
  },
  {
    category: "Food Care",
    question: "How should I store and reheat my food?",
    answer: "Ready to eat? Simply microwave and enjoy! Want to save some for later? Store in the fridge for up to 3 days or freeze for up to 3 months. Always reheat until piping hot throughout - then savor every authentic bite!"
  },
  {
    category: "Our Food",
    question: "Do you use preservatives in your cooking?",
    answer: "Never! We honor traditional Nigerian cooking methods using only natural ingredients. Every dish is prepared fresh without artificial preservatives, maintaining the authentic flavors and wholesome goodness of true Nigerian cuisine."
  },
  {
    category: "Nationwide Delivery",
    question: "How long does delivery take?",
    answer: "Most UK addresses receive their orders within 1-3 working days. We'll send you tracking information once your freshly prepared meals are on their way, so you know exactly when to expect your Nigerian feast!"
  },
  {
    category: "Nationwide Delivery",
    question: "Do I need to be home when my order arrives?",
    answer: "We recommend being available to receive your order so you can enjoy it at its freshest! If you can't be home, please arrange for someone to accept the delivery - we want your Nigerian cuisine experience to be perfect."
  },
  {
    category: "Orders",
    question: "Can I change my order after placing it?",
    answer: "We'll do our best to help! Contact us immediately after placing your order if you need changes. If our kitchen hasn't started preparing your dishes yet, we can usually accommodate modifications."
  },
  {
    category: "Special Requirements",
    question: "Can you accommodate dietary requirements?",
    answer: "Of course! Nigerian cuisine offers wonderful options for various dietary needs - vegetarian, vegan, and allergy-specific requirements. Just let us know your needs in the order notes or contact us directly to discuss how we can craft the perfect meal for you."
  },
  {
    category: "Special Orders",
    question: "Do you cater for events and large orders?",
    answer: "We'd love to bring authentic Nigerian flavors to your celebration! Whether it's a family gathering, office party, or special event, we can create custom orders and larger quantities. Contact us to discuss your event needs and timing."
  }
];

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-orange-50 transition-colors"
      >
        <h3 className="font-semibold text-lg">{faq.question}</h3>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-6 pt-0 text-muted-foreground">
          {faq.answer}
        </div>
      </div>
    </Card>
  );
}

export default function FAQsPage() {
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content text-center">
            <h1 className="hero-title">
              Frequently Asked Questions
            </h1>
            <p className="hero-description">
              Everything you need to know about enjoying authentic Nigerian cuisine with TK Afro Kitchen
            </p>
          </div>
        </section>

        {/* FAQs Sections */}
        <div className="container mx-auto px-4">
          {categories.map((category, categoryIndex) => (
            <section key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                {category}
              </h2>
              <div className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map((faq, faqIndex) => {
                    const index = categoryIndex * 100 + faqIndex;
                    return (
                      <div
                        key={index}
                        className="card-base bg-[#1e1e1e]"
                      >
                        <button
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#242424] transition-all duration-300"
                          onClick={() => toggleFAQ(index)}
                        >
                          <span className="font-medium text-slate-200 text-lg">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-orange-400 transition-transform duration-300 ${
                              openFAQs.includes(index) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFAQs.includes(index) && (
                          <div className="px-6 pb-4 text-slate-300 leading-relaxed border-t border-orange-900/10 pt-4">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-16">
          <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-[#1e1e1e] border border-orange-900/20">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                Still Have Questions?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                We're passionate about sharing authentic Nigerian cuisine with you! Get in touch for any additional information about our dishes, services, or special requests.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button 
                  asChild 
                  size="lg"
                  variant="outline"
                  className="border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a] text-slate-200"
                >
                  <Link href="/menu">Browse Our Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 