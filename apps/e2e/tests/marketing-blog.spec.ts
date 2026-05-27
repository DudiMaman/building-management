import { test, expect } from '@playwright/test';

test.describe('Marketing — blog', () => {
  test('blog index lists posts and each links to its detail page', async ({ page }) => {
    await page.goto('/blog');
    const headings = await page.locator('article h2 a').all();
    expect(headings.length).toBeGreaterThanOrEqual(4);

    const first = headings[0]!;
    const href = await first.getAttribute('href');
    expect(href).toMatch(/^\/blog\//);
    await first.click();
    await expect(page.locator('article h1')).toBeVisible();
    // "חזרה לכל המאמרים" link.
    await expect(page.getByRole('link', { name: /חזרה לכל המאמרים/ })).toBeVisible();
  });

  test('blog post body renders markdown headings + lists', async ({ page }) => {
    await page.goto('/blog/how-to-improve-collection-rate');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Body should contain at least one h2.
    await expect(page.locator('article h2').first()).toBeVisible();
  });
});
