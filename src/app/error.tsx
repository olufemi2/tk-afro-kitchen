'use client';

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-6">
            <h1 className="text-9xl font-bold text-orange-500">500</h1>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Something Went Wrong
            </h2>
            
            <div className="bg-[#1e1e1e] p-6 rounded-lg border border-orange-900/20">
              <p className="text-lg mb-4 text-slate-200">
                An unexpected error occurred.
              </p>
              <p className="text-slate-400">
                Our team has been notified and we're working to fix the issue.
              </p>
            </div>

            <div className="pt-8 space-x-4">
              <Button 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                onClick={reset}
              >
                Try Again
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a] text-slate-200"
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
