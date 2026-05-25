import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { GraduationCap, Award, BookOpen, Clock, FileText, AlertCircle, Calendar, MessageSquare, PhoneCall, QrCode, Mail } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const supabase = createClient();
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';
  const coachingEmail = process.env.NEXT_PUBLIC_COACHING_EMAIL || 'ctcampus2019@gmail.com';

  // Load user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="py-20 text-center font-worksans text-primary space-y-4">
        <AlertCircle className="h-10 w-10 text-focus-teal mx-auto animate-bounce" />
        <h3 className="font-manrope text-xl font-bold">Authentication Required</h3>
        <p className="text-sm text-primary/60 max-w-sm mx-auto">Please sign in to your student portal account to review enrollment status.</p>
        <Link 
          href="/login" 
          className="inline-block bg-primary hover:bg-focus-teal text-surface-white font-manrope font-bold py-2.5 px-6 rounded transition-colors text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Load student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Load admissions applications
  let studentAdmissions: any[] = [];
  if (profile) {
    const { data: admissions } = await supabase
      .from('admissions')
      .select(`
        id,
        status,
        payment_submitted,
        created_at,
        courses (
          title,
          category,
          fee
        )
      `)
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false });

    if (admissions) {
      studentAdmissions = admissions;
    }
  }

  return (
    <div className="space-y-8 text-left font-worksans text-primary">
      {/* Welcome Board */}
      <header className="space-y-2">
        <h1 className="font-manrope text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
          Welcome Back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="text-sm text-primary/60">
          Track admissions audits, review batch timing updates, and view campus cabin coordinates opposite Pillar 80 Karol Bagh.
        </p>
      </header>

      {/* Grid splits */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Status tracker and Mock timetables */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Admissions Tracker */}
          <div className="bg-surface-white border border-border-light rounded p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-manrope text-lg md:text-xl font-bold text-primary border-b border-border-light pb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-focus-teal" />
              Admissions Placement Ledger
            </h3>

            <div className="space-y-4">
              {studentAdmissions && studentAdmissions.length > 0 ? (
                studentAdmissions.map((adm) => {
                  const appliedDate = new Date(adm.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <div key={adm.id} className="border border-border-light rounded p-5 flex flex-col sm:flex-row sm:items-center justify-between bg-surface/30 gap-4">
                      <div className="space-y-1">
                        <h4 className="font-manrope font-bold text-primary text-base leading-snug">
                          {adm.courses?.title || 'Entrance Course Cohort'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-primary/45 font-semibold">
                          <span>Applied on: {appliedDate}</span>
                          <span>•</span>
                          <span>Category: {adm.courses?.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {adm.status === 'pending' && !adm.payment_submitted && (
                          <Link 
                            href={`/fees?admission_id=${adm.id}`}
                            className="bg-focus-teal hover:bg-secondary text-surface-white text-xs font-manrope font-bold px-4 py-2 rounded focus-ring inline-flex items-center gap-1.5 transition-colors"
                          >
                            <QrCode className="h-4 w-4" />
                            Settle Fees
                          </Link>
                        )}
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${
                          adm.status === 'approved'
                            ? 'bg-success/10 border-success/30 text-success'
                            : adm.status === 'pending_verification'
                            ? 'bg-focus-teal/10 border-focus-teal/30 text-focus-teal'
                            : 'bg-primary/5 border-border-light text-primary/45'
                        }`}>
                          {adm.status === 'pending_verification' ? 'Audit Pending' : adm.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-primary/45 text-xs font-semibold space-y-4">
                  <p>You have no active admissions applications logged.</p>
                  <Link 
                    href="/admissions" 
                    className="inline-flex bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-2.5 px-6 rounded transition-colors text-xs"
                  >
                    Submit Admissions Form
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Timetable Calendar */}
          <div className="bg-surface-white border border-border-light rounded p-6 md:p-8 space-y-6 shadow-sm text-left">
            <h3 className="font-manrope text-lg md:text-xl font-bold text-primary border-b border-border-light pb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-focus-teal" />
              Batch Schedules & Timelines
            </h3>
            
            <div className="border border-border-light rounded p-6 bg-surface/30 text-center space-y-3 font-semibold">
              <p className="text-xs text-primary/60 leading-relaxed">
                Your personal exam prep timetable calendar is currently under scheduling. Once manual QR payment settles and document audit verifies, class calendar tracks will load instantly.
              </p>
              <div className="text-[10px] text-focus-teal uppercase tracking-widest pt-2">Standard Batch Timings:</div>
              <p className="text-xs text-primary/80">Morning Cohorts (8:30 AM - 11:30 AM) | Evening Cohorts (4:30 PM - 7:30 PM)</p>
            </div>
          </div>

        </div>

        {/* Right Column: Cabin Allocation & Helpline Cards */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Silent study cabin cards */}
          <div className="bg-primary text-surface-white rounded-lg p-6 md:p-8 space-y-4">
            <div className="bg-surface-white text-primary p-2.5 rounded inline-flex items-center justify-center h-10 w-10">
              <GraduationCap className="h-6 w-6 text-focus-teal" />
            </div>
            <h4 className="font-manrope text-lg font-bold">Silent Library Cabins Allocation</h4>
            <p className="text-xs text-surface-container/60 leading-relaxed">
              Every strategic enrolee obtains personal AC sound-damped study cabin allocations at our WEA Karol Bagh campus for peaceful mocks practice and notes cataloging.
            </p>
            <div className="pt-2 text-xs font-bold text-focus-teal flex items-center gap-1.5 border-t border-surface-container/10">
              <Clock className="h-4 w-4" /> Open Hours: Mon - Sun, 9AM - 8PM
            </div>
          </div>

          {/* Mentorship Hotline */}
          <div className="bg-surface-white border border-border-light rounded p-6 shadow-sm space-y-3 font-semibold text-xs text-primary/60">
            <h4 className="font-manrope text-sm font-bold text-primary border-b border-border-light pb-2">
              Strategic Helpdesk
            </h4>
            <p className="leading-relaxed">For urgent queries regarding mocks patterns, booklet shipping, or cabinet keys, reach center desk coordinators immediately.</p>
            <div className="pt-2 flex flex-col gap-2 font-bold">
              <a href={`tel:${supportPhone}`} className="text-focus-teal hover:underline flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5" /> Call Advisor: +91 {supportPhone}
              </a>
              <a href={`mailto:${coachingEmail}`} className="text-primary/45 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary/45" /> {coachingEmail}
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
