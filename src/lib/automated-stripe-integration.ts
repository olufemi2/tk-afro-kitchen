/**
 * Automated Stripe Integration Workflows
 * Provides MCP-inspired automation for Stripe setup and menu synchronization
 */

import Stripe from 'stripe';

interface StripeConfig {
  apiKey: string;
  webhookSecret: string;
  currency: string;
  businessName: string;
}

interface MenuItemSync {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  sizeOptions: {
    size: string;
    price: number;
    portionInfo: string;
  }[];
}

export class AutomatedStripeIntegration {
  private stripe: Stripe;
  private config: StripeConfig;

  constructor(config: StripeConfig) {
    this.config = config;
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  /**
   * MCP-Inspired: Automated Stripe Account Setup
   * Configures webhooks, products, and basic settings automatically
   */
  async autoSetupStripe() {
    console.log('🚀 Starting automated Stripe setup...');
    
    try {
      // 1. Verify account capabilities
      const account = await this.stripe.accounts.retrieve();
      console.log('✅ Stripe account verified:', account.business_profile?.name);

      // 2. Auto-configure webhooks
      await this.setupWebhooks();

      // 3. Create business profile if needed
      await this.updateBusinessProfile();

      // 4. Setup tax configuration
      await this.setupTaxConfiguration();

      // 5. Create initial product categories
      await this.createProductCategories();

      console.log('✅ Automated Stripe setup completed successfully!');
      return { success: true, message: 'Stripe account configured' };

    } catch (error: any) {
      console.error('❌ Stripe setup failed:', error);
      return { success: false, error: error.message || 'Setup failed' };
    }
  }

  /**
   * Automated webhook endpoint creation
   */
  private async setupWebhooks() {
    const webhookEndpoints = [
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.dispute.created',
      'invoice.payment_succeeded',
      'customer.subscription.created'
    ];

    try {
      // Check existing webhooks
      const existingWebhooks = await this.stripe.webhookEndpoints.list();
      
      if (existingWebhooks.data.length === 0) {
        // Create new webhook endpoint
        const webhook = await this.stripe.webhookEndpoints.create({
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/stripe`,
          enabled_events: webhookEndpoints as Stripe.WebhookEndpointCreateParams.EnabledEvent[]
        });

        console.log('✅ Webhook endpoint created:', webhook.url);
        
        // Store webhook secret for environment variables
        console.log('📝 Add this to your environment variables:');
        console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
      } else {
        console.log('✅ Webhook endpoints already configured');
      }
    } catch (error: any) {
      console.error('❌ Webhook setup failed:', error);
      throw error;
    }
  }

  /**
   * Update Stripe business profile automatically
   */
  private async updateBusinessProfile() {
    try {
      await this.stripe.accounts.update('acct_current', {
        business_profile: {
          name: this.config.businessName,
          support_email: process.env.SUPPORT_EMAIL,
          support_url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
          url: process.env.NEXT_PUBLIC_SITE_URL,
          mcc: '5812', // Eating places, restaurants
        }
      });
      console.log('✅ Business profile updated');
    } catch (error: any) {
      console.warn('⚠️ Business profile update skipped:', error.message);
    }
  }

  /**
   * Automated tax configuration for UK business
   */
  private async setupTaxConfiguration() {
    try {
      // Set up UK tax settings
      await this.stripe.tax.settings.update({
        defaults: {
          tax_behavior: 'inclusive',
          tax_code: 'txcd_20030000', // Restaurant and catering services
        }
      });
      console.log('✅ Tax configuration set for UK business');
    } catch (error: any) {
      console.warn('⚠️ Tax configuration skipped:', error.message);
    }
  }

  /**
   * Create product categories in Stripe
   */
  private async createProductCategories() {
    const categories = [
      'Rice Dishes',
      'Soups & Stews', 
      'Protein Dishes',
      'Side Dishes',
      'Snacks & Pastries',
      'Fish Platters'
    ];

    for (const category of categories) {
      try {
        await this.stripe.products.create({
          name: `${this.config.businessName} - ${category}`,
          type: 'service',
          metadata: {
            category: category,
            auto_created: 'true'
          }
        });
        console.log(`✅ Created category: ${category}`);
      } catch (error: any) {
        if (error.code !== 'resource_already_exists') {
          console.warn(`⚠️ Category creation skipped for ${category}:`, error.message);
        }
      }
    }
  }

  /**
   * Automated menu synchronization with Stripe products
   */
  async syncMenuWithStripe(menuItems: MenuItemSync[]) {
    console.log('🔄 Syncing menu items with Stripe...');
    
    const results = {
      created: 0,
      updated: 0,
      errors: 0
    };

    for (const item of menuItems) {
      try {
        await this.syncSingleMenuItem(item);
        results.created++;
      } catch (error: any) {
        console.error(`❌ Failed to sync ${item.name}:`, error);
        results.errors++;
      }
    }

    console.log('✅ Menu sync completed:', results);
    return results;
  }

  /**
   * Sync individual menu item with Stripe
   */
  private async syncSingleMenuItem(item: MenuItemSync) {
    // Create or update Stripe product
    const productId = `menu_${item.id}`;
    
    let product: Stripe.Product;
    
    try {
      // Try to retrieve existing product
      product = await this.stripe.products.retrieve(productId);
      
      // Update existing product
      product = await this.stripe.products.update(productId, {
        name: item.name,
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: {
          category: item.category,
          menu_item_id: item.id,
          last_updated: new Date().toISOString()
        }
      });
      
    } catch (error: any) {
      // Create new product if it doesn't exist
      product = await this.stripe.products.create({
        id: productId,
        name: item.name,
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : [],
        metadata: {
          category: item.category,
          menu_item_id: item.id,
          created_at: new Date().toISOString()
        }
      });
    }

    // Create or update prices for each size option
    for (const [index, sizeOption] of item.sizeOptions.entries()) {
      const priceId = `price_${item.id}_${index}`;
      
      try {
        // Create new price (Stripe prices are immutable)
        await this.stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(sizeOption.price * 100), // Convert to pence
          currency: this.config.currency.toLowerCase(),
          metadata: {
            size: sizeOption.size,
            portion_info: sizeOption.portionInfo,
            menu_item_id: item.id,
            size_index: index.toString()
          }
        });
      } catch (error: any) {
        // Price might already exist, which is okay
        if (error.code !== 'resource_already_exists') {
          throw error;
        }
      }
    }
  }

  /**
   * Automated payment intent creation with menu item context
   */
  async createPaymentIntentForOrder(orderData: {
    items: { menuItemId: string; sizeIndex: number; quantity: number }[];
    customerDetails: {
      name: string;
      email: string;
      phone?: string;
    };
    deliveryDetails?: {
      address: string;
      postcode: string;
      city: string;
    };
  }) {
    try {
      // Calculate total amount
      let totalAmount = 0;
      const lineItems: any[] = [];

      for (const orderItem of orderData.items) {
        // Get product and price from Stripe
        const product = await this.stripe.products.retrieve(`menu_${orderItem.menuItemId}`);
        
        const prices = await this.stripe.prices.list({
          product: product.id
        });

        if (prices.data.length > 0) {
          const price = prices.data[0];
          const itemTotal = price.unit_amount! * orderItem.quantity;
          totalAmount += itemTotal;

          lineItems.push({
            price: price.id,
            quantity: orderItem.quantity
          });
        }
      }

      // Create or retrieve customer
      let customer: Stripe.Customer;
      
      const existingCustomers = await this.stripe.customers.list({
        email: orderData.customerDetails.email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await this.stripe.customers.create({
          name: orderData.customerDetails.name,
          email: orderData.customerDetails.email,
          phone: orderData.customerDetails.phone,
          metadata: {
            source: 'tk_afro_kitchen_website'
          }
        });
      }

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: totalAmount,
        currency: this.config.currency.toLowerCase(),
        customer: customer.id,
        metadata: {
          order_type: 'menu_order',
          customer_name: orderData.customerDetails.name,
          delivery_required: orderData.deliveryDetails ? 'true' : 'false'
        },
        shipping: orderData.deliveryDetails ? {
          name: orderData.customerDetails.name,
          address: {
            line1: orderData.deliveryDetails.address,
            city: orderData.deliveryDetails.city,
            postal_code: orderData.deliveryDetails.postcode,
            country: 'GB'
          }
        } : undefined,
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        success: true,
        paymentIntent: paymentIntent,
        clientSecret: paymentIntent.client_secret
      };

    } catch (error: any) {
      console.error('❌ Payment intent creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Automated webhook event processing
   */
  async processWebhookEvent(event: Stripe.Event) {
    console.log('📥 Processing webhook event:', event.type);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'charge.dispute.created':
          await this.handleChargeback(event.data.object as Stripe.Dispute);
          break;
          
        default:
          console.log(`🔍 Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ Webhook processing failed:', error);
      return { success: false, error: error.message || 'Webhook processing failed' };
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    console.log('✅ Payment succeeded:', paymentIntent.id);
    
    // Auto-send order confirmation email
    // Auto-notify kitchen staff
    // Auto-update inventory if applicable
    // Auto-create delivery schedule if needed
    
    // Store order in database
    const orderData = {
      stripe_payment_intent_id: paymentIntent.id,
      customer_id: paymentIntent.customer,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'confirmed',
      metadata: paymentIntent.metadata,
      created_at: new Date()
    };

    console.log('📦 Order data prepared for storage:', orderData);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    // Auto-notify customer of payment failure
    // Auto-log failure reason for analysis
    // Auto-trigger retry flow if appropriate
  }

  private async handleChargeback(dispute: Stripe.Dispute) {
    console.log('⚠️ Chargeback created for charge:', dispute.charge);
    
    // Auto-notify admin team
    // Auto-gather order documentation
    // Auto-prepare dispute response materials
  }

  /**
   * Automated analytics and reporting
   */
  async generateAutomatedReports() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    try {
      // Revenue analytics
      const charges = await this.stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });

      const analytics = {
        totalRevenue: charges.data.reduce((sum, charge) => sum + charge.amount, 0) / 100,
        totalOrders: charges.data.length,
        averageOrderValue: charges.data.length > 0 ? 
          (charges.data.reduce((sum, charge) => sum + charge.amount, 0) / 100) / charges.data.length : 0,
        successRate: (charges.data.filter(charge => charge.status === 'succeeded').length / charges.data.length) * 100
      };

      console.log('📊 Automated analytics generated:', analytics);
      return analytics;

    } catch (error: any) {
      console.error('❌ Analytics generation failed:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create configured Stripe integration
 */
export function createAutomatedStripeIntegration(): AutomatedStripeIntegration {
  const config: StripeConfig = {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    currency: 'GBP',
    businessName: 'TK Afro Kitchen'
  };

  return new AutomatedStripeIntegration(config);
}

/**
 * Utility functions for common Stripe operations
 */
export const StripeUtils = {
  // Convert price to Stripe amount (pence)
  toStripeAmount: (priceInPounds: number): number => Math.round(priceInPounds * 100),
  
  // Convert Stripe amount to price (pounds)
  fromStripeAmount: (amountInPence: number): number => amountInPence / 100,
  
  // Format currency for display
  formatCurrency: (amountInPence: number, currency = 'GBP'): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amountInPence / 100);
  },
  
  // Validate webhook signature
  validateWebhookSignature: (payload: string, signature: string, secret: string): boolean => {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-05-28.basil' });
      stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }
};