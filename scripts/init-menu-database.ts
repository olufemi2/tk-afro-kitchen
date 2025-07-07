import { db } from '@vercel/postgres';
import { featuredDishes } from '../src/data/sample-menu';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function initializeMenuDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // First, let's modify the products table to make seller_id optional
    // or create a simple products table for menu items
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
    console.log('✅ Menu items table created/verified');

    // Clear existing menu items for fresh start
    await db.sql`DELETE FROM menu_items`;
    console.log('🧹 Cleared existing menu items');

    // Insert all featured dishes
    let insertedCount = 0;
    for (const dish of featuredDishes) {
      try {
        await db.sql`
          INSERT INTO menu_items (id, name, description, price, category, image_url, size_options)
          VALUES (
            ${dish.id},
            ${dish.name},
            ${dish.description},
            ${dish.sizeOptions[0].price * 100}, -- Convert to pence
            ${dish.category},
            ${dish.imageUrl},
            ${JSON.stringify(dish.sizeOptions)}
          )
        `;
        insertedCount++;
        console.log(`✅ Added: ${dish.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${dish.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully initialized database with ${insertedCount} menu items!`);

    // Verify the data
    const { rows } = await db.sql`SELECT COUNT(*) as count FROM menu_items`;
    console.log(`📊 Total items in database: ${rows[0].count}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeMenuDatabase();