import { Header } from "@/components/layout/header";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { db } from '@vercel/postgres';
import { featuredDishes } from '@/data/sample-menu';

async function getProducts() {
  try {
    const { rows } = await db.sql`SELECT * FROM products`;
    console.log('Database products fetched:', rows.length);
    return rows;
  } catch (error) {
    console.error('Failed to fetch products from database:', error);
    console.log('Using fallback menu data');
    // Return featured dishes as fallback
    return featuredDishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      price: dish.sizeOptions[0].price * 100, // Convert to pence for consistency
    }));
  }
}

export default async function MenuPage() {
  const products = await getProducts();

  // If no products from DB, use featured dishes directly
  const menuItems = products.length === 0 ? featuredDishes : products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || 'Delicious Nigerian cuisine',
    imageUrl: product.imageUrl || '/images/dishes/jollof-rice.jpg',
    category: product.category || 'Main Dishes',
    sizeOptions: product.sizeOptions || [{ size: 'Regular', price: product.price / 100, portionInfo: 'Serves 1' }],
    defaultSizeIndex: 0,
  }));

  const menuSections = [
    {
      id: 'all-dishes',
      title: 'All Dishes',
      description: 'Explore our delicious offerings',
      items: menuItems,
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
          </div>
        </section>

        <MenuSearch menuSections={menuSections} />
      </div>
    </>
  );
}
