// src/app/contact/page.tsx
'use client';

import { Header } from "@/components/layout/header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2">This is a simple contact page.</p>
        </div>
      </div>
    </>
  );
}
