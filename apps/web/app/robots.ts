import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nagrik.news';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/creator/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
