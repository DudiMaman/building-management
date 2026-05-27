# Deploy the marketing site — free options

The repo is private, so GitHub Pages requires a paid plan ($48/yr). The
two free alternatives below work with private repos and give you a real
URL within a few minutes.

## Option A: Vercel (recommended — easiest, made for Next.js)

1. Go to <https://vercel.com/signup> and sign up with GitHub.
2. Authorize Vercel to access the `building-management` repo (you can
   pick a single repo, not your whole account).
3. Click **Add New → Project** and select `building-management`.
4. **Important — change these defaults:**
   - **Root Directory**: click *Edit*, choose `apps/marketing` (without
     trailing slash). Vercel will then auto-detect Next.js.
   - **Build & Output Settings**: leave defaults (Vercel runs
     `pnpm install` at the workspace root and `next build` in
     `apps/marketing`).
5. (Optional) **Environment Variables**: leave empty for now — the
   contact form falls back to `mailto:` when no API URL is set.
6. Click **Deploy**.

After 1–2 minutes you get a URL like:

```
https://building-management-<hash>.vercel.app
```

Every `git push` to `main` (and pull-request) triggers a fresh deploy.
Pull-request previews get their own URL automatically — handy for sharing.

When you buy the real domain, add it under **Settings → Domains**;
Vercel handles the SSL + DNS instructions.

## Option B: Cloudflare Pages

1. Go to <https://pages.cloudflare.com/> and sign in.
2. **Create a project → Connect to Git → GitHub** and pick the repo.
3. **Build configuration**:
   - **Framework preset**: Next.js
   - **Build command**: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @bm/marketing build`
   - **Build output directory**: `apps/marketing/.next`
   - **Root directory**: `apps/marketing`
4. **Environment variables**: add `NODE_VERSION=20` (CF defaults to 18).
5. **Save and deploy**.

URL will be `https://building-management.pages.dev`.

## Option C: Make the repo public

If you don't care about exposing the source code yet, just flip the repo
to public at **Settings → General → Danger Zone → Change visibility**.
GitHub Pages then becomes free, and the workflow at
`.github/workflows/deploy-marketing.yml` already pushes to the
`gh-pages` branch on every push to `main`.

Then enable Pages: **Settings → Pages → Source = Deploy from a branch
→ `gh-pages` → /(root)**.

URL: `https://<username>.github.io/building-management/`

## What's already configured

- `apps/marketing/vercel.json` — tells Vercel the framework is Next.js
  and adds a `turbo-ignore` hint so unrelated commits don't trigger
  rebuilds.
- `.github/workflows/deploy-marketing.yml` — builds the static export
  on every push to main and publishes it to the `gh-pages` branch.
- `apps/marketing/next.config.js` — supports both regular Next.js
  serving (Vercel / Cloudflare) and static export (`EXPORT_STATIC=true`
  for the `gh-pages` workflow). The static path uses a `/building-management`
  base path; regular serving uses root.

## Local preview (no deploy needed)

```bash
pnpm install
pnpm --filter @bm/marketing dev   # → http://localhost:3000
```

The dev server hot-reloads on every edit. For a production-shaped
build:

```bash
pnpm --filter @bm/marketing build
pnpm --filter @bm/marketing start  # → http://localhost:3000
```
