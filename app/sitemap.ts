import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://ctcampus.co.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Static Pages Array
  const staticPages = [
    '',
    '/about',
    '/courses',
    '/admissions',
    '/faculty',
    '/results',
    '/testimonials',
    '/blog',
    '/faqs',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/login',
    '/signup',
    // SEO Landing Pages
    '/best-clat-coaching-delhi',
    '/clat-coaching-karol-bagh',
    '/best-ipmat-coaching-delhi',
    '/best-cuet-coaching-delhi',
    '/clat-mentorship-delhi',
    '/cuet-coaching-central-delhi',
    '/ipmat-coaching-new-delhi',
    '/undergraduate-entrance-coaching-delhi',
  ].map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Course URLs
  let courseUrls: any[] = [];
  try {
    const { data: courses } = await supabase.from('courses').select('slug').eq('is_active', true);
    if (courses) {
      courseUrls = courses.map(c => ({
        url: `${BASE_URL}/courses/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('Sitemap course query error:', err);
  }

  // Dynamic Blog URLs
  let blogUrls: any[] = [];
  try {
    const { data: blogs } = await supabase.from('blog_posts').select('slug').eq('published', true);
    if (blogs) {
      blogUrls = blogs.map(b => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error('Sitemap blog query error:', err);
  }

  return [...staticPages, ...courseUrls, ...blogUrls];
}
