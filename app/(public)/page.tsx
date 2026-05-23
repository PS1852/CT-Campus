import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import JsonLd from '@/components/shared/JsonLd';
import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo/metadata';
import { BookOpen, Award, Users, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';

// Fallback courses data if database load fails
const fallbackCourses = [
  { title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', description: 'Comprehensive NLU alumni-led law entrance mentorship program covering all critical reading and legal reasoning patterns.', fee: 50000, duration: '1 Year', category: 'CLAT' },
  { title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', description: 'Advanced IIM entrance module with rigorous quant sessions and WAT/PI interview training with standard metrics.', fee: 80000, duration: '1 Year', category: 'IPMAT' },
  { title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', description: 'Complete general test and core domain syllabus coaching mapped strictly to NCERT board standards.', fee: 30000, duration: '6 Months', category: 'CUET' },
];

export const revalidate = 3600; // Cache page for 1 hour, incremental regeneration

export default async function HomePage() {
  const supabase = createClient();
  
  // Fetch courses from database
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
    
  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  // Fetch recent published blogs
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch active FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(5);

  const orgSchema = getOrganizationSchema();
  const businessSchema = getLocalBusinessSchema();

  return (
    <>
      <JsonLd schema={orgSchema} />
      <JsonLd schema={businessSchema} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-surface py-20 lg:py-32 border-b border-border">
        {/* Soft abstract gradient background */}
        <div className="absolute inset-0 glow-gradient pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Info */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-3.5 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold tracking-wider uppercase text-primary/80">
                  New Delhi’s Leading Entrance Mentorship
                </span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
                CT CAMPUS — Mentorship for CLAT, IPMAT & CUET Success
              </h1>
              
              <p className="text-lg text-muted max-w-xl leading-relaxed">
                Elevate your undergraduate entrance preparation under 1-on-1 guided strategies curated by NLU and IIM alumni. We believe in elite mentorship over mass lectures.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/courses" className="btn-primary flex items-center justify-center gap-2 group">
                  Explore Class Programs
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-secondary flex items-center justify-center gap-2">
                  <PhoneCall className="h-4 w-4 text-accent" />
                  Free 1-on-1 Consultation
                </Link>
              </div>

              {/* USP Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/80">
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-accent font-display">82%</span>
                  <span className="text-xs text-muted block uppercase font-medium">NLU Success</span>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-accent font-display">1-on-1</span>
                  <span className="text-xs text-muted block uppercase font-medium">Personal Coaching</span>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-accent font-display">Karol Bagh</span>
                  <span className="text-xs text-muted block uppercase font-medium">Premier Campus</span>
                </div>
              </div>
            </div>

            {/* Hero Right Interactive Form */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft">
                <h3 className="font-display text-2xl font-bold text-primary mb-2 text-left">
                  Request Fee Discount
                </h3>
                <p className="text-sm text-muted mb-6 text-left">
                  Enter your details to schedule a free diagnosis session with our academic mentors and unlock scholarship options.
                </p>
                <HomeInquiryForm courses={courses} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE STATS BANNER */}
      <section className="bg-primary text-background py-8 border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex items-center gap-4 justify-center md:border-r border-background/10 last:border-0 md:pr-4">
            <BookOpen className="h-8 w-8 text-accent shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-lg">Curated NCERT Domain Material</h4>
              <p className="text-xs text-background/60">Fully comprehensive booklets</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:border-r border-background/10 last:border-0 md:pr-4">
            <Award className="h-8 w-8 text-accent shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-lg">NLU & IIM Faculty Experts</h4>
              <p className="text-xs text-background/60">Exclusive 1-on-1 strategy sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Users className="h-8 w-8 text-accent shrink-0" />
            <div className="text-left">
              <h4 className="font-semibold text-lg">Silent Library Study Cabins</h4>
              <p className="text-xs text-background/60">Karol Bagh campus access</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIC COURSES GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Curated Entrance Mentorship Classes
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm sm:text-base">
            Enroll in our top-rated academic programs designed strictly around performance thresholds, regular mock trials, and syllabus tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div key={course.slug} className="academic-card p-6 flex flex-col justify-between text-left h-full">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-surface border border-accent/20 text-accent rounded-full">
                  {course.category}
                </span>
                <h3 className="font-display text-xl font-bold text-primary">
                  {course.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase font-semibold block">Fee / Duration</span>
                  <span className="text-base font-bold text-primary">
                    ₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'} <span className="text-xs font-normal text-muted">({course.duration})</span>
                  </span>
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex h-9 w-9 items-center justify-center bg-primary text-background rounded-full hover:bg-accent hover:text-primary transition-colors"
                  aria-label={`View ${course.title} details`}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STRATEGIC EXAM BLOG INDEX (LAST 3 POSTS) */}
      {blogs && blogs.length > 0 && (
        <section className="bg-surface py-20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
              <div className="space-y-3 text-left">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
                  Strategic Entrance Preparation Insights
                </h2>
                <p className="text-muted max-w-xl text-sm sm:text-base">
                  Get structural suggestions, reading comprehension strategies, and NCERT domain selection guidelines drafted by our leading mentors.
                </p>
              </div>
              <Link href="/blog" className="btn-secondary flex items-center gap-2 shrink-0">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((post: any) => (
                <div key={post.slug} className="bg-white border border-border rounded-xl p-6 flex flex-col justify-between text-left hover:shadow-soft transition-shadow">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                      {post.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-primary hover:text-accent transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1.5 mt-6 pt-4 border-t border-border/60"
                  >
                    Read Strategy
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEED FAQ PANEL ACCORDION */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-display text-3xl font-bold text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-sm sm:text-base">
              Get transparent answers directly from academic experts regarding CLAT, IPMAT, CUET, and Karol Bagh hostel alignments.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq: any, idx: number) => (
              <details
                key={faq.id}
                className="group border border-border bg-white rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-semibold text-primary text-base sm:text-lg text-left list-none">
                  <span>{faq.question}</span>
                  <span className="transition-transform group-open:rotate-180 text-accent font-bold shrink-0">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-sm text-muted leading-relaxed text-left border-t border-border/50 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* FINAL TRUST BANNER */}
      <section className="bg-primary text-background py-16 border-t border-primary/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 glow-gradient pointer-events-none opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Still Confused About Batch Options?
          </h2>
          <p className="text-background/70 max-w-xl mx-auto text-sm sm:text-base">
            Select a custom scheduling program or reach our Karol Bagh campus direct to discuss scholarship limits and study routines with our directors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="https://wa.me/918800833665?text=Hi%20CT%20Campus%20Mentor,%20I'm%20interested%20in%20arranging%20a%20personal%20career%20session."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-accent hover:bg-accent/90 text-primary flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              WhatsApp Strategic Mentor
            </a>
            <Link href="/contact" className="btn-secondary bg-[#0f0f20] border-border/10 text-background hover:bg-[#151530] flex items-center justify-center gap-2">
              Visit Campus Directory
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
