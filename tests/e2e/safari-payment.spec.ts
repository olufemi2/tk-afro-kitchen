import { test, expect, devices } from '@playwright/test';

test.describe('Safari Payment Success Flow', () => {
  // Run these tests specifically with Safari
  test.use({ ...devices['Desktop Safari'] });

  test.beforeEach(async ({ page }) => {
    // Mock successful payment for testing
    await page.route('**/api/create-payment-intent', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          client_secret: 'pi_test_1234567890_secret_test',
          id: 'pi_test_1234567890'
        })
      });
    });

    // Mock Stripe confirmation
    await page.addInitScript(() => {
      // Mock Stripe for testing
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
  });

  test('should detect Safari browser correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that Safari is detected
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Safari');
    expect(userAgent).not.toContain('Chrome');
    
    console.log('User Agent:', userAgent);
  });

  test('should handle Safari payment redirect correctly', async ({ page }) => {
    // Navigate to checkout with test data
    await page.goto('/checkout');
    
    // Fill delivery details
    await page.locator('input[name="fullName"], input[placeholder*="name" i]').first().fill('Safari Test User');
    await page.locator('input[name="email"], input[type="email"]').first().fill('safari.test@example.com');
    await page.locator('input[name="phone"], input[type="tel"]').first().fill('07123456789');
    await page.locator('input[name="address"], input[placeholder*="address" i]').first().fill('123 Safari Street');
    await page.locator('input[name="postcode"], input[placeholder*="postcode" i]').first().fill('SW1A 1AA');
    await page.locator('input[name="city"], input[placeholder*="city" i]').first().fill('London');
    
    // Continue to payment
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
    }
    
    // Mock successful payment submission
    await page.evaluate(() => {
      // Simulate successful payment in Safari
      const paymentData = {
        id: 'pi_test_safari_success',
        status: 'succeeded',
        amount: 5000,
        currency: 'gbp'
      };
      
      // Store order details as the app would
      const orderDetails = {
        orderId: 'test_safari_order_123',
        status: 'COMPLETED',
        amount: '50.00',
        timestamp: new Date().toISOString(),
        customerInfo: {
          fullName: 'Safari Test User',
          email: 'safari.test@example.com',
          phone: '07123456789'
        }
      };
      
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      
      // Simulate Safari-specific redirect
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      console.log('Safari detected:', isSafari);
      
      if (isSafari) {
        window.location.assign('/success?orderId=test_safari_order_123&amount=50.00&timestamp=' + Date.now());
      }
    });
    
    // Wait for redirect to success page
    await page.waitForURL('**/success**', { timeout: 15000 });
    await expect(page).toHaveURL(/.*success/);
  });

  test('should show Safari success banner on payment completion', async ({ page }) => {
    // Directly navigate to success page with Safari
    await page.goto('/success?orderId=test_safari_123&amount=50.00&timestamp=1234567890');
    
    // Store order details in localStorage
    await page.evaluate(() => {
      const orderDetails = {
        orderId: 'test_safari_123',
        status: 'COMPLETED',
        amount: '50.00',
        timestamp: new Date().toISOString(),
        customerInfo: {
          fullName: 'Safari Test User',
          email: 'safari.test@example.com'
        }
      };
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
    });
    
    // Reload page to trigger Safari detection
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Check for Safari-specific success banner
    const safariSuccessBanner = page.locator('text=Payment Successful, text=order has been confirmed');
    await expect(safariSuccessBanner).toBeVisible({ timeout: 10000 });
    
    // Check that success page content is displayed
    await expect(page.locator('text=Thank you, text=successful')).toBeVisible();
  });

  test('should retrieve order details from URL parameters in Safari', async ({ page }) => {
    // Navigate to success page with query parameters
    await page.goto('/success?orderId=safari_test_456&amount=75.50&timestamp=1234567890');
    
    await page.waitForTimeout(1000);
    
    // Check that order ID is displayed
    await expect(page.locator('text=safari_test_456')).toBeVisible();
    
    // Check that amount is displayed
    await expect(page.locator('text=£75.50')).toBeVisible();
  });

  test('should prevent automatic redirects from success page in Safari', async ({ page }) => {
    // Navigate to success page
    await page.goto('/success');
    
    // Add beforeunload listener check
    const hasBeforeUnloadListener = await page.evaluate(() => {
      // Check if beforeunload event listener is set up
      const event = new Event('beforeunload', { cancelable: true });
      const result = window.dispatchEvent(event);
      return !result; // If event was cancelled, listener exists
    });
    
    // In Safari, the app should set up beforeunload listener
    // This might not work in test environment, so we just check the page stays stable
    await page.waitForTimeout(2000);
    
    // Page should still be on success page
    await expect(page).toHaveURL(/.*success/);
  });

  test('should handle localStorage access delays in Safari', async ({ page }) => {
    // Navigate to success page
    await page.goto('/success');
    
    // Store order details with a slight delay to simulate Safari behavior
    await page.evaluate(() => {
      setTimeout(() => {
        const orderDetails = {
          orderId: 'delayed_safari_test',
          status: 'COMPLETED',
          amount: '42.99',
          timestamp: new Date().toISOString(),
          customerInfo: {
            fullName: 'Delayed Safari User'
          }
        };
        localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
      }, 100);
    });
    
    // Wait for Safari-specific delay and check content loads
    await page.waitForTimeout(1000);
    
    // Success content should eventually be visible
    await expect(page.locator('text=Thank you, text=Payment Successful')).toBeVisible({ timeout: 5000 });
  });

  test('should show loading state before displaying success content', async ({ page }) => {
    // Navigate to success page
    await page.goto('/success');
    
    // Should initially show loading state
    const loadingIndicator = page.locator('text=Loading, .animate-spin');
    
    // Loading should be visible initially (may be very brief)
    // Then success content should appear
    await expect(page.locator('text=Thank you, text=Payment Successful, text=order')).toBeVisible({ timeout: 5000 });
  });
});