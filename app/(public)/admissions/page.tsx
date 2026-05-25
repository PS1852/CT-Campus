import React from 'react';
import Image from 'next/image';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { createClient } from '@/lib/supabase/server';
import { PhoneCall, Mail } from 'lucide-react';
import AdmissionForm from '@/components/sections/AdmissionForm';

export const metadata = generatePageMetadata({
  title: 'Admissions & Enrollment Process | CT CAMPUS',
  description: 'Apply online for CLAT law mentorship, IIM IPMAT aptitude preparation, and CUET exam prep courses. Review our 4-step admission process.',
  slug: '/admissions',
});

// Fallback courses list
const fallbackCourses = [
  { id: 'f1a82736-b0d6-4667-880a-bc3e9b7c322a', title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', category: 'CLAT' },
  { id: '551ae500-4057-4fe0-aa6b-887b004c566d', title: 'Undergraduate Entrance Foundation', slug: 'undergraduate-entrance-coaching-delhi', category: 'Foundation' },
  { id: '381a710f-19fa-42f9-b4e7-e0830fe466ac', title: 'CLAT Target Batch', slug: 'clat-mentorship-delhi', category: 'CLAT' },
  { id: '619bc63c-12b3-4fd5-b926-10a313cd9aac', title: 'CUET Crash Course', slug: 'cuet-coaching-central-delhi', category: 'CUET' },
  { id: 'e8cec99d-b29c-4656-95f3-03d75aa4c39c', title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', category: 'IPMAT' },
  { id: '92261f6f-82d1-4c3c-b9a4-1abf24f0a9ab', title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', category: 'CUET' },
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
    <div className="py-20 bg-background font-worksans text-primary flex flex-col items-center">
      {/* Header Info */}
      <header className="w-full max-w-[800px] text-center px-margin-mobile md:px-0 mb-12 space-y-4">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="CT CAMPUS Logo"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-focus-teal/10 text-focus-teal font-semibold text-xs uppercase tracking-wider">
          Student Enrollment
        </div>
        <h1 className="font-manrope text-3xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
          Admissions & Registration
        </h1>
        <p className="text-sm md:text-base text-primary/70 leading-relaxed max-w-2xl mx-auto">
          Welcome to the CT CAMPUS student admissions portal. Batch enrollment slots are allocated under rigorous strategy checks. Complete the steps below to secure your placement.
        </p>
      </header>

      {/* Main Form container (Narrowed 8-column layout / approx 800px) */}
      <main className="w-full max-w-[800px] bg-surface-white border border-border-light rounded-lg shadow-sm overflow-hidden px-margin-mobile md:px-0">
        {/* Progress Tracker */}
        <div className="px-6 py-4 border-b border-border-light bg-surface">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-light z-0"></div>
            
            {/* Step 1 (Active) */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-surface px-4">
              <div className="w-8 h-8 rounded-full bg-focus-teal flex items-center justify-center border-4 border-surface text-surface-white font-bold text-sm">
                1
              </div>
              <span className="font-manrope text-xs font-bold text-primary">Registration</span>
            </div>

            {/* Step 2 (Pending) */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-surface px-4">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border-4 border-surface text-primary/45 font-bold text-sm">
                2
              </div>
              <span className="font-manrope text-xs font-semibold text-primary/45">Payment Details</span>
            </div>
          </div>
        </div>

        {/* Form panel body */}
        <div className="p-6 md:p-10 space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-manrope text-2xl font-bold text-primary">Academic Information Form</h2>
            <p className="text-sm text-primary/60">Fill out your target coaching programs and upload documents securely.</p>
          </div>

          <AdmissionForm courses={courses} />
        </div>
      </main>

      {/* Registration Support */}
      <section className="w-full max-w-[800px] mt-12 text-left px-margin-mobile md:px-0">
        {/* Support Helpdesks */}
        <div className="bg-primary text-surface-white rounded-lg p-6 md:p-8 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-manrope text-lg font-bold text-surface-white">Need Registration Help?</h3>
            <p className="text-xs md:text-sm text-surface-container/60 leading-relaxed mt-2">
              Contact our Karol Bagh helpdesk if you run into files upload glitches or have queries regarding installment schedules.
            </p>
          </div>
          <div className="space-y-2 pt-4 border-t border-surface-container/10 text-xs">
            <a href={`tel:${supportPhone}`} className="flex items-center gap-2 text-focus-teal font-bold hover:text-surface-white transition-colors">
              <PhoneCall className="h-4 w-4" /> Call Mentor: +91 {supportPhone}
            </a>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${coachingEmail}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-surface-white/60 hover:text-focus-teal transition-colors">
              <Mail className="h-4 w-4" /> {coachingEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
