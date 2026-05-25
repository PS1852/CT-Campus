import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { 
  BookOpen, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  GraduationCap, 
  BookOpenCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';

// Real fallbacks mapping NLU schemas and pricing
const fallbackCourses = [
  { title: 'CLAT Mastery Program', slug: 'clat-coaching-delhi', description: 'Comprehensive preparation for Common Law Admission Test with intensive focus on legal reasoning and critical reading modules.', fee: 14999, duration: '1 Year', category: 'CLAT' },
  { title: 'IPMAT Excellence Program', slug: 'best-ipmat-coaching-delhi', description: 'Integrated Program in Management Aptitude Test prep focusing on advanced quantitative, logical, and verbal abilities.', fee: 19999, duration: '1 Year', category: 'IPMAT' },
  { title: 'CUET Foundation Course', slug: 'best-cuet-coaching-delhi', description: 'Common University Entrance Test preparation aligning perfectly with CBSE boards and domain-specific tests.', fee: 11999, duration: '6 Months', category: 'CUET' },
];

export const revalidate = 3600; // incremental static regeneration every hour

export default async function HomePage() {
  const supabase = createClient();
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';

  // Fetch dynamic active courses
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  // Fetch blogs
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(4);

  return (
    <div className="bg-background min-h-screen font-worksans text-primary antialiased">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-surface-white border-b border-border-light">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0a1422" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success font-semibold text-xs mb-8 uppercase tracking-wider animate-fade-in-up">
            <Sparkles className="h-4.5 w-4.5 text-focus-teal" />
            Admissions Open 2024-2025
          </div>

          {/* Heading */}
          <h1 className="font-manrope text-4xl md:text-6xl font-extrabold text-primary max-w-4xl mx-auto mb-6 leading-tight tracking-tight">
            Strategic Mentorship for <span className="text-focus-teal">CLAT, IPMAT & CUET</span> Success
          </h1>

          {/* Subtext */}
          <p className="font-worksans text-base md:text-lg text-primary/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Elevate your undergraduate prep with tailored study architectures and 1-on-1 strategic coaching supervised by law and management experts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link 
              href="/admissions" 
              className="w-full sm:w-auto font-manrope font-semibold text-surface-white bg-success hover:bg-primary transition-all px-8 py-4 rounded focus-ring shadow-sm hover:ambient-shadow text-center flex items-center justify-center gap-2"
            >
              Start Enrollment 
              <ArrowRight className="h-5 w-5 text-focus-teal" />
            </Link>
            <Link 
              href="#programs" 
              className="w-full sm:w-auto font-manrope font-semibold text-primary bg-surface-white border border-border-light hover:border-focus-teal transition-all px-8 py-4 rounded focus-ring text-center"
            >
              Explore Programs
            </Link>
          </div>

          {/* Trust Indicators / Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-border-light max-w-4xl mx-auto">
            <div className="text-center">
              <div className="font-manrope text-3xl font-extrabold text-primary mb-1">98%</div>
              <div className="text-xs text-primary/60 uppercase tracking-widest font-semibold">Selection Rate</div>
            </div>
            <div className="text-center">
              <div className="font-manrope text-3xl font-extrabold text-primary mb-1">5000+</div>
              <div className="text-xs text-primary/60 uppercase tracking-widest font-semibold">Students Mentored</div>
            </div>
            <div className="text-center">
              <div className="font-manrope text-3xl font-extrabold text-primary mb-1">50+</div>
              <div className="text-xs text-primary/60 uppercase tracking-widest font-semibold">Expert Faculty</div>
            </div>
            <div className="text-center">
              <div className="font-manrope text-3xl font-extrabold text-primary mb-1">100%</div>
              <div className="text-xs text-primary/60 uppercase tracking-widest font-semibold">Syllabus Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="py-20 bg-surface-container/30 border-b border-border-light" id="programs">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-manrope text-3xl font-bold text-primary">Focused Preparation Tracks</h2>
            <p className="font-worksans text-sm text-primary/60 max-w-2xl mx-auto">
              Structured modules engineered precisely by academic professionals to give you the competitive edge in undergraduate exams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <div 
                key={course.slug} 
                className="bg-surface-white rounded-lg border border-border-light p-8 hover:ambient-shadow transition-shadow group relative overflow-hidden text-left flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-focus-teal/10 text-focus-teal mb-6">
                    <BookOpenCheck className="h-6 w-6" />
                  </div>
                  <span className="inline-block float-right text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full uppercase">
                    {course.category}
                  </span>
                  <h3 className="font-manrope text-xl font-bold text-primary mb-3">
                    {course.title}
                  </h3>
                  <p className="text-sm text-primary/60 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-border-light flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary/40 block">Course Fee</span>
                    <span className="text-base font-extrabold text-primary">
                      ₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <Link 
                    href="/admissions" 
                    className="font-manrope text-sm font-bold text-focus-teal hover:text-primary transition-colors flex items-center gap-1 group-hover:gap-2"
                  >
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGE / METHODOLOGY SECTION */}
      <section className="py-20 bg-surface-white border-b border-border-light">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left SVG Illustration */}
            <div className="w-full lg:w-1/2">
              <div className="bg-surface rounded-lg p-8 border border-border-light relative overflow-hidden aspect-video flex items-center justify-center bg-gradient-to-tr from-primary to-primary-container">
                <div className="absolute inset-0 opacity-10 bg-radial-gradient"></div>
                <div className="text-center z-10 space-y-4">
                  <div className="bg-focus-teal/20 text-focus-teal h-16 w-16 mx-auto rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="font-manrope text-xl font-bold text-surface-white">Elite Coaching Architecture</h4>
                  <p className="text-xs text-surface-white/60 max-w-sm mx-auto">Providing strategic test models and classroom learning rooms designed for pure focus.</p>
                </div>
                <div className="absolute bottom-6 right-6 glass-panel py-2.5 px-4 rounded border-border-light/10 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-ping"></span>
                  <span className="text-xs font-bold text-primary">Active Learning Batch</span>
                </div>
              </div>
            </div>

            {/* Right Advantage List */}
            <div className="w-full lg:w-1/2 text-left space-y-8">
              <div className="space-y-4">
                <h2 className="font-manrope text-3xl font-bold text-primary">The CT CAMPUS Advantage</h2>
                <p className="text-sm text-primary/60 leading-relaxed">
                  We believe that standard bulk classroom models fail to extract the student's true potential. Our entire structure focuses on customized diagnostic cycles.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded bg-success/10 flex items-center justify-center text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-manrope text-lg font-bold text-primary mb-1">One-on-One Guided Mentorship</h4>
                    <p className="text-sm text-primary/60">Dedicated strategizing sessions with experienced mentors to track scores and iron out weak concepts.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded bg-success/10 flex items-center justify-center text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-manrope text-lg font-bold text-primary mb-1">Curated Daily Worklets</h4>
                    <p className="text-sm text-primary/60">Fully comprehensive, up-to-date reading, analytics, and numerical exercises designed around core exam frameworks.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded bg-success/10 flex items-center justify-center text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-manrope text-lg font-bold text-primary mb-1">Active Performance Tracking</h4>
                    <p className="text-sm text-primary/60">Advanced mock dashboard diagnostics to isolate exact pain points and direct corrective assignments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC BLOGS INDEX */}
      {blogs && blogs.length > 0 && (
        <section className="py-20 bg-surface border-b border-border-light">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4 text-left">
              <div>
                <h2 className="font-manrope text-3xl font-bold text-primary">Strategic Exam Insights</h2>
                <p className="text-sm text-primary/60 mt-2">Latest strategic inputs, patterns analyses, and schedules from our coaching expert panel.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post: any) => (
                <article key={post.id} className="bg-surface-white rounded-lg border border-border-light overflow-hidden flex flex-col justify-between hover:ambient-shadow transition-shadow text-left">
                  <div className="p-6">
                    <span className="text-xs font-bold text-focus-teal uppercase tracking-wider block mb-3">{post.category}</span>
                    <h3 className="font-manrope text-lg font-bold text-primary mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-primary/60 line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt || 'Read professional exam strategy notes curated by CT CAMPUS core panel experts.'}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-surface-bright border-t border-border-light flex items-center justify-between text-xs text-primary/50">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(post.created_at).toLocaleDateString('en-IN')}</span>
                    <Link href={`/blog/${post.slug}`} className="text-focus-teal font-bold hover:text-primary transition-colors flex items-center gap-0.5">
                      Read Strategy <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQS SECTION */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 bg-surface-white border-b border-border-light">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
            <div className="text-center mb-16 space-y-3">
              <h2 className="font-manrope text-3xl font-bold text-primary">Academic FAQs</h2>
              <p className="text-sm text-primary/60 max-w-xl mx-auto">Get answers to critical preparation workflows and admission criteria queries.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq: any) => (
                <div key={faq.id} className="p-6 bg-surface rounded border border-border-light text-left">
                  <h4 className="font-manrope text-base font-bold text-primary flex items-start gap-2">
                    <span className="text-focus-teal font-bold">Q.</span>
                    {faq.question}
                  </h4>
                  <p className="text-sm text-primary/60 mt-3 pl-5 leading-relaxed border-l-2 border-focus-teal/30">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOTLINE CTA BANNER */}
      <section className="py-20 bg-primary text-surface-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-gutter relative z-10 space-y-6">
          <h2 className="font-manrope text-3xl font-bold">Launch Your Preparations Journey Today</h2>
          <p className="text-sm text-surface-container/70 max-w-xl mx-auto">
            Secure your seat inside our curated batches. Limited 30-student cohort slots allocated for individual mentorship rigor.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/admissions" 
              className="w-full sm:w-auto font-manrope font-semibold text-primary bg-surface-white hover:bg-surface-container transition-colors px-8 py-4 rounded focus-ring inline-flex items-center justify-center gap-2"
            >
              Start Online Enrollment <ArrowRight className="h-4.5 w-4.5" />
            </Link>
            <a 
              href={`tel:${supportPhone}`} 
              className="w-full sm:w-auto font-manrope font-semibold text-surface-white border border-surface-white/20 hover:border-surface-white transition-colors px-8 py-4 rounded focus-ring inline-flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4.5 w-4.5 text-focus-teal" />
              Call Support: {supportPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
