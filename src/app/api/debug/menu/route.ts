import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import { featuredDishes } from '@/data/sample-menu';

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      hasConnection: false,
      error: null,
      productCount: 0,
      menuItemsCount: 0,
      menuItemsError: null,
      productError: null,
      sampleMenuItems: null,
      sampleProducts: null,
    },
    fallbackData: {
      available: true,
      itemCount: featuredDishes.length,
      sampleItems: featuredDishes.slice(0, 3).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
      })),
    },
  };

  try {
    // Test database connection and check both tables
    debug.database.hasConnection = true;
    
    // Check menu_items table
    try {
      const { rows: menuItems } = await db.sql`SELECT COUNT(*) as count FROM menu_items`;
      debug.database.menuItemsCount = menuItems[0]?.count || 0;
      
      if (debug.database.menuItemsCount > 0) {
        const { rows: sampleMenuItems } = await db.sql`SELECT id, name, category FROM menu_items LIMIT 3`;
        debug.database.sampleMenuItems = sampleMenuItems;
      }
    } catch (menuError: any) {
      debug.database.menuItemsError = menuError.message;
    }
    
    // Check legacy products table
    try {
      const { rows: products } = await db.sql`SELECT COUNT(*) as count FROM products`;
      debug.database.productCount = products[0]?.count || 0;
      
      if (debug.database.productCount > 0) {
        const { rows: sampleProducts } = await db.sql`SELECT id, name FROM products LIMIT 3`;
        debug.database.sampleProducts = sampleProducts;
      }
    } catch (productError: any) {
      debug.database.productError = productError.message;
    }

  } catch (error: any) {
    debug.database.hasConnection = false;
    debug.database.error = error.message;
    console.error('Database debug error:', error);
  }

  return NextResponse.json(debug);
}