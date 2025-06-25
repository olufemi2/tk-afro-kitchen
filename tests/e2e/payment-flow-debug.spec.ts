import { test, expect } from '@playwright/test';

test.describe('Payment Flow Debug - Step by Step', () => {
  
  test('should navigate to menu page', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/homepage.png' });
    
    // Check if menu link exists
    const menuLink = page.locator('a[href="/menu"]');
    await expect(menuLink).toBeVisible();
    console.log('✅ Menu link found');
    
    // Click menu link
    await menuLink.click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on menu page
    await expect(page).toHaveURL(/.*menu/);
    console.log('✅ Successfully navigated to menu page');
    
    // Take screenshot of menu page
    await page.screenshot({ path: 'test-results/menu-page.png' });
  });

  test('should find menu items on menu page', async ({ page }) => {
    // Go directly to menu page
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    // Look for any cards or menu items
    const cards = page.locator('div[class*="card"], .card, [class*="food"], div[class*="grid"] > div');
    const cardCount = await cards.count();
    console.log(`Found ${cardCount} potential menu cards`);
    
    if (cardCount > 0) {
      // Take screenshot showing menu items
      await page.screenshot({ path: 'test-results/menu-items.png' });
      
      // Try to click first card
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();
      
      // Get some info about the card
      const cardText = await firstCard.textContent();
      console.log('First card text:', cardText?.substring(0, 100));
      
      // Try clicking it
      await firstCard.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after click
      await page.screenshot({ path: 'test-results/after-card-click.png' });
      
      console.log('✅ Successfully clicked first menu item');
    } else {
      console.log('❌ No menu items found');
      await page.screenshot({ path: 'test-results/no-menu-items.png' });
    }
  });

  test('should find and use cart functionality', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    // Look for cart button in header
    const headerCart = page.locator('header button, header [class*="cart"], header svg').filter({ hasText: /cart|Cart/ }).or(
      page.locator('header button').filter({ has: page.locator('svg[class*="cart"], svg[data-lucide="shopping"]') })
    );
    
    const cartCount = await headerCart.count();
    console.log(`Found ${cartCount} potential cart buttons in header`);
    
    if (cartCount > 0) {
      const cartButton = headerCart.first();
      await expect(cartButton).toBeVisible();
      console.log('✅ Cart button found in header');
      
      // Click cart button
      await cartButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/cart-opened.png' });
      console.log('✅ Cart button clicked');
    }
    
    // Look for any "Add to Cart" buttons on the page
    const addToCartButtons = page.locator('button:has-text("Add to Cart"), button:has-text("Add To Cart")');
    const addToCartCount = await addToCartButtons.count();
    console.log(`Found ${addToCartCount} "Add to Cart" buttons`);
    
    if (addToCartCount > 0) {
      console.log('✅ Add to Cart buttons found');
    }
  });

  test('should access checkout page directly', async ({ page }) => {
    // Try to go directly to checkout page
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/checkout-direct.png' });
    
    // Check if we're redirected due to empty cart
    const currentUrl = page.url();
    console.log('Current URL after checkout navigation:', currentUrl);
    
    if (currentUrl.includes('checkout')) {
      console.log('✅ Checkout page accessible');
      
      // Look for form fields
      const nameInput = page.locator('input[name="fullName"], input[id="fullName"]');
      const emailInput = page.locator('input[name="email"], input[id="email"]');
      
      if (await nameInput.isVisible()) {
        console.log('✅ Checkout form fields found');
      }
    } else {
      console.log('❌ Redirected from checkout (likely due to empty cart)');
    }
  });

  test('should find payment components', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Look for payment method selection
    const paymentMethods = page.locator('button:has-text("Card"), button:has-text("PayPal"), [class*="payment"]');
    const paymentCount = await paymentMethods.count();
    console.log(`Found ${paymentCount} payment method options`);
    
    // Look for any Stripe elements
    const stripeFrames = page.locator('iframe[src*="stripe"]');
    const stripeCount = await stripeFrames.count();
    console.log(`Found ${stripeCount} Stripe iframes`);
    
    await page.screenshot({ path: 'test-results/payment-components.png' });
  });
});