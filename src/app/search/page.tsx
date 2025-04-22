import { Suspense } from 'react';
import { Header } from "@/components/layout/header";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16">
        <Suspense fallback={
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </>
  );
}
