import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Award, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Expert Faculty & Mentors | CT CAMPUS Karol Bagh',
  description: 'Meet our senior law and management entrance faculty board. Highly experienced mentors, National Law University (NLU) rankers, and IIM alumni.',
  slug: '/faculty',
});

const faculties = [
  { name: 'Abhinav Saxena', role: 'Head of Legal & CLAT Mentorship', credentials: 'B.A. LL.B. (Hons) — NLSIU Bangalore Ranker', experience: '8+ Years teaching Law Entrances', bio: 'Former corporate lawyer turned educational director. Abhinav has mentored over 1,200 successful law aspirants into top-tier National Law Universities (NLUs) worldwide.' },
  { name: 'Dr. Shruti Iyer', role: 'Director of Quantitative Aptitude & IPMAT Coordinator', credentials: 'Ph.D. in Applied Mathematics — IIM Ahmedabad WAT/PI Panelist', experience: '12+ Years teaching Competitive Aptitude', bio: 'Dr. Shruti specializes in high-speed calculation shortcuts and data interpretation tables. Her targeted preparation pipelines ensure standard candidates clear IIM Indore and Rohtak thresholds.' },
  { name: 'Kabir Mehrotra', role: 'Head of Verbal Ability & Reading Comprehension', credentials: 'M.A. in English Literature — St. Stephen’s College', experience: '7+ Years expert in Comprehension and Para-jumbles', bio: 'Kabir uses cognitive mapping to help students speed-read complex editorials and philosophical passages with zero layout confusion, securing top percentiles in CLAT and CUET Section I.' },
];

export default function FacultyPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Expert Faculty Board
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Learn from NLSIU Bangalore & IIM Alumni Directors
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            At CT CAMPUS, our students are mentored directly by directors who have cleared these prestigious entrances themselves. We do not recruit part-time tutors; all classes are taught by industry professionals.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {faculties.map((f, idx) => (
            <div key={idx} className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-soft transition-all duration-300">
              <div className="space-y-4">
                {/* Header Icon */}
                <div className="bg-surface text-accent p-3.5 rounded-xl inline-flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                
                {/* Details */}
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-primary">{f.name}</h3>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider">{f.role}</p>
                </div>

                <div className="space-y-2 text-xs border-y border-border/80 py-3">
                  <div className="flex items-center gap-2 text-primary/80 font-medium">
                    <Award className="h-4 w-4 text-accent shrink-0" />
                    <span>{f.credentials}</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary/80 font-medium">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <span>{f.experience}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                  {f.bio}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60">
                <Link
                  href="/contact"
                  className="btn-secondary w-full text-xs min-h-[40px] flex items-center justify-center"
                >
                  Book 1-on-1 Strategy Call
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Local Advantage Banner */}
        <div className="mt-16 bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="font-display text-2xl font-bold text-primary">
              Personal Strategic Counselor Assignation
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              When you enroll at our Karol Bagh center, you are immediately assigned one of these directors as your personal counsellor. They audit your weekly diagnostic mocks, review your mistake logs, and counsel you dynamically.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center w-full">
            <Link
              href="/contact"
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              Reach Karol Bagh Campus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
