import { Header } from "@/components/layout/header";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { db } from '@vercel/postgres';
import { featuredDishes } from '@/data/sample-menu';

async function getProducts() {
  try {
    // Try menu_items table first (new structure)
    const { rows: menuItems } = await db.sql`SELECT * FROM menu_items ORDER BY category, name`;
    if (menuItems && menuItems.length > 0) {
      console.log('Menu items fetched from database:', menuItems.length);
      return menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.image_url,
        category: item.category,
        price: item.price,
        sizeOptions: item.size_options || [{ size: 'Regular', price: item.price / 100, portionInfo: 'Serves 1' }],
      }));
    }

    // Fallback to products table (old structure)
    const { rows: products } = await db.sql`SELECT * FROM products`;
    if (products && products.length > 0) {
      console.log('Products fetched from database:', products.length);
      return products;
    }

    throw new Error('No items found in database');
  } catch (error) {
    console.error('Failed to fetch from database:', error);
    console.log('Using fallback menu data');
    // Return featured dishes as fallback
    return featuredDishes;
  }
}

export default async function MenuPage() {
  const products = await getProducts();

  // Process the items to ensure they have the correct structure
  const menuItems = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || 'Delicious Nigerian cuisine',
    imageUrl: product.imageUrl || '/images/dishes/jollof-rice.jpg',
    category: product.category || 'Main Dishes',
    sizeOptions: product.sizeOptions || [{ size: 'Regular', price: (product.price || 0) / 100, portionInfo: 'Serves 1' }],
    defaultSizeIndex: product.defaultSizeIndex || 0,
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
