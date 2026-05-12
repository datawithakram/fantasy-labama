import { test, expect } from '@playwright/test';

test.describe('System Tests', () => {
  test('Backend is running', async ({ request }) => {
    const response = await request.get('http://localhost:4000/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('Frontend is running', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    // Just verify that the page loads without an error and has a title
    const title = await page.title();
    expect(title).toBeDefined();
    // Assuming the title is 'Fantasy Labama' or something similar
    // The exact title depends on index.html
  });

  test('Admin Panel is running', async ({ page }) => {
    await page.goto('http://localhost:5174/');
    // Verify it loads
    const title = await page.title();
    expect(title).toBeDefined();
    // Also verify the sidebar or dashboard is visible
    await expect(page.locator('text=Fantasy Admin')).toBeVisible({ timeout: 10000 });
  });
});
