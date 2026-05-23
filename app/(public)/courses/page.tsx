import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { BookOpen, Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export const revalidate = 3600; // Recalculate static page every 1 hour

export const metadata = generatePageMetadata({
  title: 'CLAT, IPMAT & CUET Courses & Fee Details',
  description: 'Explore the full course fee structure, duration, and curriculum timeline for CLAT law entrances, IPMAT management preps, and CUET success batches at CT CAMPUS Karol Bagh.',
  slug: '/courses',
});

// Fallback courses database if empty
const fallbackCourses = [
  { title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', description: 'Our flagship comprehensive law entrance mentorship program. Designed specifically for CLAT and AILET, this module covers logical reasoning, legal aptitude, English vocabulary, quantitative techniques, and current affairs.', fee: 50000, duration: '1 Year', category: 'CLAT' },
  { title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', description: 'Integrated Program in Management Aptitude Test prep module. Designed for IIM Indore, Rohtak, and Ranchi. Rigorous preparation on Quant, Verbal, and intensive interview preparation (WAT/PI).', fee: 80000, duration: '1 Year', category: 'IPMAT' },
  { title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', description: 'Targeted subject-matter and general test coaching for Central University Entrance Test (CUET) covering Domain-specific subjects and General Aptitude.', fee: 30000, duration: '6 Months', category: 'CUET' },
];

export default async function CoursesPage() {
  const supabase = createClient();

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('fee', { ascending: false });

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  return (
    <div className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Comprehensive Mentorship Programs & Fees
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            At CT CAMPUS, we maintain absolute fee transparency. Our coaching modules include all premium study materials, offline library cabin credits, national-level test series, and personalized mentor sessions. No hidden costs.
          </p>
        </div>

        {/* Courses Lists Stacked Mobile First */}
        <div className="space-y-12">
          {courses.map((course: any) => (
            <div
              key={course.slug}
              className="bg-white border border-border rounded-2xl p-6 sm:p-8 hover:shadow-soft transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Title & Description */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-semibold bg-surface border border-accent/20 text-accent rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                </div>
                
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
                  {course.title}
                </h2>
                
                <p className="text-sm text-muted leading-relaxed">
                  {course.description}
                </p>

                {/* Features inline list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-medium text-primary/80">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    1-on-1 NLU/IIM Alumni Strategy Audits
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    Exhaustive NCERT / Passage Material
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    80+ National Level Simulated Mocks
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    Silent Air-Conditioned Cabins Access
                  </span>
                </div>
              </div>

              {/* Right Column: Pricing details */}
              <div className="lg:col-span-4 bg-surface border border-border/80 rounded-xl p-6 flex flex-col justify-between items-center text-center lg:items-end lg:text-right h-full">
                <div className="space-y-1 mb-6 lg:mb-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted block">
                    Mentorship Fee (One-Time)
                  </span>
                  <span className="text-3xl font-extrabold text-primary block">
                    ₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'}
                  </span>
                  <span className="text-xs text-muted block pt-1">
                    *Installment options available on approval
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full mt-4">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="btn-primary w-full text-center flex items-center justify-center gap-2"
                  >
                    View Batch Timings
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admissions?course=${course.slug}`}
                    className="btn-secondary w-full text-center flex items-center justify-center bg-white"
                  >
                    Apply for Admission
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA Info banner */}
        <div className="mt-16 bg-primary text-background rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 glow-gradient pointer-events-none opacity-10" />
          <div className="max-w-2xl mx-auto space-y-6 relative">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Looking for Specialized Batch Schedules?
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              We offer customizable morning, evening, and weekend batches for school going, college students, and dropouts. If you have custom schedule requirements, our mentors can map out a custom routine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918800833665?text=Hi%20CT%20Campus%20Mentor,%20I'm%20interested%20in%20custom%20batch%20timings%20for%20the%20coaching%20programs."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-accent hover:bg-accent/90 text-primary flex items-center justify-center gap-2"
              >
                Talk to Mentor for Timings
              </a>
              <Link
                href="/contact"
                className="btn-secondary bg-[#0f0f20] border-border/10 text-background hover:bg-[#151530] flex items-center justify-center"
              >
                Reach Our Campus Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
