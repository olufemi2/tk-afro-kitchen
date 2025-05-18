'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any stored cart data
    localStorage.removeItem('cart');
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-black">Payment Successful!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your order. We'll start preparing your food right away.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/menu')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
              >
                Order Again
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 