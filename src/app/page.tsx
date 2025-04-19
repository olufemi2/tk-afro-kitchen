import { Header } from "@/components/layout/header";
import { CategoryCard } from "@/components/food/category-card";
import { FoodCard } from "@/components/food/food-card";
import { categories, featuredDishes } from "@/data/sample-menu";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative min-h-[600px] bg-[#1e1e1e] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-center py-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Authentic Nigerian Cuisine
              <br />
              Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
              Experience the rich flavors of Nigeria with our carefully crafted dishes,
              available for delivery across the UK or local pickup.
            </p>
            <div className="flex gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              >
                <a href="/menu">View Menu</a>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-orange-900/20 bg-[#242424] hover:bg-[#2a2a2a] text-slate-200"
              >
                <a href="/about">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Dishes */}
        <section className="py-16 relative overflow-hidden rounded-3xl mx-4 bg-[#1e1e1e] border border-orange-900/20">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 mix-blend-overlay" />
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
              Featured Dishes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDishes.slice(0, 6).map((dish) => (
                <FoodCard key={dish.id} {...dish} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
