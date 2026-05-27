import type { MetadataRoute } from 'next';
import { posts } from '@/lib/posts';

const BASE = process.env.NEXT_PUBLIC_MARKETING_DOMAIN ?? 'https://building-management.co.il';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/who-its-for`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/testimonials`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/dpa`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...baseRoutes, ...blogRoutes];
}
