import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, PhoneCall } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Payment Failed | CT CAMPUS',
  description: 'Your enrollment fee transaction could not be processed. Please review your billing credentials or retry.',
  slug: '/payment/failure',
  noIndex: true,
});

export default function PaymentFailurePage() {
  return (
    <div className="min-h-[80vh] bg-surface flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-white border border-border shadow-soft rounded-3xl p-8 relative space-y-6">
        
        {/* Failure Alert Icon */}
        <div className="bg-error/10 text-error p-4 rounded-full inline-flex items-center justify-center">
          <AlertCircle className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-primary">Transaction Declined</h1>
          <p className="text-xs text-error font-semibold uppercase tracking-wider">
            Verification Check Blocked
          </p>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pt-2">
            The payment gateway reported a transaction block. This could be due to insufficient card limits, authorization blocks, or network timeouts. No funds have been captured.
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex flex-col gap-3">
          <Link
            href="/fees"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Retry Fee Settlement
          </Link>
          <Link
            href="tel:8800833665"
            className="btn-secondary bg-white w-full flex items-center justify-center gap-2"
          >
            <PhoneCall className="h-4 w-4 text-accent" />
            Call Karol Bagh Support
          </Link>
        </div>

        <div className="text-[10px] text-slate-400">
          If your bank account was debited, the funds will automatically reverse back to your source within 3 banking days.
        </div>
      </div>
    </div>
  );
}
