import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Add an item to cart from menu page
   */
  async addItemToCart(): Promise<void> {
    await this.page.goto('/menu');
    
    const addToCartBtn = this.page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Open cart modal
   */
  async openCart(): Promise<void> {
    const cartButton = this.page.locator('button').filter({ has: this.page.locator('svg') }).first();
    await cartButton.click();
    await this.page.waitForTimeout(500);
    await expect(this.page.locator('text=Cart, text=Your Cart')).toBeVisible();
  }

  /**
   * Navigate to checkout with items in cart
   */
  async proceedToCheckout(): Promise<void> {
    await this.addItemToCart();
    await this.openCart();
    
    const checkoutBtn = this.page.locator('button:has-text("Checkout"), button:has-text("Proceed to Checkout")').first();
    await checkoutBtn.click();
    await this.page.waitForURL('**/checkout', { timeout: 10000 });
  }

  /**
   * Fill delivery details form
   */
  async fillDeliveryDetails(details: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    postcode?: string;
    city?: string;
  } = {}): Promise<void> {
    const defaultDetails = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '07123456789',
      address: '123 Test Street',
      postcode: 'SW1A 1AA',
      city: 'London',
      ...details
    };

    const fields = [
      { selector: 'input[name="fullName"], input[placeholder*="name" i]', value: defaultDetails.name },
      { selector: 'input[name="email"], input[type="email"]', value: defaultDetails.email },
      { selector: 'input[name="phone"], input[type="tel"]', value: defaultDetails.phone },
      { selector: 'input[name="address"], input[placeholder*="address" i]', value: defaultDetails.address },
      { selector: 'input[name="postcode"], input[placeholder*="postcode" i]', value: defaultDetails.postcode },
      { selector: 'input[name="city"], input[placeholder*="city" i]', value: defaultDetails.city }
    ];

    for (const field of fields) {
      const input = this.page.locator(field.selector).first();
      if (await input.isVisible()) {
        await input.fill(field.value);
      }
    }
  }

  /**
   * Mock successful payment for testing
   */
  async mockSuccessfulPayment(): Promise<void> {
    // Mock Stripe API calls
    await this.page.route('**/api/create-payment-intent', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          client_secret: 'pi_test_1234567890_secret_test',
          id: 'pi_test_1234567890'
        })
      });
    });

    // Mock Stripe JavaScript SDK
    await this.page.addInitScript(() => {
      (window as any).Stripe = () => ({
        confirmCardPayment: async () => ({
          paymentIntent: {
            id: 'pi_test_1234567890',
            status: 'succeeded',
            amount: 5000,
            currency: 'gbp'
          }
        }),
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
            unmount: () => {}
          }),
          getElement: () => ({})
        })
      });
    });
  }

  /**
   * Simulate successful payment completion
   */
  async simulatePaymentSuccess(): Promise<void> {
    await this.page.evaluate(() => {
      const orderDetails = {
        orderId: 'test_order_' + Date.now(),
        status: 'COMPLETED',
        amount: '50.00',
        timestamp: new Date().toISOString(),
        customerInfo: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '07123456789'
        }
      };
      
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      
      // Trigger redirect based on browser type
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isSafari) {
        window.location.assign('/success?orderId=' + orderDetails.orderId + '&amount=' + orderDetails.amount);
      } else {
        window.location.href = '/success';
      }
    });
  }

  /**
   * Check if current browser is Safari
   */
  async isSafari(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    });
  }

  /**
   * Check if current browser is mobile
   */
  async isMobile(): Promise<boolean> {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(url: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL(`**${url}`, { timeout });
    await expect(this.page).toHaveURL(new RegExp(url));
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}-${Date.now()}.png` });
  }

  /**
   * Wait for element to be visible and ready
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible({ timeout });
  }

  /**
   * Check console for errors
   */
  async checkConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    return errors;
  }

  /**
   * Complete full checkout flow for testing
   */
  async completeCheckoutFlow(): Promise<void> {
    await this.proceedToCheckout();
    await this.fillDeliveryDetails();
    
    // Continue to payment
    const continueBtn = this.page.locator('button:has-text("Continue"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await this.page.waitForTimeout(2000);
    }
  }
}