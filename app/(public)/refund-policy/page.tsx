import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Refund & Cancellation Policy | CT CAMPUS',
  description: 'Review our transparent 7-day trial, fee refund timelines, and cancellation structures at CT CAMPUS Karol Bagh New Delhi.',
  slug: '/refund-policy',
});

export default function RefundPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-8 border-b border-border pb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-muted">Last Updated: May 23, 2026</p>

        <p className="text-sm sm:text-base text-muted leading-relaxed">
          At **CT CAMPUS**, we prioritize absolute client satisfaction and transparent transactions. We understand that selecting a competitive coaching track is a massive commitment. We have designed a fair, standard trial refund roadmap:
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">1. The 7-Day Trial Refund</h3>
        <p className="text-sm text-muted leading-relaxed">
          We offer a complete 7-day trial window from the day your allocated batch lectures commence. If you choose to withdraw your enrollment for any reason within these 7 days, we refund your deposited tuition fee minus a standard administrative processing charge of <span className="font-semibold text-accent">₹1,500</span>.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">2. Non-Refundable Post-Trial Scope</h3>
        <p className="text-sm text-muted leading-relaxed">
          Refund requests submitted after 7 days from the batch start date are not permitted. Once the trial window closes, the seat is locked down, and academic booklet couriers and silent library cabin allocations are activated for the full curriculum timeline.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">3. Refund Processing Timelines</h3>
        <p className="text-sm text-muted leading-relaxed">
          Approved refunds are settled directly to the bank account or card utilized during payment initiation. The processing timeline is strictly <span className="font-semibold text-accent">5 to 7 operational bank days</span>.
        </p>
      </div>
    </div>
  );
}
