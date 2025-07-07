
/**
 * Automated Stripe Connect Integration
 * Handles Stripe Connect Express onboarding, payment processing, and webhooks.
 */

import Stripe from 'stripe';

interface StripeConnectConfig {
  apiKey: string;
  webhookSecret: string;
  currency: string;
  platformName: string;
  applicationFeePercent: number;
}

export class StripeConnectIntegration {
  private stripe: Stripe;
  private config: StripeConnectConfig;

  constructor(config: StripeConnectConfig) {
    this.config = config;
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

  /**
   * Creates a Stripe Connect account for a new seller and returns an onboarding link.
   * @param sellerDetails - Information about the seller.
   */
  async createConnectAccountLink(sellerDetails: { email: string; businessName: string; }) {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        email: sellerDetails.email,
        business_type: 'company',
        company: {
          name: sellerDetails.businessName,
        },
      });

      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/stripe/connect/reauth`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/stripe/connect/return`,
        type: 'account_onboarding',
      });

      return { success: true, accountId: account.id, url: accountLink.url };
    } catch (error: any) {
      console.error('❌ Failed to create Stripe Connect account link:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Creates a Payment Intent for an order, routing the payment to the seller's
   * connected account and taking an application fee.
   * @param orderData - The order details.
   * @param sellerStripeAccountId - The Stripe Account ID of the seller.
   */
  async createPaymentIntentForOrder(
    orderData: {
      amount: number; // Total order amount in the smallest currency unit (e.g., pence)
      customerEmail: string;
    },
    sellerStripeAccountId: string
  ) {
    try {
      const applicationFeeAmount = Math.round(orderData.amount * (this.config.applicationFeePercent / 100));

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: orderData.amount,
        currency: this.config.currency.toLowerCase(),
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: sellerStripeAccountId,
        },
        customer: await this.getOrCreateCustomer(orderData.customerEmail),
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      console.error('❌ Failed to create Connect payment intent:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handles incoming Stripe webhook events, specifically for Connect.
   * @param payload - The raw webhook payload.
   * @param signature - The 'Stripe-Signature' header.
   */
  async handleWebhookEvent(payload: string, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );

      console.log('📥 Processing Connect webhook event:', event.type);

      switch (event.type) {
        case 'account.updated':
          this.handleAccountUpdated(event.data.object as Stripe.Account);
          break;
        // Add other Connect-related event handlers here
        default:
          console.log(`🔍 Unhandled Connect event type: ${event.type}`);
      }

      return { success: true, data: event };
    } catch (error: any) {
      console.error('❌ Webhook processing failed:', error);
      return { success: false, error: error.message };
    }
  }

  private handleAccountUpdated(account: Stripe.Account) {
    console.log('✅ Account updated:', account.id);
    // Logic to update the seller's status in your database,
    // e.g., to mark them as fully onboarded and ready for payments.
  }

  private async getOrCreateCustomer(email: string): Promise<string> {
    const customers = await this.stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      return customers.data[0].id;
    }
    const newCustomer = await this.stripe.customers.create({ email });
    return newCustomer.id;
  }
}

/**
 * Factory function to create a configured Stripe Connect integration instance.
 */
export function createStripeConnectIntegration(): StripeConnectIntegration {
  const config: StripeConnectConfig = {
    apiKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_CONNECT_WEBHOOK_SECRET!, // Note: Different secret
    currency: 'GBP',
    platformName: 'TK Afro Kitchen',
    applicationFeePercent: 10, // Example: 10% fee
  };

  if (!process.env.STRIPE_CONNECT_WEBHOOK_SECRET) {
    console.warn('⚠️ STRIPE_CONNECT_WEBHOOK_SECRET is not set. Webhook validation will fail.');
  }

  return new StripeConnectIntegration(config);
}
