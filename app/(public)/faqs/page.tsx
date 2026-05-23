import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata, getFaqPageSchema, getBreadcrumbSchema } from '@/lib/seo/metadata';
import JsonLd from '@/components/shared/JsonLd';
import Link from 'next/link';
import { HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';

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

  const faqSchema = getFaqPageSchema(
    faqs.map(faq => ({ question: faq.question, answer: faq.answer }))
  );

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: 'Home', item: '/' },
    { name: 'FAQs', item: '/faqs' },
  ]);

  return (
    <>
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbsSchema} />

      <div className="py-12 sm:py-20 bg-background text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="space-y-4 mb-16 text-center">
            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
              Common Questions
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary">
              Seeded FAQ Knowledge Base
            </h1>
            <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
              Find transparent answers regarding eligibility criteria, batch shifts, study cabins, and scholarship brackets compiled by our administrators.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq: any, idx: number) => (
              <details
                key={idx}
                className="group border border-border bg-white rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 font-semibold text-primary text-base sm:text-lg list-none">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-accent shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <span className="transition-transform group-open:rotate-180 text-accent font-bold shrink-0">
                    ▼
                  </span>
                </summary>
                
                <div className="mt-4 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50 pt-4 space-y-2">
                  <p>{faq.answer}</p>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-surface border border-accent/10 px-2 py-0.5 rounded-full">
                      Category: {faq.category}
                    </span>
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Value block */}
          <div className="mt-16 bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <h3 className="font-display text-2xl font-bold text-primary">
              Have an Unanswered Question?
            </h3>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Our directors are active on WhatsApp and campus desks to clear your entrance, college, and syllabus doubts. Talk to us for a direct diagnosis session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918800833665?text=Hi%20CT%20Campus%20Mentor,%20I'm%20having%20some%20doubts%20regarding%20the%20entrance%20batches."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                WhatsApp Direct Mentorship
              </a>
              <Link
                href="/contact"
                className="btn-secondary flex items-center justify-center bg-white"
              >
                View Contact Directory
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
