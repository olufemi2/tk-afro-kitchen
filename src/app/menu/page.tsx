import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { FoodCard } from "@/components/food/food-card";
import { db } from '@vercel/postgres';

async function getProducts() {
  const { rows } = await db.sql`SELECT * FROM products`;
  return rows;
}

export default async function MenuPage() {
  const products = await getProducts();

  const menuSections = [
    {
      id: 'all-dishes',
      title: 'All Dishes',
      description: 'Explore our delicious offerings',
      items: products.map(product => ({
        id: product.id,
        name: product.name,
        description: 'Delicious Nigerian cuisine', // Add a default description
        imageUrl: '/images/dishes/jollof-rice.jpg', // Add a default image
        category: 'Main Dishes', // Add a default category
        sizeOptions: [{ size: 'Regular', price: product.price / 100, portionInfo: 'Serves 1' }],
        defaultSizeIndex: 0,
      })),
    },
  ];
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pattern" />
          <div className="hero-content">
            <h1 className="hero-title">Our Menu</h1>
            <p className="hero-description">
              Discover the Rich Flavors of Nigeria
            </p>
            {/* Search Bar */}
            <div className="w-full max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-full pl-10 pr-4 py-3 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        <div className="container mx-auto px-4 py-8">
          {filteredMenuSections.map((section) => (
            <div key={section.id} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                <p className="text-gray-400">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <FoodCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    category={item.category}
                    sizeOptions={item.sizeOptions}
                    defaultSizeIndex={item.defaultSizeIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
