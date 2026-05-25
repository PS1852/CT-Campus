import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, UserCheck, CreditCard, FileText, CalendarRange } from 'lucide-react';
import AdmissionForm from '@/components/sections/AdmissionForm';

export const metadata = generatePageMetadata({
  title: 'Admissions & Enrollment Process | CT CAMPUS',
  description: 'Apply online for CLAT law mentorship, IIM IPMAT aptitude preparation, and CUET exam prep courses. Review our 4-step admission process.',
  slug: '/admissions',
});

// Fallback courses list if database is unreachable
const fallbackCourses = [
  { id: '1', title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', category: 'CLAT' },
  { id: '2', title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', category: 'IPMAT' },
  { id: '3', title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', category: 'CUET' },
];

export default async function AdmissionsPage() {
  const supabase = createClient();
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';
  const coachingEmail = process.env.NEXT_PUBLIC_COACHING_EMAIL || 'ctcampus2019@gmail.com';

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('id, title, slug, category')
    .eq('is_active', true);

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  return (
    <div className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Apply Online
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Admissions Process & Online Registration
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Welcome to the CT CAMPUS enrollment portal. Since we restrict our batch sizes to 30 students to maintain absolute 1-on-1 strategic focus, admissions are cataloged via a review. Follow the steps below to secure your seat.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { step: '01', icon: FileText, title: 'Apply Online', desc: 'Fill out the online application below specifying your course interest and academic background.' },
            { step: '02', icon: UserCheck, title: 'Mentor Sync', desc: 'Schedule and clear a strategic mock evaluation call with our senior NLU / IIM advisors.' },
            { step: '03', icon: CalendarRange, title: 'Batch Allocation', desc: 'Select your preferred slot: morning dropouts, evening school-goers, or weekend tracks.' },
            { step: '04', icon: CreditCard, title: 'Secure Enrollment', desc: 'Settle the program fee or arrange interest-free monthly installments to lock down your silent library cabin.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-border/60 rounded-xl p-6 relative hover:shadow-soft transition-shadow">
                <span className="absolute top-4 right-4 text-3xl font-extrabold text-accent/15 font-display">{item.step}</span>
                <div className="bg-surface text-accent p-3 rounded-lg inline-flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Two Column Form + Information grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Wrapper */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft">
            <h2 className="font-display text-2xl font-bold text-primary mb-2">
              Online Admission Application
            </h2>
            <p className="text-sm text-muted mb-8">
              Please enter your academic credentials below. If you already have a student account, please login first to link your profile automatically.
            </p>
            <AdmissionForm courses={courses} />
          </div>

          {/* Right Column: Scholarship & Eligibility Rules */}
          <div className="lg:col-span-5 space-y-8">
            {/* Scholarship Card */}
            <div className="bg-surface border border-accent/25 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-xl font-bold text-primary">
                CT CAMPUS Scholarships
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                We believe financial constraints should never block academic excellence. We award direct fee waivers of up to 50% based on:
              </p>
              <ul className="space-y-3 text-sm text-primary/80 font-medium pt-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  Class 10 or 12 Board score thresholds (95%+ equals direct 30% discount).
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  Score margins cleared in our offline diagnostic mock test.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  Reserved quotas for wards of educators and defence veterans.
                </li>
              </ul>
              <div className="pt-4 text-xs text-muted italic">
                *Submit your board marksheets or mock trials results directly in the admission form.
              </div>
            </div>

            {/* Helpline Card */}
            <div className="bg-primary text-background rounded-2xl p-6 sm:p-8 space-y-4 text-left">
              <h3 className="font-display text-lg font-bold">Need Immediate Help?</h3>
              <p className="text-xs text-background/70 leading-relaxed">
                If you encounter any glitches during online document submission or need help regarding payment installments structures, contact our Karol Bagh helpdesk immediately.
              </p>
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="font-semibold text-accent">Phone: +91 {supportPhone}</div>
                <div className="text-background/80">Email: {coachingEmail}</div>
                <div className="text-background/80 font-semibold">Location: Karol Bagh Campus Opp. Pillar 80</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
