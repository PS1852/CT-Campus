import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { FileText, AlertCircle, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, published, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Strategic Blog Administrator
        </h1>
        <p className="text-sm text-muted">
          Draft, audit, and publish strategic articles targeting undergraduate entrance topics.
        </p>
      </div>

      {/* Posts List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Seeded Articles Ledger
        </h3>

        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => {
              const formattedDate = new Date(post.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={post.id} className="border border-border/85 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-accent transition-colors">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                        {post.category}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        post.published
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-primary">{post.title}</h4>
                    <span className="text-xs text-muted block">Created on: {formattedDate}</span>
                  </div>

                  <div className="shrink-0 flex gap-2 w-full sm:w-auto">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs min-h-[40px] px-4 flex items-center justify-center gap-1.5 bg-white"
                    >
                      <Eye className="h-4 w-4 text-accent" />
                      Preview
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileText className="h-8 w-8 text-amber-500" />
                <span>No strategic blog posts registered yet.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
