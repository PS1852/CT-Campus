import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { HelpCircle, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminFaqsPage() {
  const supabase = createClient();

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Seeded FAQs Administrator
        </h1>
        <p className="text-sm text-muted">
          Manage questions bank displayed across the portal.
        </p>
      </div>

      {/* FAQs List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Seeded FAQs Ledger
        </h3>

        <div className="space-y-4">
          {faqs && faqs.length > 0 ? (
            faqs.map((faq: any) => (
              <div key={faq.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors text-left space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                    {faq.category}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                    faq.is_active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    {faq.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-base text-primary flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  {faq.question}
                </h4>
                <p className="text-xs text-muted leading-relaxed pl-7">{faq.answer}</p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <HelpCircle className="h-8 w-8 text-amber-500" />
                <span>No FAQs found in database schema.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
