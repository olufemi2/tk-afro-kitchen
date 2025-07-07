
import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  try {
    // Create the sellers table
    await db.sql`
      CREATE TABLE IF NOT EXISTS sellers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        stripe_account_id VARCHAR(255) UNIQUE,
        stripe_account_status VARCHAR(50) DEFAULT 'pending'
      );
    `;

    // Create the products table
    await db.sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        price INT NOT NULL, -- Price in pence
        seller_id UUID NOT NULL REFERENCES sellers(id)
      );
    `;

    console.log('✅ Database tables created successfully.');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  }
}

setupDatabase();
