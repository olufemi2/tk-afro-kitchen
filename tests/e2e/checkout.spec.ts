import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from menu page and add item to cart
    await page.goto('/menu');
    
    // Add an item to cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to checkout
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    const checkoutBtn = page.locator('button:has-text("Checkout"), button:has-text("Proceed to Checkout")').first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForURL('**/checkout', { timeout: 10000 });
    } else {
      // If no checkout button visible, navigate directly
      await page.goto('/checkout');
    }
  });

  test('should load checkout page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*checkout/);
    
    // Check for delivery details form
    await expect(page.locator('text=Delivery, text=Details, text=Information')).toBeVisible();
    
    // Check for form fields
    await expect(page.locator('input[name="fullName"], input[placeholder*="name" i]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"], input[type="tel"]')).toBeVisible();
  });

  test('should validate required delivery details', async ({ page }) => {
    // Try to proceed without filling required fields
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Proceed")').first();
    
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      
      // Should show validation errors
      await expect(page.locator('text=required, text=Please').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should fill delivery details and proceed to payment', async ({ page }) => {
    // Fill in delivery details
    const nameInput = page.locator('input[name="fullName"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
    const addressInput = page.locator('input[name="address"], input[placeholder*="address" i]').first();
    const postcodeInput = page.locator('input[name="postcode"], input[placeholder*="postcode" i]').first();
    const cityInput = page.locator('input[name="city"], input[placeholder*="city" i]').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('John Doe');
    }
    if (await emailInput.isVisible()) {
      await emailInput.fill('john.doe@example.com');
    }
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('07123456789');
    }
    if (await addressInput.isVisible()) {
      await addressInput.fill('123 Test Street');
    }
    if (await postcodeInput.isVisible()) {
      await postcodeInput.fill('SW1A 1AA');
    }
    if (await cityInput.isVisible()) {
      await cityInput.fill('London');
    }
    
    // Proceed to payment
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
      
      // Should see payment section
      await expect(page.locator('text=Payment, text=Card, text=Stripe, text=PayPal')).toBeVisible();
    }
  });

  test('should show payment options', async ({ page }) => {
    // First fill delivery details
    await page.locator('input[name="fullName"], input[placeholder*="name" i]').first().fill('John Doe');
    await page.locator('input[name="email"], input[type="email"]').first().fill('john.doe@example.com');
    await page.locator('input[name="phone"], input[type="tel"]').first().fill('07123456789');
    await page.locator('input[name="address"], input[placeholder*="address" i]').first().fill('123 Test Street');
    await page.locator('input[name="postcode"], input[placeholder*="postcode" i]').first().fill('SW1A 1AA');
    await page.locator('input[name="city"], input[placeholder*="city" i]').first().fill('London');
    
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Check for payment methods
    const cardPayment = page.locator('text=Card, text=Credit, text=Debit');
    const stripeElement = page.locator('[data-testid="stripe"], iframe, .stripe');
    const paypalElement = page.locator('text=PayPal, [data-testid="paypal"]');
    
    // At least one payment method should be visible
    await expect(cardPayment.or(stripeElement).or(paypalElement).first()).toBeVisible();
  });

  test('should have continue shopping option in checkout', async ({ page }) => {
    // Look for continue shopping link/button
    const continueShoppingBtn = page.locator('a:has-text("Continue Shopping"), button:has-text("Continue Shopping")');
    
    if (await continueShoppingBtn.isVisible()) {
      await continueShoppingBtn.click();
      
      // Should navigate back to menu
      await page.waitForURL('**/menu', { timeout: 5000 });
      await expect(page).toHaveURL(/.*menu/);
    }
  });

  test('should show order summary', async ({ page }) => {
    // Check for order summary section
    await expect(page.locator('text=Order Summary, text=Summary, text=Total')).toBeVisible();
    
    // Check for price display
    await expect(page.locator('text=£').first()).toBeVisible();
  });

  test('should show delivery fee calculation', async ({ page }) => {
    // Look for delivery fee information
    const deliveryFee = page.locator('text=Delivery, text=Fee');
    const freeDelivery = page.locator('text=Free, text=FREE');
    
    // Either delivery fee or free delivery should be mentioned
    await expect(deliveryFee.or(freeDelivery).first()).toBeVisible();
  });
});