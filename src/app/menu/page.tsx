import { Header } from "@/components/layout/header";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { db } from '@vercel/postgres';

async function getProducts() {
  try {
    const { rows } = await db.sql`SELECT * FROM products`;
    return rows;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
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
          </div>
        </section>

        <MenuSearch menuSections={menuSections} />
      </div>
    </>
  );
}
