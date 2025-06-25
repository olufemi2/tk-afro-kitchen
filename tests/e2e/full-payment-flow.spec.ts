import { test, expect } from '@playwright/test';

test.describe('Complete Payment Flow - Add to Cart → Card Payment → Success Page', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full payment flow with card payment', async ({ page }) => {
    // Step 1: Navigate to menu and add item to cart
    console.log('🛒 Step 1: Adding item to cart');
    
    // Navigate to menu using the correct Link component
    await page.locator('a[href="/menu"]:has-text("Browse Our Menu")').click();
    await expect(page).toHaveURL(/.*menu/);
    await page.waitForLoadState('networkidle');
    
    // Wait for menu items (FoodCard components) to load
    await page.waitForSelector('.food-card, [data-testid="food-card"]', { timeout: 10000 });
    
    // Select first available menu item - try clicking the card itself
    const menuItem = page.locator('.food-card, [data-testid="food-card"]').first();
    await expect(menuItem).toBeVisible();
    
    // Click the card to open the details modal
    await menuItem.click();
    
    // Wait for modal/sheet to open
    await page.waitForTimeout(1000);
    
    // Select portion size if available - look for buttons with size text
    const sizeButtons = page.locator('button:has-text("Small"), button:has-text("Medium"), button:has-text("Large")');
    if (await sizeButtons.first().isVisible()) {
      await sizeButtons.first().click();
    }
    
    // Add to cart - look for the specific Add to Cart button
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();
    
    // Wait for item to be added and modal to close
    await page.waitForTimeout(2000);
    
    // Step 2: Proceed to checkout
    console.log('🏪 Step 2: Proceeding to checkout');
    
    // Look for cart icon in header and click it
    const cartIcon = page.locator('[data-testid="cart-button"], .cart-icon, button:has(svg)').filter({ hasText: /cart|Cart/ }).or(
      page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /\d/ }) // Button with cart count
    );
    
    if (await cartIcon.first().isVisible()) {
      await cartIcon.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Look for checkout button in cart modal/drawer
    const checkoutButton = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), button:has-text("Proceed to Checkout")');
    await expect(checkoutButton).toBeVisible({ timeout: 5000 });
    await checkoutButton.click();
    
    // Verify we're on checkout page
    await expect(page).toHaveURL(/.*checkout/);
    await page.waitForLoadState('networkidle');
    
    // Step 3: Fill delivery details
    console.log('📝 Step 3: Filling delivery details');
    
    // Fill delivery information
    await page.fill('input[name="fullName"], input[id="fullName"]', 'John Doe');
    await page.fill('input[name="email"], input[id="email"]', 'john.doe@test.com');
    await page.fill('input[name="phone"], input[id="phone"]', '07123456789');
    await page.fill('input[name="address"], input[id="address"]', '123 Test Street');
    await page.fill('input[name="city"], input[id="city"]', 'London');
    await page.fill('input[name="postcode"], input[id="postcode"]', 'SW1A 1AA');
    
    // Continue to payment
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Payment")');
    await expect(continueButton).toBeVisible();
    await continueButton.click();
    
    // Wait for payment step
    await page.waitForTimeout(2000);
    
    // Step 4: Select card payment method
    console.log('💳 Step 4: Selecting card payment');
    
    // Select card payment method
    const cardPaymentOption = page.locator('button:has-text("Card"), .payment-method:has-text("Card"), [data-testid="card-payment"]');
    await expect(cardPaymentOption).toBeVisible();
    await cardPaymentOption.click();
    
    // Wait for Stripe Elements to load
    await page.waitForTimeout(3000);
    
    // Step 5: Fill card details
    console.log('🔢 Step 5: Filling card details');
    
    // Check if Stripe is properly configured
    const stripeCardElement = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="cardnumber"]');
    
    if (await stripeCardElement.isVisible()) {
      // Real Stripe integration
      await stripeCardElement.fill('4242424242424242'); // Stripe test card
      
      const expiryElement = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="exp-date"]');
      await expiryElement.fill('12/25');
      
      const cvcElement = page.frameLocator('iframe[name^="__privateStripeFrame"]').locator('input[name="cvc"]');
      await cvcElement.fill('123');
    } else {
      // Fallback: Look for regular card input fields (if Stripe is mocked)
      const cardNumberInput = page.locator('input[placeholder*="card"], input[name*="card"], input[id*="card"]');
      if (await cardNumberInput.isVisible()) {
        await cardNumberInput.fill('4242424242424242');
      }
      
      const expiryInput = page.locator('input[placeholder*="expiry"], input[name*="expiry"], input[placeholder*="MM/YY"]');
      if (await expiryInput.isVisible()) {
        await expiryInput.fill('12/25');
      }
      
      const cvcInput = page.locator('input[placeholder*="CVC"], input[name*="cvc"], input[placeholder*="CVV"]');
      if (await cvcInput.isVisible()) {
        await cvcInput.fill('123');
      }
    }
    
    // Step 6: Submit payment
    console.log('✅ Step 6: Submitting payment');
    
    const payButton = page.locator('button:has-text("Pay"), button:has-text("Complete"), button:has-text("Submit")');
    await expect(payButton).toBeVisible();
    await payButton.click();
    
    // Wait for payment processing
    await page.waitForTimeout(5000);
    
    // Step 7: Verify success page
    console.log('🎉 Step 7: Verifying success page');
    
    // Check if we're redirected to success page
    await expect(page).toHaveURL(/.*success/, { timeout: 15000 });
    
    // Verify success page content
    await expect(page.locator('text=Success, text=Successful, text=Confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Order, text=Payment')).toBeVisible();
    
    // Verify order details are displayed
    await expect(page.locator('text=john.doe@test.com, text=John Doe')).toBeVisible();
    await expect(page.locator('text=£').first()).toBeVisible(); // Price display
    
    console.log('✨ Payment flow completed successfully!');
  });

  test('should handle continue shopping during checkout', async ({ page }) => {
    // Add item to cart first
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const menuItem = page.locator('[data-testid="menu-item"], .menu-item, .product-card').first();
    await menuItem.click();
    
    const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
    await addToCartButton.click();
    
    // Go to checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Test continue shopping button
    const continueShoppingButton = page.locator('button:has-text("Continue Shopping"), a:has-text("Continue Shopping")');
    if (await continueShoppingButton.isVisible()) {
      await continueShoppingButton.click();
      await expect(page).toHaveURL(/.*menu/);
    }
  });

  test('should validate payment form fields', async ({ page }) => {
    // Add item and go to checkout
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const menuItem = page.locator('[data-testid="menu-item"], .menu-item, .product-card').first();
    await menuItem.click();
    
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();
    
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Try to proceed without filling required fields
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Payment")');
    await continueButton.click();
    
    // Should show validation errors
    await expect(page.locator('text=required, text=invalid').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show order summary in checkout', async ({ page }) => {
    // Add item and go to checkout
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const menuItem = page.locator('[data-testid="menu-item"], .menu-item, .product-card').first();
    await menuItem.click();
    
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();
    
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Verify order summary is visible
    await expect(page.locator('text=Order Summary, text=Summary, text=Total')).toBeVisible();
    await expect(page.locator('text=£').first()).toBeVisible();
    await expect(page.locator('text=Delivery').first()).toBeVisible();
  });
});