import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { HelpCircle, MessageSquare, ChevronRight, HelpCircle as AskIcon } from 'lucide-react';

export const metadata = generatePageMetadata({
  title: 'Seeded FAQ Bank & Course Queries | CT CAMPUS',
  description: 'Find clear answers to frequently asked questions regarding CLAT syllabus overlaps, IPMAT interview requirements, CUET subject selections, and fees.',
  slug: '/faqs',
});

// Fallback FAQs if database load is empty
const fallbackFaqs = [
  { question: 'What is the success rate of students at CT CAMPUS for CLAT?', answer: 'Our student success rate for CLAT is outstanding, with over 82% of our intensive mentorship batch securing admissions in top-tier National Law Universities (NLUs) including NLSIU Bangalore, NALSAR Hyderabad, and NLU Delhi.', category: 'CLAT' },
  { question: 'How does the IPMAT mentorship program differ from standard coaching?', answer: 'Standard coaching focuses primarily on mass lectures. Our IPMAT program features 1-on-1 performance metrics, deep mock analysis of IIM Indore and Rohtak trends, and rigorous interview grooming sessions conducted directly by IIM alumni.', category: 'IPMAT' },
  { question: 'Can I prepare for both CUET and CLAT simultaneously at CT CAMPUS?', answer: 'Yes, absolutely. Our Undergraduate Foundation batch is meticulously designed to bridge the syllabus of both exams. The Legal Studies domain in CUET aligns perfectly with CLAT Legal Reasoning, and the General Test covers CLAT Current Affairs.', category: 'General' },
];

export default async function FaqsPage() {
  const supabase = createClient();

  const { data: dbFaqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const faqs = dbFaqs && dbFaqs.length > 0 ? dbFaqs : fallbackFaqs;

  return (
    <div className="py-20 bg-background font-worksans text-primary flex flex-col items-center">
      <div className="w-full max-w-[800px] px-margin-mobile md:px-0">
        
        {/* Header Section */}
        <header className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-focus-teal/10 text-focus-teal font-semibold text-xs uppercase tracking-wider">
            Preparation FAQs
          </div>
          <h1 className="font-manrope text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
            Academic FAQ Bank
          </h1>
          <p className="text-sm md:text-base text-primary/70 leading-relaxed max-w-xl mx-auto">
            Find answers to standard enrollment procedures, installment patterns, batches, study library setups, and eligibility parameters.
          </p>
        </header>

        {/* FAQs Accordion Stack */}
        <main className="space-y-4">
          {faqs.map((faq: any, idx: number) => (
            <details
              key={idx}
              className="group border border-border-light bg-surface-white rounded hover:ambient-shadow transition-shadow overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 p-6 font-manrope font-bold text-base md:text-lg text-primary select-none focus:outline-none">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5.5 w-5.5 text-focus-teal shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <span className="transition-transform group-open:rotate-180 text-focus-teal shrink-0">
                  ▼
                </span>
              </summary>
              
              <div className="px-6 pb-6 text-sm text-primary/60 border-t border-border-light/50 pt-4 leading-relaxed font-semibold">
                <p>{faq.answer}</p>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-focus-teal uppercase bg-focus-teal/10 px-2.5 py-1 rounded-full">
                    {faq.category}
                  </span>
                </div>
              </div>
            </details>
          ))}
        </main>

        {/* Floating Support Contact Card */}
        <section className="mt-16 bg-primary text-surface-white rounded-lg p-8 md:p-12 text-center space-y-6">
          <h3 className="font-manrope text-2xl font-bold">Have Unresolved Questions?</h3>
          <p className="text-sm text-surface-container/60 max-w-md mx-auto leading-relaxed">
            Our strategic mentors can help with batch alignment, timing enquiries, hostel bookings, or subject domain selections directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <a
              href="https://wa.me/918800833665?text=Hi%20CT%20Campus%20Mentor,%20I'm%20having%20some%20doubts%20regarding%20the%20entrance%20batches."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2 focus-ring"
            >
              <MessageSquare className="h-4.5 w-4.5 fill-current" />
              WhatsApp Mentorship Desk
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto border border-surface-white/20 hover:border-surface-white text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2 focus-ring"
            >
              Contact Directory
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
