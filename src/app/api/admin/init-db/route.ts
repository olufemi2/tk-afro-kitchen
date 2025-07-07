import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import { featuredDishes } from '@/data/sample-menu';

export async function POST() {
  try {
    console.log('🚀 Starting database initialization...');

    // Create menu_items table
    await db.sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        category VARCHAR(255),
        image_url VARCHAR(500),
        size_options JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Clear existing menu items
    await db.sql`DELETE FROM menu_items`;

    // Insert all featured dishes
    let insertedCount = 0;
    const errors = [];

    for (const dish of featuredDishes) {
      try {
        await db.sql`
          INSERT INTO menu_items (id, name, description, price, category, image_url, size_options)
          VALUES (
            ${dish.id},
            ${dish.name},
            ${dish.description},
            ${dish.sizeOptions[0].price * 100},
            ${dish.category},
            ${dish.imageUrl},
            ${JSON.stringify(dish.sizeOptions)}
          )
        `;
        insertedCount++;
      } catch (error: any) {
        errors.push({ dish: dish.name, error: error.message });
      }
    }

    // Verify the data
    const { rows } = await db.sql`SELECT COUNT(*) as count FROM menu_items`;

    return NextResponse.json({
      success: true,
      message: `Database initialized successfully`,
      stats: {
        itemsInserted: insertedCount,
        totalInDatabase: rows[0].count,
        errors: errors.length > 0 ? errors : null,
      },
    });

  } catch (error: any) {
    console.error('❌ Database initialization failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}