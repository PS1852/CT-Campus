import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata, getCourseSchema } from '@/lib/seo/metadata';
import { Clock, ChevronRight, CheckCircle2, QrCode } from 'lucide-react';
import JsonLd from '@/components/shared/JsonLd';

export const revalidate = 3600; // recalculate static page caches

export const metadata = generatePageMetadata({
  title: 'CLAT, IPMAT & CUET Courses & Fee Details',
  description: 'Explore the full course fee structure, duration, and curriculum timeline for CLAT law entrances, IPMAT management preps, and CUET success batches at CT CAMPUS Karol Bagh.',
  slug: '/courses',
});

// Fallback courses database
const fallbackCourses = [
  { title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', description: 'Our flagship comprehensive law entrance mentorship program. Designed specifically for CLAT and AILET, this module covers logical reasoning, legal aptitude, English vocabulary, quantitative techniques, and current affairs.', fee: 50000, duration: '1 Year', category: 'CLAT' },
  { title: 'Undergraduate Entrance Foundation', slug: 'undergraduate-entrance-coaching-delhi', description: 'Long-form comprehensive preparation course for early starters. Multi-entrance syllabus bridging CLAT legal frameworks, IPMAT high-level aptitude, and CUET domain parameters over 24 months.', fee: 120000, duration: '2 Years', category: 'Foundation' },
  { title: 'CLAT Target Batch', slug: 'clat-mentorship-delhi', description: 'Fast-paced, highly intensive mock-oriented module designed for students who want a targeted sprint for the upcoming CLAT exam. Daily sectionals, rigorous speed reading exercises, and time-management protocols.', fee: 50000, duration: '6 Months', category: 'CLAT' },
  { title: 'CUET Crash Course', slug: 'cuet-coaching-central-delhi', description: 'Accelerated last-mile intensive revision prep for CUET. Focuses on high-yield topic revision, critical formula sheets, rapid language comprehension skills, and past question paper trends.', fee: 27500, duration: '3 Months', category: 'CUET' },
  { title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', description: 'Integrated Program in Management Aptitude Test prep module. Designed for IIM Indore, Rohtak, and Ranchi. Rigorous preparation on Quant, Verbal, and intensive interview preparation (WAT/PI).', fee: 80000, duration: '1 Year', category: 'IPMAT' },
  { title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', description: 'Targeted subject-matter and general test coaching for Central University Entrance Test (CUET) covering Domain-specific subjects and General Aptitude.', fee: 30000, duration: '6 Months', category: 'CUET' },
];

export default async function CoursesPage() {
  const supabase = createClient();
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('fee', { ascending: true });

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  return (
    <>
      {courses.map((course: any) => (
        <JsonLd
          key={course.slug}
          schema={getCourseSchema({
            title: course.title,
            description: course.description,
            price: course.fee || 0,
            slug: course.slug,
          })}
        />
      ))}
      <div className="py-20 bg-background font-worksans text-primary flex flex-col items-center">
      <div className="w-full max-w-container-max px-margin-mobile md:px-gutter space-y-16">
        
        {/* Page Header */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-focus-teal/10 text-focus-teal font-semibold text-xs uppercase tracking-wider">
            Pricing & Programs
          </div>
          <h1 className="font-manrope text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
            Programs Syllabus & Fees
          </h1>
          <p className="text-sm md:text-base text-primary/60 leading-relaxed">
            At CT CAMPUS, we maintain absolute pricing transparency. All programs include premium booklet couriers, mock testing series, air-conditioned quiet library cabins, and personal strategy coaching logs.
          </p>
        </header>

        {/* Courses Cards List */}
        <main className="space-y-8 text-left">
          {courses.map((course: any) => (
            <div
              key={course.slug}
              className="bg-surface-white border border-border-light rounded p-6 md:p-8 hover:ambient-shadow transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Card info */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-bold bg-focus-teal/10 text-focus-teal rounded-full uppercase">
                    {course.category}
                  </span>
                  <span className="text-xs text-primary/45 font-semibold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                </div>
                
                <h2 className="font-manrope text-2xl md:text-3xl font-bold text-primary">
                  {course.title}
                </h2>
                
                <p className="text-sm text-primary/60 leading-relaxed">
                  {course.description}
                </p>

                {/* Advantage bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-semibold text-primary/70">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    1-on-1 strategic alumni audits
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    Daily passage booklets & exercises
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    80+ full national diagnostic mocks
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    A/C quiet study library cabin credits
                  </span>
                </div>
              </div>

              {/* Pricing & checkout panel */}
              <div className="lg:col-span-4 bg-surface border border-border-light rounded p-6 flex flex-col justify-between items-center text-center lg:items-end lg:text-right h-full space-y-6 lg:space-y-0">
                <div className="space-y-1.5 font-semibold">
                  <span className="text-[10px] uppercase font-bold text-primary/40 block">Program Mentorship Fee</span>
                  <span className="text-3xl font-extrabold text-primary block">
                    ₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'}
                  </span>
                  <span className="text-[10px] text-primary/45 block">
                    *Installment plans available on enquiry
                  </span>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Link
                    href={`/admissions?course=${course.slug}`}
                    className="w-full bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3 px-4 rounded transition-colors text-center text-sm flex items-center justify-center gap-1"
                  >
                    Start Online Enrollment
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full border border-border-light hover:border-focus-teal text-primary font-manrope font-bold py-3 px-4 rounded transition-colors text-center text-sm bg-surface-white"
                  >
                    Book Campus Trial
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </main>

        {/* Custom batch enquiry banner */}
        <section className="bg-primary text-surface-white rounded-lg p-8 md:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="font-manrope text-2xl md:text-3xl font-bold">Custom Strategic Routines</h3>
            <p className="text-sm text-surface-container/60 leading-relaxed">
              Current batch slots vary by program, intake, and faculty availability. Contact our academic advisors to enquire about the latest class timing options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href={`https://wa.me/91${supportPhone}?text=Hi%20CT%20Campus%20Mentor,%20I'm%20interested%20in%20current%20batch%20timing%20options%20for%20the%20coaching%20programs.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2 focus-ring"
              >
                Strategy Consultation Timings
              </a>
              <Link
                href="/contact"
                className="w-full border border-surface-white/20 hover:border-surface-white text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center focus-ring"
              >
                Center Directions
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
    </>
  );
}
