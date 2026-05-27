/** @type {import('next').NextConfig} */

const isStaticExport = process.env.EXPORT_STATIC === 'true';

// For GitHub Pages we deploy under /<repo>/. The `BASE_PATH` env lets ops
// override (e.g., when deploying to a vanity domain at root).
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (isStaticExport ? '/building-management' : '');

module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@bm/shared', '@bm/config'],
  // i18n config doesn't work with `output: 'export'`. App Router uses its
  // own route-based locales via /en — see src/app/en/.
  output: isStaticExport ? 'export' : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: isStaticExport },
  trailingSlash: isStaticExport,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
