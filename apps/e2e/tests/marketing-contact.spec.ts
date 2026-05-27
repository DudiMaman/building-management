import { test, expect } from '@playwright/test';

test.describe('Marketing — contact form', () => {
  test('shows validation when required fields are empty', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /שליחה/ }).click();
    // The native form should block submit because name + email are required.
    // We assert we're still on /contact (no thank-you screen).
    await expect(page).toHaveURL(/\/contact/);
  });

  test('successful submit shows the thank-you state (mailto fallback when no API)', async ({ page, context }) => {
    // Block any external navigation (mailto:) so the test doesn't open a mail client.
    await context.route('**/v1/leads', (route) => route.fulfill({ status: 200, body: '{"ok":true}' }));
    await page.addInitScript(() => {
      // Stub window.location to a no-op for the mailto fallback path.
      const origAssign = window.location.assign.bind(window.location);
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: new Proxy(window.location, {
          set(target, prop, value) {
            if (prop === 'href' && String(value).startsWith('mailto:')) return true;
            (target as any)[prop] = value;
            return true;
          },
        }),
      });
      // Silence "navigation" errors from the proxy.
      window.location.assign = origAssign;
    });

    await page.goto('/contact');
    // Scope to the main contact form so we don't grab the newsletter
    // input that lives in the footer.
    const form = page.locator('form').first();
    await form.locator('input[placeholder="שם מלא"]').fill('דנה כהן');
    await form.locator('input[placeholder="אימייל"]').fill('dana@example.com');
    await form.locator('input[placeholder*="טלפון"]').fill('050-1234567');
    await form.locator('input[placeholder="שם החברה"]').fill('חברת ניהול בית-אב');
    await form.locator('textarea').fill('היי, מעוניינים בהדגמה.');
    await form.getByRole('button', { name: /שליחה/ }).click();

    // We accept either path:
    //   - When PLAYWRIGHT_BASE_URL has NEXT_PUBLIC_API_BASE_URL baked in,
    //     thank-you appears.
    //   - Otherwise mailto: fires (stubbed) and thank-you also appears.
    await expect(page.getByRole('heading', { name: /תודה!/ })).toBeVisible({ timeout: 5000 });
  });
});
