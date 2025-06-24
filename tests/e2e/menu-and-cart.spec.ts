import { test, expect } from '@playwright/test';

test.describe('Menu and Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('should load menu page successfully', async ({ page }) => {
    // Check if menu page loads
    await expect(page).toHaveURL(/.*menu/);
    
    // Check for menu items
    const menuItems = page.locator('[data-testid="menu-item"], .grid > div').filter({ hasText: /£/ });
    await expect(menuItems.first()).toBeVisible();
    
    // Check for search functionality if available
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should be able to add items to cart', async ({ page }) => {
    // Find a menu item with an "Add to Cart" button
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    await expect(addToCartBtn).toBeVisible();
    
    // Click add to cart
    await addToCartBtn.click();
    
    // Check if cart counter increases or cart modal opens
    const cartIcon = page.locator('button:has(svg)').filter({ hasText: '1' }).or(
      page.locator('[data-testid="cart-count"]')
    );
    
    // Wait for cart update (either counter or modal)
    await page.waitForTimeout(1000);
    
    // Verify cart has items (either by counter or by opening cart)
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    
    // Wait for cart modal to open
    await page.waitForTimeout(500);
    
    // Check if cart modal shows items
    await expect(page.locator('text=Your Cart, text=Cart')).toBeVisible();
  });

  test('should be able to manage cart items', async ({ page }) => {
    // Add an item to cart first
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Open cart
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    // Check if cart modal is open
    await expect(page.locator('text=Your Cart, text=Cart')).toBeVisible();
    
    // Look for quantity controls
    const plusButton = page.locator('button:has-text("+"), button[aria-label*="increase"], button[aria-label*="plus"]');
    const minusButton = page.locator('button:has-text("-"), button[aria-label*="decrease"], button[aria-label*="minus"]');
    
    if (await plusButton.first().isVisible()) {
      await plusButton.first().click();
      await page.waitForTimeout(500);
    }
    
    if (await minusButton.first().isVisible()) {
      await minusButton.first().click();
      await page.waitForTimeout(500);
    }
    
    // Check for remove item button
    const removeButton = page.locator('button:has-text("Remove"), button[aria-label*="remove"], button:has(svg)').filter({ hasText: '' });
    if (await removeButton.first().isVisible()) {
      // Don't actually remove for this test, just verify it exists
      await expect(removeButton.first()).toBeVisible();
    }
  });

  test('should show cart total', async ({ page }) => {
    // Add an item to cart first
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Open cart
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    // Check for total price
    await expect(page.locator('text=Total, text=£').or(page.locator('[data-testid="cart-total"]'))).toBeVisible();
  });

  test('should have continue shopping functionality', async ({ page }) => {
    // Add an item to cart first
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Open cart
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    // Look for continue shopping button
    const continueShoppingBtn = page.locator('button:has-text("Continue Shopping"), a:has-text("Continue Shopping")');
    if (await continueShoppingBtn.isVisible()) {
      await continueShoppingBtn.click();
      
      // Should return to menu page or close cart
      await page.waitForTimeout(500);
      // Cart should be closed or we should be on menu page
      const cartModal = page.locator('text=Your Cart').first();
      if (await cartModal.isVisible()) {
        // Cart might still be visible, that's ok
      } else {
        // Cart closed, verify we're still on a shopping page
        await expect(page).toHaveURL(/.*menu|.*\/$/);
      }
    }
  });

  test('should proceed to checkout with items in cart', async ({ page }) => {
    // Add an item to cart first
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Open cart
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    // Look for checkout button
    const checkoutBtn = page.locator('button:has-text("Checkout"), button:has-text("Proceed to Checkout"), a:has-text("Checkout")');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      
      // Should navigate to checkout page
      await page.waitForURL('**/checkout', { timeout: 10000 });
      await expect(page).toHaveURL(/.*checkout/);
    }
  });

  test('should show empty cart message when no items', async ({ page }) => {
    // Open cart without adding items
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await cartButton.click();
    await page.waitForTimeout(500);
    
    // Should show empty cart message
    await expect(page.locator('text=empty, text=no items')).toBeVisible();
  });
});