import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/editor/'],
    },
    sitemap: 'https://saas-biolink.vercel.app/sitemap.xml',
  };
}
