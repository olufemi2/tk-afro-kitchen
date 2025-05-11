'use client';
 
import { Button } from "@/components/ui/button";
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-4xl font-bold text-orange-500 mb-4">Something went wrong!</h1>
            <p className="text-gray-600 mb-6">
              We've encountered a critical error. Our team has been notified.
            </p>
            <Button
              onClick={() => reset()}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
