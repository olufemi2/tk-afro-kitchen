'use client';

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-orange-900/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-orange-400">TK Afro Kitchen</h3>
            <p className="text-sm text-slate-400">
              Premier African food catering and kitchen service based in Milton Keynes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-orange-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-orange-400">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@tkafrokitchen.com" className="hover:text-orange-400 transition-colors">
                  info@tkafrokitchen.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4" />
                <span>Milton Keynes, UK</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-orange-400">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/tkafrokitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white hover:from-orange-600 hover:to-yellow-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/tkafrokitchen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white hover:from-orange-600 hover:to-yellow-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-orange-900/20 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} TK Afro Kitchen. All rights reserved.</p>
          <p className="mt-2">
            5-star food hygiene certified • Fully insured • UK mainland delivery
          </p>
        </div>
      </div>
    </footer>
  );
} 