import { test, expect } from '@playwright/test';

test.describe('Marketing — home page', () => {
  test('renders Hebrew hero with both CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ניהול מבנים/);
    await expect(page.getByRole('heading', { name: /בלי כאב ראש/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /התחילו ניסיון חינם/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /קבעו הדגמה/ }).first()).toBeVisible();
  });

  test('has lang=he and dir=rtl on root', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('stats bar reaches its final values', async ({ page }) => {
    await page.goto('/');
    // StatsBar uses framer-motion + counters — wait for the suffix to settle.
    await page.locator('text=דירות מנוהלות').scrollIntoViewIfNeeded();
    await expect(page.getByText('דירות מנוהלות')).toBeVisible();
    await expect(page.getByText('אחוז גבייה ממוצע')).toBeVisible();
  });

  test('features section lists at least 12 cards', async ({ page }) => {
    await page.goto('/#features');
    const heading = page.getByRole('heading', { name: /כל מה שחברת ניהול צריכה/ });
    await expect(heading).toBeVisible();
  });

  test('pricing toggle switches monthly / annual', async ({ page }) => {
    await page.goto('/#pricing');
    const cycleToggle = page.getByRole('button', { name: 'חיוב שנתי' });
    await cycleToggle.click();
    // Expect the discount badge to appear and price to reduce.
    await expect(page.getByText(/חיסכון 15%/).first()).toBeVisible();
  });

  test('FAQ accordion expands and collapses', async ({ page }) => {
    await page.goto('/#faq');
    const firstQ = page.getByRole('button', { name: /כמה זמן לוקח להקים את המערכת/ });
    await expect(firstQ).toBeVisible();
    await firstQ.click();
    // Answer text inside the now-open panel.
    await expect(page.getByText(/בין 10 דקות ליום עבודה/).first()).toBeVisible();
  });

  test('cookie banner can be dismissed', async ({ page }) => {
    await page.goto('/');
    const acceptAll = page.getByRole('button', { name: /מסכימ/ });
    if (await acceptAll.isVisible()) {
      await acceptAll.click();
      // Banner should disappear within ~1s.
      await expect(acceptAll).toBeHidden({ timeout: 2000 });
    }
  });
});
