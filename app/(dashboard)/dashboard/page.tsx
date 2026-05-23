import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { GraduationCap, Award, BookOpen, Clock, FileText, AlertCircle, Heart } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const supabase = createClient();

  // Load authenticated user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="py-12 text-center text-muted font-medium text-xs">
        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2 animate-bounce" />
        <span>Authentication required. Please login to proceed.</span>
      </div>
    );
  }

  // Load student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Load student admissions applications
  let studentAdmissions: any[] = [];
  if (profile) {
    const { data: admissions } = await supabase
      .from('admissions')
      .select(`
        id,
        status,
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
    <div className="space-y-8 text-left">
      {/* Welcome banner */}
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="text-sm text-muted">
          Track admissions logs, consult class calendars, and view receipt summaries opposite Pillar 80 Karol Bagh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Admissions Tracker & timetables */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Admissions Application Status */}
          <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Admissions Status Tracker
            </h3>

            <div className="space-y-4">
              {studentAdmissions && studentAdmissions.length > 0 ? (
                studentAdmissions.map((adm) => {
                  const submittedAt = new Date(adm.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div key={adm.id} className="border border-border/60 rounded-xl p-4 flex justify-between items-center bg-surface/20">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-primary text-sm sm:text-base leading-normal">
                          {adm.courses?.title || 'Course Mentorship'}
                        </h4>
                        <span className="text-[10px] text-muted block">Applied on: {submittedAt}</span>
                      </div>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        adm.status === 'submitted'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : adm.status === 'approved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-red-50 border-red-200 text-red-600'
                      }`}>
                        {adm.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-muted text-xs font-medium space-y-3">
                  <p>You have no active admissions applications logged under this account.</p>
                  <Link href="/admissions" className="btn-primary text-xs min-h-[36px] px-4 py-2 inline-flex items-center">
                    Submit Online Application
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Timetable schedule (Mock) */}
          <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Active Timetable Schedule
            </h3>
            
            <div className="border border-border/80 rounded-xl p-5 text-center text-xs text-muted leading-relaxed">
              <p>Your program batch timings are currently being scheduled. Once the Karol Bagh frontdesk verifies marksheets and secures fee allocation, your active calendar timeline will load here.</p>
              <span className="font-semibold text-accent block mt-3 font-body">Standard Timing Options:</span>
              <span className="text-primary mt-1 block">Morning slots (8:30 AM - 11:30 AM) | Evening slots (4:30 PM - 7:30 PM)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Cabin Load Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Silent study cabin info */}
          <div className="bg-primary text-background rounded-2xl p-6 sm:p-8 space-y-4 text-left">
            <div className="bg-background text-primary p-2 rounded-lg inline-flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-display text-lg font-bold">Silent Library study Cabins</h4>
            <p className="text-xs text-background/70 leading-relaxed">
              Every CT Campus enrollee secures free, customized quiet library cabins access at our Karol Bagh campus. Located opposite Pillar 80 Karol Bagh.
            </p>
            <div className="pt-2 text-xs font-semibold text-accent flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Open Hours: Mon - Sun, 9AM - 8PM
            </div>
          </div>

          {/* Quick Helpline */}
          <div className="border border-border bg-white rounded-2xl p-6 space-y-3 text-left text-xs text-muted leading-relaxed">
            <h4 className="font-display font-bold text-primary text-sm sm:text-base border-b border-border pb-2">
              Mentorship Helpline
            </h4>
            <p>For urgent questions regarding Mock schedules, coupon codes, or printed booklet shipping, call our campus advisors.</p>
            <div className="font-semibold text-accent pt-1">Phone Helpline: +91 8800833665</div>
          </div>
        </div>
      </div>
    </div>
  );
}
