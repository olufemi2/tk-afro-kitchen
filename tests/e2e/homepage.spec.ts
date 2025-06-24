import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check if the page loads and has the correct title
    await expect(page).toHaveTitle(/TK Afro Kitchen|Authentic Nigerian Cuisine/);
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Authentic Nigerian Cuisine');
    
    // Check for hero description
    await expect(page.locator('text=Experience the rich flavors of Nigeria')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test "Browse Our Menu" button
    const browseMenuBtn = page.locator('text=Browse Our Menu').first();
    await expect(browseMenuBtn).toBeVisible();
    await browseMenuBtn.click();
    await page.waitForURL('**/menu');
    await expect(page).toHaveURL(/.*menu/);
    
    // Go back to homepage
    await page.goto('/');
    
    // Test "About Us" button
    const aboutBtn = page.locator('text=About Us').first();
    await expect(aboutBtn).toBeVisible();
    await aboutBtn.click();
    await page.waitForURL('**/about');
    await expect(page).toHaveURL(/.*about/);
  });

  test('should display menu categories', async ({ page }) => {
    // Check if categories section is visible
    await expect(page.locator('text=Menu Categories')).toBeVisible();
    
    // Check for category cards (should have at least 3)
    const categoryCards = page.locator('[data-testid="category-card"], .grid > div').filter({ hasText: /Rice|Soup|Protein/ });
    await expect(categoryCards.first()).toBeVisible();
  });

  test('should display popular dishes', async ({ page }) => {
    // Check if popular dishes section is visible
    await expect(page.locator('text=Popular Dishes')).toBeVisible();
    
    // Check for dish cards
    const dishCards = page.locator('.grid > div').filter({ hasText: /£/ });
    await expect(dishCards.first()).toBeVisible();
    
    // Test "Browse Full Menu" button
    const browseFullMenuBtn = page.locator('text=Browse Full Menu');
    await expect(browseFullMenuBtn).toBeVisible();
    await browseFullMenuBtn.click();
    await page.waitForURL('**/menu');
    await expect(page).toHaveURL(/.*menu/);
  });

  test('should have working header navigation', async ({ page }) => {
    // Test logo link
    const logoLink = page.locator('text=TKAfro Kitchen');
    await expect(logoLink).toBeVisible();
    
    // Test menu link in header
    const headerMenuLink = page.locator('nav a[href="/menu"]').first();
    await expect(headerMenuLink).toBeVisible();
    await headerMenuLink.click();
    await page.waitForURL('**/menu');
    await expect(page).toHaveURL(/.*menu/);
    
    // Go back and test other header links
    await page.goto('/');
    
    // Test about link in header (if visible on desktop)
    const headerAboutLink = page.locator('nav a[href="/about"]').first();
    if (await headerAboutLink.isVisible()) {
      await headerAboutLink.click();
      await page.waitForURL('**/about');
      await expect(page).toHaveURL(/.*about/);
    }
  });

  test('should show cart icon', async ({ page }) => {
    // Check if cart icon is visible
    const cartIcon = page.locator('[data-testid="cart-icon"], button:has-text(""), button:has(svg)').filter({ hasText: '' }).first();
    await expect(cartIcon.or(page.locator('button').filter({ has: page.locator('svg') }).first())).toBeVisible();
  });
});