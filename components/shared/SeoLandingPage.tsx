import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { MapPin, PhoneCall, CheckCircle2, Trophy, Clock, GraduationCap, ArrowRight } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';

interface SeoLandingPageProps {
  category: 'CLAT' | 'IPMAT' | 'CUET' | 'Foundation';
  locationName: string;
  keywordTitle: string;
  slug: string;
}

// Fallback courses data if database load fails
const fallbackCourses = [
  { title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', description: 'Our flagship comprehensive law entrance mentorship program. Designed specifically for CLAT and AILET, this module covers logical reasoning, legal aptitude, English vocabulary, quantitative techniques, and current affairs. Highly structured study materials, weekly mock trials, and personalized feedback sessions with NLU alumni.', fee: 50000, duration: '1 Year', category: 'CLAT' },
  { title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', description: 'Integrated Program in Management Aptitude Test prep module. Designed for IIM Indore, IIM Rohtak, and IIM Ranchi undergraduate entrance. Rigorous preparation on Quantitative Ability (multiple choice and short answers), Verbal Ability, and intensive interview preparation (WAT/PI). Prepares candidates for premium management streams right after Class 12.', fee: 80000, duration: '1 Year', category: 'IPMAT' },
  { title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', description: 'Targeted subject-matter and general test coaching for Central University Entrance Test (CUET). Extensive preparation for Section IA/IB (Languages), Section II (Domain-specific subjects including Legal Studies, Business Studies, Economics, History, and political science), and Section III (General Test: General Knowledge, Current Affairs, Mental Ability, Numerical Ability, Reasoning).', fee: 30000, duration: '6 Months', category: 'CUET' },
];

export default async function SeoLandingPage({
  category,
  locationName,
  keywordTitle,
  slug,
}: SeoLandingPageProps) {
  const supabase = createClient();

  // Load course details
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('category', category)
    .eq('is_active', true);

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses.filter(c => c.category === category);

  // Load relevant FAQs
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .limit(4);

  return (
    <div className="bg-background text-left">
      {/* LOCAL HERO SECTION */}
      <section className="relative overflow-hidden bg-surface py-16 sm:py-24 border-b border-border">
        <div className="absolute inset-0 glow-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-accent text-xs font-semibold uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5" />
                Premium Offline Coaching — {locationName}
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                {keywordTitle}
              </h1>
              
              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                Looking for elite mentorship to crack {category} in {locationName}? CT CAMPUS offers restricted batch structures of strictly 30 seats, ensuring personalized 1-on-1 strategy sessions, Mock audits, and booklet couriers under NLU/IIM alumni.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/admissions" className="btn-primary flex items-center justify-center gap-2 group">
                  Apply for Admission
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-secondary flex items-center justify-center gap-2 bg-white">
                  <PhoneCall className="h-4 w-4 text-accent" />
                  Free Diagnostic consultation
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-border rounded-2xl shadow-soft">
              <h3 className="font-display text-xl font-bold text-primary mb-2">
                Request Scholarship Options
              </h3>
              <p className="text-xs text-muted mb-6">
                Enter your details to enquire about admissions, diagnostic mock options, and current batch timing availability.
              </p>
              <HomeInquiryForm courses={courses} />
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED COURSE GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-primary mb-12 text-center lg:text-left">
          {category} Mentorship Timelines & Fee Structures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course: any) => (
            <div key={course.slug} className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-soft transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-surface border border-accent/20 text-accent rounded-full uppercase">
                    {course.category}
                  </span>
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-primary">{course.title}</h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">{course.description}</p>
                
                {/* USP list */}
                <div className="space-y-2 pt-2 text-xs font-semibold text-primary/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Personal NLU/IIM alumni strategist
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Silent air-conditioned cabin desk access
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Program Fee</span>
                  <span className="text-lg font-bold text-primary">₹{course.fee ? course.fee.toLocaleString('en-IN') : 'N/A'}</span>
                </div>
                <Link href={`/courses/${course.slug}`} className="btn-primary text-xs min-h-[40px] px-4 py-2">
                  View Timings Timetable
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEED FAQ PANEL ACCORDION */}
      {faqs && faqs.length > 0 && (
        <section className="py-20 border-t border-border bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-12 text-center">
              Frequently Asked Questions for {category}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq: any, idx: number) => (
                <details
                  key={idx}
                  className="group border border-border bg-white rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                >
                  <summary className="flex items-center justify-between gap-4 font-semibold text-primary text-sm sm:text-base list-none">
                    <span>{faq.question}</span>
                    <span className="transition-transform group-open:rotate-180 text-accent font-bold shrink-0">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50 pt-4 text-left">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CAMPUS LOCAL DIRECTORY FOOTER */}
      <section className="py-16 bg-primary text-background border-t border-primary/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 glow-gradient pointer-events-none opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <h2 className="font-display text-3xl font-bold">
            Visit Our Karol Bagh Mentorship Center
          </h2>
          <p className="text-background/70 max-w-xl mx-auto text-sm">
            Located centrally at 5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks. Drop by today to meet our directors Abhinav Sir and Dr. Shruti to secure your seat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/contact" className="btn-primary bg-accent hover:bg-accent/90 text-primary">
              Get Campus Directions
            </Link>
            <Link href="/admissions" className="btn-secondary bg-[#0f0f20] border-border/10 text-background hover:bg-[#151530]">
              Online Application Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
