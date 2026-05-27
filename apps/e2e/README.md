# @bm/e2e

End-to-end tests (Playwright) for the marketing site. Lives outside the
main `pnpm turbo run test` pipeline so it doesn't slow down unit-test
runs.

## Running

### Against a local dev server (default)
Playwright boots `pnpm --filter @bm/marketing dev` automatically:
```bash
pnpm --filter @bm/e2e e2e
```

### Against an already-running server
```bash
pnpm --filter @bm/marketing dev   # in another terminal
pnpm --filter @bm/e2e e2e
```

### Against a live URL (staging, production)
```bash
PLAYWRIGHT_BASE_URL=https://dudimaman.github.io/building-management \
  pnpm --filter @bm/e2e e2e
```

### Headed (watch the browser)
```bash
pnpm --filter @bm/e2e e2e:headed
```

### Pin to a system Chromium (restricted envs)
If you can't download Playwright's bundled browsers:
```bash
CHROMIUM_EXECUTABLE_PATH=/path/to/chrome pnpm --filter @bm/e2e e2e
```

## CI

`.github/workflows/e2e.yml` runs on every PR that touches marketing /
e2e / shared, plus on push to `main`, plus on `workflow_dispatch` (with
an optional `base_url` input so you can point it at a deployed URL).
HTML report uploaded as an artifact for 14 days.

## Coverage

The suite currently runs ~23 tests against the home page, top-level
pages, the blog, and the contact form. Browser projects: Desktop
Chrome + iPhone 14 (mobile Safari emulation).
