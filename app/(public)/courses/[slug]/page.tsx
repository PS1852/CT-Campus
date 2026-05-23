import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import JsonLd from '@/components/shared/JsonLd';
import { getCourseSchema, getBreadcrumbSchema } from '@/lib/seo/metadata';
import { Calendar, Clock, Award, ShieldCheck, ArrowLeft, MessageSquare, PhoneCall, Check } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps) {
  const supabase = createClient();
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!course) {
    return {
      title: 'Course Not Found | CT CAMPUS',
    };
  }

  return {
    title: `${course.title} Coaching Delhi | CT CAMPUS`,
    description: course.description.substring(0, 155),
    alternates: {
      canonical: `https://ctcampus.co.in/courses/${params.slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const supabase = createClient();
  
  // Fetch specific course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!course) {
    notFound();
  }

  // Fetch sibling courses for side recommendations
  const { data: otherCourses } = await supabase
    .from('courses')
    .select('title, slug, category, fee')
    .neq('id', course.id)
    .limit(3);

  // Fallback / standard program features
  const features = [
    'Complete syllabus tracking with daily diagnostic metrics',
    'Silent air-conditioned library cabins access during campus hours',
    'Personal NLU / IIM alumni assigned as your personal coach',
    '80+ national level simulated mock tests with deep video audits',
    'Comprehensive static and passage-based booklet courier services',
    'Weekly parents-mentor counseling dashboard sync sessions',
  ];

  const courseSchema = getCourseSchema({
    title: course.title,
    description: course.description,
    price: course.fee,
    slug: course.slug,
  });

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'Courses', item: '/courses' },
    { name: course.title, item: `/courses/${course.slug}` },
  ]);

  return (
    <>
      <JsonLd schema={courseSchema} />
      <JsonLd schema={breadcrumbsSchema} />

      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          {/* Back button */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Main course details */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-surface border border-accent/20 text-accent rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-muted flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    {course.duration}
                  </span>
                </div>
                
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                  {course.title}
                </h1>
              </div>

              {/* Fee and Timing Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-surface border border-border p-6 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1">
                    Course Mentorship Fee
                  </span>
                  <span className="text-2xl font-extrabold text-primary">
                    ₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'}
                  </span>
                  <span className="text-xs text-muted block mt-1">
                    Complete package (No recurring charges)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted block mb-1">
                    Available Batch Timings
                  </span>
                  <span className="text-sm font-semibold text-primary block leading-normal">
                    Talk to Mentor for batch details
                  </span>
                  <span className="text-xs text-muted block mt-1">
                    *Custom slots allocated post career consultation
                  </span>
                </div>
              </div>

              {/* Course Long Description */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-primary">
                  Course Overview & Syllabus Scope
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* Features checklist */}
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-primary">
                  What is Included in Your Enrollment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex gap-3 items-start bg-white border border-border/60 p-4 rounded-xl shadow-sm">
                      <div className="bg-success/10 text-success p-1 rounded-full shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <p className="text-xs sm:text-sm text-primary/80 font-medium text-left">
                        {feat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Form and Other Programs */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Contextual Inquiry Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft">
                <h3 className="font-display text-xl font-bold text-primary mb-1">
                  Enquire About This Program
                </h3>
                <p className="text-xs text-muted mb-6">
                  Schedule a free counselling call with our NLU/IIM advisors regarding {course.title}.
                </p>
                <HomeInquiryForm courses={[course]} />
              </div>

              {/* Campus physical address card */}
              <div className="bg-primary text-background p-6 rounded-2xl space-y-4">
                <div className="bg-background text-primary p-2 rounded-lg inline-flex items-center justify-center">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <h4 className="font-display text-lg font-bold">CT CAMPUS Karol Bagh</h4>
                <p className="text-xs text-background/70 leading-relaxed">
                  Opposite Metro Pillar 80, Pusa Road. Drop by our campus for direct counselor alignment, library cabin visits, and printed booklets audits.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1"
                >
                  Get Directions & Hours
                  <span>→</span>
                </Link>
              </div>

              {/* Other Courses Links */}
              {otherCourses && otherCourses.length > 0 && (
                <div className="border border-border bg-white p-6 rounded-2xl space-y-4 text-left">
                  <h4 className="font-display text-lg font-bold text-primary border-b border-border pb-2">
                    Other Mentorship Tracks
                  </h4>
                  <div className="space-y-4">
                    {otherCourses.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/courses/${c.slug}`}
                        className="block group hover:bg-surface p-2 rounded-lg transition-colors border-b border-border/40 last:border-0 pb-3"
                      >
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                          {c.category}
                        </span>
                        <span className="font-semibold text-primary group-hover:text-accent transition-colors block text-sm sm:text-base mt-1">
                          {c.title}
                        </span>
                        <span className="text-xs text-muted block mt-0.5">
                          Fee: ₹{c.fee.toLocaleString('en-IN')}
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
