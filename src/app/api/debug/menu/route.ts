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
    // Test database connection
    const { rows } = await db.sql`SELECT COUNT(*) as count FROM products`;
    debug.database.hasConnection = true;
    debug.database.productCount = rows[0]?.count || 0;
    
    // Get sample products if any
    if (debug.database.productCount > 0) {
      const { rows: products } = await db.sql`SELECT id, name FROM products LIMIT 3`;
      debug.database.sampleProducts = products;
    }
  } catch (error: any) {
    debug.database.error = error.message;
    console.error('Database debug error:', error);
  }

  return NextResponse.json(debug);
}