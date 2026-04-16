import { MetadataRoute } from 'next';
import { getAllUsernames } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://saas-biolink.vercel.app';
  
  // Static routes
  const routes = [
    '',
    '/auth/login',
    '/editor',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic user routes
  try {
    const usernames = await getAllUsernames();
    const userRoutes = usernames.map((username) => ({
      url: `${baseUrl}/${username}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...userRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
