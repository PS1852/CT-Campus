import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Trophy, Award, CheckCircle2, Milestone } from 'lucide-react';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Our Results & Top Ranks | CT CAMPUS',
  description: 'Explore the outstanding track record of CT CAMPUS. Meet our CLAT All India Rankers, IPMAT IIM admits, and CUET 100th percentilers from New Delhi.',
  slug: '/results',
});

const results = [
  { student: 'Pranav Malhotra', rank: 'AIR 12 — CLAT 2026', college: 'Admitted: NLSIU Bangalore', quote: 'The 1-on-1 strategy sessions with Abhinav Sir transformed my mock analysis. I went from scoring 70 to clearing 105+ in the actual CLAT paper.' },
  { student: 'Ananya Deshmukh', rank: 'AIR 5 — IPMAT Indore 2026', college: 'Admitted: IIM Indore (IPM)', quote: 'The maths short-answers section was my nightmare. Dr. Shruti gave me calc shortcuts that saved my quantitative score completely.' },
  { student: 'Meera Sengupta', rank: '100% Percentile — CUET 2026', college: 'Admitted: B.A. LLB (Hons) Delhi University', quote: 'CT Campus guided me in subject selection so perfectly. Mapped my domains with NCERT and General Test perfectly.' },
  { student: 'Rohan Talwar', rank: 'AIR 34 — CLAT 2026', college: 'Admitted: NALSAR Hyderabad', quote: 'Restricted batch sizes meant Kabir Sir had eyes on my logical reasoning reading habits every single day.' },
  { student: 'Tanmay Kapoor', rank: 'AIR 18 — IPMAT Rohtak 2026', college: 'Admitted: IIM Rohtak (IPM)', quote: 'WAT/PI mock interviews conducted by actual IIM directors gave me the ultimate confidence boost before the panel.' },
  { student: 'Ishita Roy', rank: 'AIR 89 — CLAT 2026', college: 'Admitted: WBNUJS Kolkata', quote: 'The silent study library cabins were a lifesaver. Kept me focused opposite Metro Pillar 80 Karol Bagh!' },
];

export default function ResultsPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Our Hall of Fame
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Our Results Speak: Top ranks in CLAT, IPMAT & CUET
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Every year, CT CAMPUS students push the boundaries of excellence, securing admissions into premium National Law Universities, IIMs, and top central colleges. Here are some of our proud achievers:
          </p>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((r, idx) => (
            <div key={idx} className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-soft transition-all duration-300">
              <div className="space-y-4">
                {/* Trophy Head */}
                <div className="flex justify-between items-start">
                  <div className="bg-surface text-accent p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-accent animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted bg-primary/5 px-2.5 py-1 rounded-full">
                    Top ranker
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-primary">{r.student}</h3>
                  <p className="text-sm font-bold text-accent">{r.rank}</p>
                  <p className="text-xs font-semibold text-muted">{r.college}</p>
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed italic border-l-2 border-accent pl-3 py-1">
                  "{r.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Conversion block */}
        <div className="mt-16 bg-primary text-background rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 glow-gradient pointer-events-none opacity-10" />
          <div className="max-w-xl mx-auto space-y-6 relative">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Join Our Next Hall of Fame?
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Batch size is limited strictly to 30 students to maintain NLU/IIM alumni mentorship density. Register today or reach out for career consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admissions" className="btn-primary bg-accent text-primary hover:bg-accent/90 w-full sm:w-auto">
                Apply for Admission
              </Link>
              <Link href="/contact" className="btn-secondary bg-[#0f0f20] border-border/10 text-background hover:bg-[#151530] w-full sm:w-auto">
                Schedule Diagnostics Mock
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
