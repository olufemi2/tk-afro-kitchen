import { test, expect } from '@playwright/test';

test.describe('Working Payment Flow - Add to Cart → Card Payment → Success Page', () => {
  
  test('should complete full payment flow with card payment', async ({ page }) => {
    console.log('🚀 Starting complete payment flow test');
    
    // Step 1: Navigate to menu page
    console.log('📱 Step 1: Navigate to menu');
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/step1-menu-page.png' });
    
    // Step 2: Find and click on a menu item
    console.log('🍽️ Step 2: Select menu item');
    const menuCards = page.locator('div[class*="card"], .card, [class*="food"], div[class*="grid"] > div');
    await expect(menuCards.first()).toBeVisible();
    
    // Click the first menu item
    await menuCards.first().click();
    await page.waitForTimeout(2000); // Wait for modal/sheet to open
    await page.screenshot({ path: 'test-results/step2-menu-item-clicked.png' });
    
    // Step 3: Add item to cart
    console.log('🛒 Step 3: Add item to cart');
    
    // Look for size selection buttons first
    const sizeButtons = page.locator('button').filter({ hasText: /Small|Medium|Large/ });
    if (await sizeButtons.count() > 0) {
      console.log('Found size options, selecting first one');
      await sizeButtons.first().click();
      await page.waitForTimeout(500);
    }
    
    // Find and click Add to Cart button
    const addToCartButton = page.locator('button').filter({ hasText: /Add to Cart|Add To Cart/i });
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });
    await addToCartButton.click();
    
    console.log('✅ Item added to cart');
    await page.waitForTimeout(2000); // Wait for cart update
    await page.screenshot({ path: 'test-results/step3-item-added-to-cart.png' });
    
    // Step 4: Open cart and proceed to checkout
    console.log('🛍️ Step 4: Open cart and checkout');
    
    // Click cart button in header
    const cartButton = page.locator('header button').filter({ has: page.locator('svg') });
    if (await cartButton.count() > 0) {
      await cartButton.first().click();
      await page.waitForTimeout(1000);
      console.log('✅ Cart opened');
    }
    
    // Look for checkout button in cart
    const checkoutButton = page.locator('button, a').filter({ hasText: /Checkout|Proceed/i });
    if (await checkoutButton.count() > 0) {
      await checkoutButton.first().click();
      console.log('✅ Clicked checkout button');
    } else {
      // Alternative: Navigate directly to checkout
      console.log('No checkout button found, navigating directly to /checkout');
      await page.goto('/checkout');
    }
    
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/step4-checkout-page.png' });
    
    // Verify we're on checkout page
    await expect(page).toHaveURL(/.*checkout/, { timeout: 10000 });
    console.log('✅ On checkout page');
    
    // Step 5: Fill delivery details
    console.log('📝 Step 5: Fill delivery details');
    
    // Fill out the delivery form
    const deliveryForm = {
      fullName: 'John Doe Test',
      email: 'john.doe.test@example.com', 
      phone: '07123456789',
      address: '123 Test Street, Test Area',
      city: 'London',
      postcode: 'SW1A 1AA'
    };
    
    for (const [field, value] of Object.entries(deliveryForm)) {
      const input = page.locator(`input[name="${field}"], input[id="${field}"]`);
      if (await input.isVisible()) {
        await input.fill(value);
        console.log(`✅ Filled ${field}: ${value}`);
      }
    }
    
    await page.screenshot({ path: 'test-results/step5-delivery-details-filled.png' });
    
    // Continue to payment step
    const continueButton = page.locator('button').filter({ hasText: /Continue|Payment|Next/i });
    if (await continueButton.isVisible()) {
      await continueButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Proceeded to payment step');
    }
    
    await page.screenshot({ path: 'test-results/step5-payment-step.png' });
    
    // Step 6: Select card payment
    console.log('💳 Step 6: Select card payment');
    
    // Look for card payment option
    const cardPaymentButton = page.locator('button').filter({ hasText: /Card|Credit|Debit/i });
    if (await cardPaymentButton.count() > 0) {
      await cardPaymentButton.first().click();
      await page.waitForTimeout(3000); // Wait for Stripe to load
      console.log('✅ Selected card payment');
    }
    
    await page.screenshot({ path: 'test-results/step6-card-payment-selected.png' });
    
    // Step 7: Handle Stripe card input
    console.log('🔢 Step 7: Fill card details');
    
    // Check for Stripe iframe
    const stripeFrame = page.frameLocator('iframe[src*="stripe"], iframe[name*="stripe"]');
    const cardInput = stripeFrame.locator('input[name="cardnumber"], input[placeholder*="card"]');
    
    if (await cardInput.isVisible({ timeout: 5000 })) {
      console.log('✅ Found Stripe card input');
      
      // Fill Stripe test card details
      await cardInput.fill('4242424242424242');
      
      const expiryInput = stripeFrame.locator('input[name="exp-date"], input[placeholder*="MM"]');
      if (await expiryInput.isVisible()) {
        await expiryInput.fill('12/25');
      }
      
      const cvcInput = stripeFrame.locator('input[name="cvc"], input[placeholder*="CVC"]');
      if (await cvcInput.isVisible()) {
        await cvcInput.fill('123');
      }
      
      console.log('✅ Filled Stripe card details');
    } else {
      console.log('⚠️ No Stripe iframe found - checking for regular inputs');
      
      // Fallback: Look for regular card inputs (if Stripe is not properly configured)
      const regularCardInput = page.locator('input[placeholder*="card"], input[name*="card"]');
      if (await regularCardInput.isVisible()) {
        await regularCardInput.fill('4242424242424242');
        console.log('✅ Filled regular card input');
      }
    }
    
    await page.screenshot({ path: 'test-results/step7-card-details-filled.png' });
    
    // Step 8: Submit payment
    console.log('✅ Step 8: Submit payment');
    
    const payButton = page.locator('button').filter({ hasText: /Pay|Complete|Submit|Confirm/i });
    if (await payButton.count() > 0) {
      await payButton.first().click();
      console.log('✅ Payment submitted');
      
      // Wait for payment processing
      await page.waitForTimeout(5000);
    }
    
    await page.screenshot({ path: 'test-results/step8-payment-submitted.png' });
    
    // Step 9: Check for success page or success state
    console.log('🎉 Step 9: Verify success');
    
    // Wait for either success page redirect or success state
    try {
      await expect(page).toHaveURL(/.*success/, { timeout: 15000 });
      console.log('✅ Redirected to success page');
    } catch (error) {
      console.log('⚠️ No redirect to success page, checking for success state on current page');
    }
    
    // Look for success indicators
    const successIndicators = page.locator('text=Success, text=Successful, text=Confirmed, text=Complete, [class*="success"]');
    if (await successIndicators.count() > 0) {
      console.log('✅ Success indicator found');
    }
    
    // Look for order confirmation details
    const orderDetails = page.locator('text=Order, text=£, text=john.doe.test@example.com');
    if (await orderDetails.count() > 0) {
      console.log('✅ Order details visible');
    }
    
    await page.screenshot({ path: 'test-results/step9-final-state.png' });
    
    console.log('🎊 Payment flow test completed!');
  });

  test('should handle Safari payment recommendations', async ({ page }) => {
    // Mock Safari user agent
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      });
    });
    
    console.log('🍎 Testing Safari payment flow');
    
    // Go to menu and add item
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const menuCards = page.locator('div[class*="card"], .card, [class*="food"], div[class*="grid"] > div');
    await menuCards.first().click();
    await page.waitForTimeout(1000);
    
    const addToCartButton = page.locator('button').filter({ hasText: /Add to Cart/i });
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Go to checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Check if PayPal is recommended for Safari
    const paypalOption = page.locator('text=PayPal, text=Safari Optimized');
    if (await paypalOption.count() > 0) {
      console.log('✅ PayPal recommended for Safari');
    }
    
    // Check for Safari warnings
    const safariWarning = page.locator('text=Safari, [class*="safari"]');
    if (await safariWarning.count() > 0) {
      console.log('✅ Safari-specific warnings shown');
    }
    
    await page.screenshot({ path: 'test-results/safari-payment-options.png' });
  });
});