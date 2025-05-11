'use client';

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="footer-title">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-orange-400" />
                <span className="footer-text">020 1234 5678</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-orange-400" />
                <span className="footer-text">info@tkafro.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-400" />
                <span className="footer-text">London, UK</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/menu" className="block footer-text">Menu</Link>
              <Link href="/frozen" className="block footer-text">Frozen Food</Link>
              <Link href="/catering" className="block footer-text">Catering</Link>
              <Link href="/about" className="block footer-text">About Us</Link>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="footer-title">Opening Hours</h3>
            <div className="space-y-2 text-slate-300">
              <p>Monday - Friday: 11am - 10pm</p>
              <p>Saturday: 12pm - 10pm</p>
              <p>Sunday: 12pm - 9pm</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="footer-title">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover-scale text-orange-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover-scale text-orange-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover-scale text-orange-400">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-orange-900/20 text-center text-slate-400">
          <p>© 2024 TK Afro Kitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 