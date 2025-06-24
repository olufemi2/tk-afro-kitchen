import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test('should load homepage correctly across browsers', async ({ page }) => {
    await page.goto('/');
    
    // Basic page load check
    await expect(page.locator('h1')).toContainText('Authentic Nigerian Cuisine');
    await expect(page.locator('text=Browse Our Menu')).toBeVisible();
    
    // Check that navigation works
    const menuLink = page.locator('text=Browse Our Menu').first();
    await menuLink.click();
    await page.waitForURL('**/menu');
    await expect(page).toHaveURL(/.*menu/);
  });

  test('should handle navigation correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test multiple navigation paths
    const aboutLink = page.locator('a[href="/about"]').or(page.locator('text=About Us')).first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForURL('**/about');
      await expect(page).toHaveURL(/.*about/);
    }
    
    // Navigate back to home
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Authentic Nigerian Cuisine');
  });

  test('should handle cart functionality', async ({ page }) => {
    await page.goto('/menu');
    
    // Try to add item to cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
      
      // Open cart
      const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await cartButton.click();
      await page.waitForTimeout(500);
      
      // Cart should open
      await expect(page.locator('text=Cart, text=Your Cart')).toBeVisible();
    }
  });

  test('should render responsive design correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if page adapts to viewport
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      // Mobile layout checks
      const mobileMenu = page.locator('button:has(svg)').filter({ hasText: '' });
      await expect(mobileMenu.first()).toBeVisible();
    } else {
      // Desktop layout checks
      const desktopNav = page.locator('nav a[href="/menu"]');
      await expect(desktopNav.first()).toBeVisible();
    }
  });
});

// Safari-specific tests
test.describe('Safari-Specific Compatibility', () => {
  test('should handle Safari-specific link behavior', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    
    await page.goto('/');
    
    // Test that Safari-specific link handlers work
    const menuLink = page.locator('text=Browse Our Menu').first();
    await menuLink.click();
    
    // Should navigate successfully despite Safari quirks
    await page.waitForURL('**/menu', { timeout: 10000 });
    await expect(page).toHaveURL(/.*menu/);
  });

  test('should handle Safari payment redirect behavior', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    
    // Mock payment success scenario
    await page.goto('/success?orderId=safari_test&amount=50.00');
    
    await page.evaluate(() => {
      const orderDetails = {
        orderId: 'safari_test',
        status: 'COMPLETED',
        amount: '50.00',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Should show Safari-specific success handling
    await expect(page.locator('text=Payment Successful, text=Thank you')).toBeVisible();
  });
});

// Mobile-specific tests
test.describe('Mobile Compatibility', () => {
  test('should handle mobile navigation', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;
    test.skip(!isMobile, 'Mobile-specific test');
    
    await page.goto('/');
    
    // Test mobile menu
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await mobileMenuButton.click();
    
    // Mobile navigation should open
    await page.waitForTimeout(500);
    
    // Look for navigation links
    const mobileMenuLink = page.locator('a[href="/menu"]').filter({ hasText: 'Menu' });
    if (await mobileMenuLink.isVisible()) {
      await mobileMenuLink.click();
      await page.waitForURL('**/menu');
      await expect(page).toHaveURL(/.*menu/);
    }
  });

  test('should handle mobile cart interaction', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 768 : false;
    test.skip(!isMobile, 'Mobile-specific test');
    
    await page.goto('/menu');
    
    // Add item to cart on mobile
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
      
      // Open cart on mobile
      const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await cartButton.click();
      
      // Cart should work on mobile
      await expect(page.locator('text=Cart, text=Your Cart')).toBeVisible();
    }
  });
});

test.describe('Performance Checks', () => {
  test('should load pages within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check that critical content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Browse Our Menu')).toBeVisible();
  });

  test('should handle JavaScript loading correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React hydration
    await page.waitForTimeout(1000);
    
    // Interactive elements should work
    const menuButton = page.locator('text=Browse Our Menu').first();
    await expect(menuButton).toBeEnabled();
    
    await menuButton.click();
    await page.waitForURL('**/menu');
    await expect(page).toHaveURL(/.*menu/);
  });
});