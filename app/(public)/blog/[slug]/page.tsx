import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import JsonLd from '@/components/shared/JsonLd';
import { getBlogPostSchema, getBreadcrumbSchema } from '@/lib/seo/metadata';
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Award } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!post) {
    return {
      title: 'Article Not Found | CT CAMPUS',
    };
  }

  return {
    title: `${post.title} | CT CAMPUS Karol Bagh`,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `https://ctcampus.co.in/blog/${params.slug}`,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const supabase = createClient();

  // Fetch post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  // Fetch sibling courses for lead capture cards
  const { data: courses } = await supabase
    .from('courses')
    .select('title, slug, category')
    .eq('is_active', true)
    .limit(3);

  // Fetch other strategic blogs for dynamic widgets
  const { data: recentPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, category')
    .eq('published', true)
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const blogSchema = getBlogPostSchema({
    title: post.title,
    description: post.excerpt || post.title,
    slug: post.slug,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    authorName: 'Senior Director Board',
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
    { name: post.title, item: `/blog/${post.slug}` },
  ]);

  // A very simple markdown-to-HTML formatter since this is a server component and we want raw performance
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((para, idx) => {
      const trimmed = para.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-display text-2xl font-bold text-primary mt-8 mb-4">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('#### ')) {
        return <h4 key={idx} className="font-display text-xl font-bold text-primary mt-6 mb-3">{trimmed.replace('#### ', '')}</h4>;
      }
      if (trimmed.startsWith('- ')) {
        return (
          <ul key={idx} className="list-disc pl-6 space-y-1.5 my-3 text-sm sm:text-base text-muted">
            <li>{trimmed.replace('- ', '')}</li>
          </ul>
        );
      }
      if (trimmed === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-sm sm:text-base text-muted leading-relaxed my-4 text-left">{trimmed}</p>;
    });
  };

  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          {/* Back trigger */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Strategy Journal
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Main article layout */}
            <article className="lg:col-span-8 bg-white border border-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
              
              <div className="space-y-4 border-b border-border pb-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    By Senior Director Board
                  </span>
                </div>
                
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  {post.title}
                </h1>
              </div>

              {/* Formatted body */}
              <div className="prose prose-slate max-w-none text-left">
                {renderFormattedContent(post.content)}
              </div>

            </article>

            {/* RIGHT COLUMN: Action card widgets */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Contextual Mentorship Call card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft text-left">
                <h3 className="font-display text-xl font-bold text-primary mb-1">
                  Arrange Strategy Call
                </h3>
                <p className="text-xs text-muted mb-6">
                  Confused about competitive options? Talk to our NLU/IIM alumni mentors today to set up your prep plan.
                </p>
                {courses && courses.length > 0 && (
                  <HomeInquiryForm courses={courses} />
                )}
              </div>

              {/* Campus location card */}
              <div className="bg-primary text-background p-6 rounded-2xl space-y-4">
                <div className="bg-background text-primary p-2 rounded-lg inline-flex items-center justify-center">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-display text-lg font-bold">CT CAMPUS New Delhi</h4>
                <p className="text-xs text-background/70 leading-relaxed">
                  Located opposite Pillar 80 Karol Bagh. Open all days. Visit silent study libraries and print booklet cabins directly.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1.5"
                >
                  Reach Campus Map
                  <span>→</span>
                </Link>
              </div>

              {/* Recent Strategy Posts */}
              {recentPosts && recentPosts.length > 0 && (
                <div className="border border-border bg-white p-6 rounded-2xl space-y-4 text-left">
                  <h4 className="font-display text-lg font-bold text-primary border-b border-border pb-2">
                    Recent Strategies
                  </h4>
                  <div className="space-y-4">
                    {recentPosts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="block group hover:bg-surface p-2 rounded-lg transition-colors border-b border-border/40 last:border-0 pb-3"
                      >
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                          {p.category}
                        </span>
                        <span className="font-semibold text-primary group-hover:text-accent transition-colors block text-sm mt-1 leading-snug">
                          {p.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
