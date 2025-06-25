'use client';

import { Header } from "@/components/layout/header";
import OptimizedCheckout from "@/components/checkout/OptimizedCheckout";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <OptimizedCheckout />
    </>
  );
}