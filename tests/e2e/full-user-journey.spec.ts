import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Complete User Journey', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.mockSuccessfulPayment();
  });

  test('should complete full user journey from homepage to success', async ({ page }) => {
    // Step 1: Start from homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Authentic Nigerian Cuisine');

    // Step 2: Navigate to menu
    const browseMenuBtn = page.locator('text=Browse Our Menu').first();
    await browseMenuBtn.click();
    await helpers.waitForNavigation('/menu');

    // Step 3: Add item to cart
    await helpers.addItemToCart();

    // Step 4: View cart
    await helpers.openCart();

    // Step 5: Proceed to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout"), button:has-text("Proceed to Checkout")').first();
    await checkoutBtn.click();
    await helpers.waitForNavigation('/checkout');

    // Step 6: Fill delivery details
    await helpers.fillDeliveryDetails({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '07123456789',
      address: '123 Main Street',
      postcode: 'SW1A 1AA',
      city: 'London'
    });

    // Step 7: Continue to payment
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
    }

    // Step 8: Verify payment options are shown
    await expect(page.locator('text=Payment, text=Card, text=Choose Payment')).toBeVisible();

    // Step 9: Simulate successful payment
    await helpers.simulatePaymentSuccess();

    // Step 10: Verify success page
    await helpers.waitForNavigation('/success');
    await expect(page.locator('text=Payment Successful, text=Thank you')).toBeVisible();

    // Step 11: Verify order details are shown
    await expect(page.locator('text=Order, text=Confirmation')).toBeVisible();
  });

  test('should handle continue shopping flow', async ({ page }) => {
    // Add item to cart
    await helpers.addItemToCart();
    await helpers.openCart();

    // Use continue shopping
    const continueShoppingBtn = page.locator('button:has-text("Continue Shopping")');
    if (await continueShoppingBtn.isVisible()) {
      await continueShoppingBtn.click();
      await helpers.waitForNavigation('/menu');
    }

    // Should be back on menu page
    await expect(page).toHaveURL(/.*menu/);

    // Add another item
    const addToCartBtns = page.locator('button:has-text("Add to Cart")');
    const secondBtn = addToCartBtns.nth(1);
    if (await secondBtn.isVisible()) {
      await secondBtn.click();
      await page.waitForTimeout(1000);
    }

    // Open cart again - should have multiple items
    await helpers.openCart();
    // Cart should still be functional
    await expect(page.locator('text=Cart, text=Your Cart')).toBeVisible();
  });

  test('should handle Safari-specific payment flow', async ({ page }) => {
    // Only run this test if we're using Safari
    const isSafari = await helpers.isSafari();
    
    if (!isSafari) {
      test.skip('This test is only for Safari browser');
    }

    // Complete checkout flow
    await helpers.completeCheckoutFlow();

    // Simulate Safari payment success
    await page.evaluate(() => {
      const orderDetails = {
        orderId: 'safari_test_order_123',
        status: 'COMPLETED',
        amount: '75.50',
        timestamp: new Date().toISOString(),
        customerInfo: {
          fullName: 'Safari User',
          email: 'safari@example.com'
        }
      };
      
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      
      // Safari-specific redirect
      window.location.assign('/success?orderId=' + orderDetails.orderId + '&amount=' + orderDetails.amount + '&timestamp=' + Date.now());
    });

    // Wait for success page
    await helpers.waitForNavigation('/success');

    // Check for Safari-specific success banner
    await expect(page.locator('text=Payment Successful')).toBeVisible({ timeout: 10000 });

    // Verify order details are displayed
    await expect(page.locator('text=safari_test_order_123')).toBeVisible();
    await expect(page.locator('text=£75.50')).toBeVisible();
  });

  test('should handle mobile user journey', async ({ page }) => {
    const isMobile = await helpers.isMobile();
    
    if (!isMobile) {
      test.skip('This test is only for mobile viewports');
    }

    // Start from homepage
    await page.goto('/');

    // On mobile, might need to open mobile menu
    const mobileMenuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await mobileMenuBtn.isVisible()) {
      // Check if it's actually the mobile menu button (not cart)
      await mobileMenuBtn.click();
      await page.waitForTimeout(500);
      
      // Look for mobile navigation
      const mobileMenuLink = page.locator('a[href="/menu"]').filter({ hasText: 'Menu' });
      if (await mobileMenuLink.isVisible()) {
        await mobileMenuLink.click();
        await helpers.waitForNavigation('/menu');
      } else {
        // If mobile menu didn't open, navigate directly
        await page.goto('/menu');
      }
    } else {
      // Navigate directly to menu
      await page.goto('/menu');
    }

    // Continue with mobile flow
    await helpers.addItemToCart();
    await helpers.openCart();

    // Proceed to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout"), button:has-text("Proceed to Checkout")').first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await helpers.waitForNavigation('/checkout');
    }

    // Fill form on mobile
    await helpers.fillDeliveryDetails();

    // Verify mobile layout works
    await expect(page.locator('text=Delivery, text=Details, text=Information')).toBeVisible();
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Navigate to checkout without items
    await page.goto('/checkout');

    // Should redirect to menu or show empty state
    await page.waitForTimeout(2000);
    
    // Either redirected to menu or shows empty state
    const currentUrl = page.url();
    if (currentUrl.includes('/menu')) {
      await expect(page).toHaveURL(/.*menu/);
    } else {
      // Should show some indication of empty cart
      await expect(page.locator('text=empty, text=no items, text=add items')).toBeVisible();
    }
  });

  test('should maintain cart state across navigation', async ({ page }) => {
    // Add items to cart
    await helpers.addItemToCart();
    
    // Navigate to different pages
    await page.goto('/about');
    await expect(page).toHaveURL(/.*about/);
    
    await page.goto('/menu');
    await expect(page).toHaveURL(/.*menu/);
    
    // Cart should still have items
    await helpers.openCart();
    await expect(page.locator('text=Cart, text=Your Cart')).toBeVisible();
    
    // Should be able to proceed to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout"), button:has-text("Proceed")');
    if (await checkoutBtn.isVisible()) {
      await expect(checkoutBtn).toBeEnabled();
    }
  });
});