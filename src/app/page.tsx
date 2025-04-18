import { Header } from "@/components/layout/header";
import { CategoryCard } from "@/components/food/category-card";
import { FoodCard } from "@/components/food/food-card";
import { categories, featuredDishes } from "@/data/sample-menu";

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative h-[500px] bg-stone-100">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Authentic Nigerian Cuisine
              <br />
              Delivered to Your Door
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Experience the rich flavors of Nigeria with our carefully crafted dishes,
              available for delivery across the UK or local pickup.
            </p>
            <div className="flex gap-4">
              <a
                href="/menu"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                View Menu
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Dishes */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Featured Dishes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDishes.map((dish) => (
                <FoodCard key={dish.id} {...dish} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
