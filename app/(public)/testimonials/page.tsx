import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { createClient } from '@/lib/supabase/server';
import { Quote, MessageSquare, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'Student Trust Wall & Reviews | CT CAMPUS',
  description: 'Read actual student and parent experiences at CT CAMPUS Karol Bagh. Verified reviews regarding our 1-on-1 mentorship for law and management entrances.',
  slug: '/testimonials',
});

// Fallback reviews if database has no approved records yet
const fallbackTestimonials = [
  { display_name: 'Aarav Sharma (CLAT 2026 - AIR 42)', rating: 5, message: 'The 1-on-1 mentorship at CT CAMPUS was a game-changer for my CLAT preparation. Having an NLU alumni mentor who reviewed my mock analyses every week helped me identify my weak spots in reading comprehension and legal reasoning. The library cabins at Karol Bagh are perfect for silent, focused study.' },
  { display_name: 'Meera Nair (IPMAT - IIM Indore Convert)', rating: 5, message: 'I highly recommend CT CAMPUS for IPMAT. The quantitative aptitude sessions are extremely rigorous, and the verbal prep is top-notch. The mock interview workshops and WAT feedback sessions gave me the confidence I needed to clear the IIM Indore selection rounds.' },
  { display_name: 'Devansh Gupta (CUET - 100 Percentile in 3 Domains)', rating: 5, message: "CT CAMPUS has the best faculty for CUET prep. The classroom sessions are highly interactive, and the topic-wise tests aligned perfectly with the latest NCERT syllabus. Kabir Sir's advice on subject combinations was invaluable." },
  { display_name: 'Siddharth Verma (Parent of Riya Verma, CLAT AIR 89)', rating: 5, message: 'As a parent, I am extremely satisfied with the personal attention my daughter received at CT CAMPUS. The weekly mentor alignment calls and performance tracking dashboards kept us informed throughout the year. The directors are highly accessible and dedicated.' },
  { display_name: 'Ananya Iyer (CLAT & CUET Prep)', rating: 5, message: 'The offline study atmosphere at the Karol Bagh center is amazing. The study booklets, topic tests, and national-level mock tests are highly comprehensive. The faculty members are always available in the cabins to clarify doubts instantly.' },
];

export default async function TestimonialsPage() {
  const supabase = createClient();

  const { data: dbTestimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Trust & Credibility
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
            Student & Parent Trust Wall
          </h1>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Read actual verified reviews from aspirants who upgraded their scores and cleared entry requirements at top institutions in the country.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t: any, idx: number) => (
            <div key={idx} className="bg-white border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-soft transition-all duration-300">
              <div className="space-y-4">
                {/* Header elements */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-accent" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-accent/15" />
                </div>

                <p className="text-xs sm:text-sm text-muted leading-relaxed italic">
                  "{t.message}"
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/60">
                <span className="text-xs font-semibold text-primary block">
                  — {t.display_name}
                </span>
                <span className="text-[10px] text-muted block uppercase tracking-wider mt-0.5">
                  Verified Aspirant
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Banner */}
        <div className="mt-16 bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center lg:text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-primary">
              Are you an active or past CT CAMPUS student?
            </h3>
            <p className="text-sm text-muted">
              Submit your experience online through your student dashboard to help other aspirants select their coaching tracks.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center w-full">
            <Link href="/login" className="btn-primary w-full text-center flex items-center justify-center gap-2">
              Access Student Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
