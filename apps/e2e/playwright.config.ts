import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — runs the marketing E2E suite against either:
 *   - A locally booted dev server (default, `pnpm --filter @bm/marketing dev`)
 *   - A live URL via PLAYWRIGHT_BASE_URL (e.g. the GitHub Pages preview)
 *
 * Locale forced to he-IL so date/number assertions are stable.
 */
const isCI = !!process.env.CI;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const skipWebServer = !!process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Pin to a system-installed Chrome / Chromium when set, so we can
        // run in restricted envs that can't download Playwright's bundled
        // browsers. Set CHROMIUM_EXECUTABLE_PATH to use it.
        launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH
          ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
          : undefined,
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 14'],
        launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH
          ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
          : undefined,
      },
    },
  ],

  // Boot the marketing dev server when no PLAYWRIGHT_BASE_URL is set.
  // Skipped when running against a deployed URL.
  webServer: skipWebServer
    ? undefined
    : {
        command: 'pnpm --filter @bm/marketing dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !isCI,
        timeout: 120_000,
        cwd: '../..',
      },
});
