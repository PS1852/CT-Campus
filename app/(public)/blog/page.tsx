import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata, getBreadcrumbSchema } from '@/lib/seo/metadata';
import JsonLd from '@/components/shared/JsonLd';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 1800; // Cache blog list for 30 minutes

export const metadata = generatePageMetadata({
  title: 'CT CAMPUS Blog | Strategic Entrance Prep Guidelines',
  description: 'Read the latest strategy articles, NCERT domain choice breakdowns, reading comprehension tips, and past competitive exam audits written by our expert directors.',
  slug: '/blog',
});

// Fallback blog seeds if database is empty
const fallbackBlogs = [
  { title: 'Complete CLAT Preparation Strategy 2025-26', slug: 'complete-clat-preparation-strategy-2025-26', excerpt: 'The definitive roadmap for law aspirants. Learn the exact passage-solving techniques, reading speedups, and mock analysis models to crack CLAT.', category: 'CLAT', created_at: new Date().toISOString() },
  { title: 'How to Crack IPMAT in 6 Months', slug: 'how-to-crack-ipmat-in-6-months', excerpt: 'Step-by-step 6-month roadmap detailing advanced quant topics, reading comprehension drills, and WAT/PI interview prep guided by IIM alumni.', category: 'IPMAT', created_at: new Date().toISOString() },
  { title: 'CUET Subject Selection Guide', slug: 'cuet-subject-selection-guide', excerpt: 'Avoid application rejection. Learn the strict eligibility combinations for DU and BHU courses, NCERT domain choices, and General Test setups.', category: 'CUET', created_at: new Date().toISOString() },
];

export default async function BlogPage() {
  const supabase = createClient();

  const { data: dbBlogs } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const blogs = dbBlogs && dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbsSchema} />

      <div className="py-12 sm:py-20 bg-background text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
              Expert Insights
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
              Exam Strategies & Mentorship Journal
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Unlock the academic routines and preparation secrets used by top rankers. Written directly by our Karol Bagh NLU and IIM alumni faculty board.
            </p>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post: any) => {
              const formattedDate = new Date(post.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={post.slug}
                  className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-soft transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      By Director Board
                    </span>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 group-hover:gap-2"
                    >
                      Read Strategy
                      <ArrowRight className="h-4 w-4 text-accent" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value props */}
          <div className="mt-20 border border-border bg-surface rounded-2xl p-8 sm:p-12 text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="font-display text-2xl font-bold text-primary">
                Want Custom Strategy Blueprints?
              </h3>
              <p className="text-sm text-muted">
                Schedule a diagnostic test opposite Karol Bagh Metro Pillar 80 to map out a customized study timeline, board exam intersections, and test plans with our founders.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center w-full">
              <Link href="/contact" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                Book Campus Visit
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
