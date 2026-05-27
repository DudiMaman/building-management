import { test, expect } from '@playwright/test';

const PAGES: Array<[string, RegExp]> = [
  ['/features', /פיצ׳רים/],
  ['/who-its-for', /למי זה מתאים/],
  ['/pricing', /מחירים שקופים/],
  ['/testimonials', /לקוחות מספרים/],
  ['/faq', /שאלות נפוצות/],
  ['/blog', /^בלוג$/],
  ['/contact', /דברו איתנו/],
  ['/legal/terms', /תנאי שימוש/],
  ['/legal/privacy', /מדיניות פרטיות/],
  ['/legal/dpa', /DPA/],
  ['/en', /Israeli HOA management/],
];

test.describe('Marketing — top-level pages render', () => {
  for (const [path, expected] of PAGES) {
    test(`${path} renders without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      const response = await page.goto(path);
      expect(response?.status(), `HTTP status for ${path}`).toBeLessThan(400);
      await expect(page.getByRole('heading', { name: expected }).first()).toBeVisible();
      expect(errors, `JS errors on ${path}`).toEqual([]);
    });
  }

  test('header nav from home jumps to anchored sections', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'מחירים' }).first().click();
    // URL should now include #pricing or the pricing section in view.
    await expect(page).toHaveURL(/#pricing$/);
  });
});
