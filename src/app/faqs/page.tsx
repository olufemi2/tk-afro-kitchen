'use client';

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Delivery",
    question: "WHERE DO YOU DELIVER TO?",
    answer: "We currently deliver to UK Mainland only."
  },
  {
    category: "Orders",
    question: "IS THERE A MINIMUM ORDER AMOUNT?",
    answer: "Yes there is, the minimum order is £70."
  },
  {
    category: "Payment",
    question: "HOW DO I PAY?",
    answer: "You can make secure payment online using your debit or credit card via Paypal OR with Paypal directly if you have a Paypal account."
  },
  {
    category: "Delivery",
    question: "DO I NEED TO ORDER IN ADVANCE?",
    answer: "Yes. We currently deliver on Tuesdays to Saturdays only. For express delivery, please allow 72hrs & orders before 12pm. Please note, we do not deliver on public holidays or the next working day after a public holiday."
  },
  {
    category: "Food Quality",
    question: "IS THE FOOD FRESHLY MADE?",
    answer: "Yes. All our meals are cooked fresh to order."
  },
  {
    category: "Delivery",
    question: "HOW WILL MY FOOD ARRIVE?",
    answer: "Your food will arrive in plastic bowls that will be transported in a styrofoam box with an ice gel pack. This is to keep the food chilled."
  },
  {
    category: "Delivery",
    question: "HOW LONG WILL MY ORDER TAKE TO ARRIVE?",
    answer: "Our food is freshly made and delivered same day to locations within Milton Keynes. All other deliveries outside Milton Keynes have a delivery time of 72 hours (3 days)."
  },
  {
    category: "Food Storage",
    question: "HOW DO I STORE MY FOOD?",
    answer: "As soon as the food is delivered, heat up in the microwave if you are ready to eat straight away or store in the fridge or freezer for later."
  },
  {
    category: "Food Quality",
    question: "ARE THERE ANY PRESERVATIVES IN THE FOOD?",
    answer: "No there isn't. We cook our food fresh. Once cooked and slightly cooled, we chill immediately to retain the freshness. It will be delivered to you chilled in an insulated box, ready to be re-heated or stored in your fridge or freezer."
  },
  {
    category: "Delivery",
    question: "IS MY ORDER DELIVERED TO MY DOOR?",
    answer: "Yes. your order will be delivered straight to your door."
  },
  {
    category: "Delivery",
    question: "DO I NEED TO BE HOME TO RECEIVE MY DELIVERY?",
    answer: "Yes. We require that there's someone at home to receive your order, this is because your order will arrive in an insulated box that will keep the food cool for a few hours after delivery and we advise removing the food from the box and putting it in the fridge or freezer as soon as possible after it has been delivered if it is not to be eaten immediately. If no arrangement is made for someone to be home on the day of the arranged delivery, unfortunately we will not be able to re-arrange or replace your order."
  },
  {
    category: "Orders",
    question: "CAN I REARRANGE MY DELIVERY DATE/DAY?",
    answer: "Yes. When your order is confirmed, you can change the delivery day/date up to 2 days before your order is due to be delivered. Unfortunately, we are unable to make any changes to your order and delivery date beyond this point."
  },
  {
    category: "Orders",
    question: "CAN I PLACE CUSTOMISED ORDERS?",
    answer: "Yes, we can provide made to order food service for any meal types not captured on our menu list. Please leave a message on our board for any custom orders and we will get back to you."
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
        <section className="relative overflow-hidden bg-[#1e1e1e] py-16 mb-12">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions about our services, delivery, and food preparation
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
                        className="bg-[#1e1e1e] rounded-lg border border-orange-900/20 overflow-hidden"
                      >
                        <button
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#242424] transition-colors"
                          onClick={() => toggleFAQ(index)}
                        >
                          <span className="font-medium text-slate-200">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-orange-400 transition-transform ${
                              openFAQs.includes(index) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFAQs.includes(index) && (
                          <div className="px-6 pb-4 text-slate-400">
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
          <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl p-12 text-center border border-orange-900/20">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Still Have Questions?
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              We're here to help! Contact us for any additional information
            </p>
            <Button 
              asChild 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
} 