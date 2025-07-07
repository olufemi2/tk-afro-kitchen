
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  try {
    // Create a test seller
    const sellerResult = await db.sql`
      INSERT INTO sellers (name, email, stripe_account_id, stripe_account_status)
      VALUES ('Test Seller', 'seller@example.com', 'acct_1P6ZzGPCMLP5p3jS', 'active')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `;

    // Get the seller ID
    const sellerId = sellerResult.rows[0]?.id;

    if (sellerId) {
      // Create a test product linked to the seller
      await db.sql`
        INSERT INTO products (name, price, seller_id)
        VALUES ('Jollof Rice', 2500, ${sellerId})
        ON CONFLICT (name) DO NOTHING;
      `;

      console.log('✅ Database seeded with test data.');
    } else {
      console.log('✅ Test data already exists.');
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seedDatabase();
