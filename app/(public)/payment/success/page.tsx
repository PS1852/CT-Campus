import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Payment Successful | CT CAMPUS',
  description: 'Thank you for your enrollment fee settlement. Your transaction order has been validated successfully.',
  slug: '/payment/success',
  noIndex: true,
});

interface SuccessPageProps {
  searchParams: {
    order?: string;
    course?: string;
  };
}

export default function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order || 'order_MOCK_XYZ123';

  return (
    <div className="min-h-[80vh] bg-surface flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 glow-gradient pointer-events-none opacity-35" />

      <div className="max-w-md w-full bg-white border border-border shadow-soft rounded-3xl p-8 relative space-y-6">
        
        {/* Success Icon */}
        <div className="bg-success/10 text-success p-4 rounded-full inline-flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-primary">Fee Settled Successfully</h1>
          <p className="text-xs text-success font-semibold uppercase tracking-wider flex items-center gap-1.5 justify-center">
            <ShieldCheck className="h-4 w-4" />
            Verified Secure Transaction
          </p>
          <p className="text-xs sm:text-sm text-muted leading-relaxed pt-2">
            We have registered your payment receipt. Your digital credentials and cabin access tokens are currently compiling.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-surface border border-border rounded-xl p-4 text-xs text-left space-y-2 font-medium">
          <div className="flex justify-between">
            <span className="text-muted">Receipt / Order ID:</span>
            <span className="text-primary font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Gateway Status:</span>
            <span className="text-success font-bold">Paid / Success</span>
          </div>
        </div>

        {/* Next actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Access Student Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="btn-secondary bg-white w-full flex items-center justify-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Back to Homepage
          </Link>
        </div>

        <div className="text-[10px] text-slate-400">
          A duplicate of this receipt has been dispatched to your billing phone and email. For billing help, call +91 8800833665.
        </div>
      </div>
    </div>
  );
}
