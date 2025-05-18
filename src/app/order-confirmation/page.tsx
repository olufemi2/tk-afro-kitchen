'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderDetails {
  orderId: string;
  status: string;
  amount: string;
  timestamp: string;
}

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const storedDetails = localStorage.getItem('lastOrderDetails');
    if (storedDetails) {
      setOrderDetails(JSON.parse(storedDetails));
      // Clear the stored details after reading
      localStorage.removeItem('lastOrderDetails');
    }
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-24 w-24 text-green-400" />
            </div>
            
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Order Confirmed!
            </h1>
            
            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-orange-900/20">
              <p className="text-lg mb-4 text-slate-200">
                Thank you for your order. We've received your order and will begin preparing it shortly.
              </p>
              {orderDetails && (
                <div className="text-left space-y-2 text-slate-300 mb-4">
                  <p><span className="text-orange-400">Order ID:</span> {orderDetails.orderId}</p>
                  <p><span className="text-orange-400">Amount:</span> £{orderDetails.amount}</p>
                  <p><span className="text-orange-400">Status:</span> {orderDetails.status}</p>
                  <p><span className="text-orange-400">Date:</span> {new Date(orderDetails.timestamp).toLocaleString()}</p>
                </div>
              )}
              <p className="text-slate-400">
                You will receive an email confirmation with your order details and tracking information.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold text-orange-400">What's Next?</h2>
              <div className="text-left space-y-2 text-slate-300">
                <p>1. We'll prepare your order with care and attention to detail</p>
                <p>2. You'll receive updates about your order status via email</p>
                <p>3. Our delivery partner will ensure your food arrives fresh and hot</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                asChild 
                variant="outline" 
                className="border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a] text-slate-200"
              >
                <Link href="/menu">
                  Order More
                </Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                <Link href="/">
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 