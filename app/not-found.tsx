import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center border-b border-border">
      {/* Soft overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative">
        {/* Brand logo cap */}
        <div className="bg-white p-3.5 rounded-2xl inline-flex items-center justify-center shadow-md border border-slate-100">
          <Image
            src="/logo.png"
            alt="CT CAMPUS Logo"
            width={160}
            height={45}
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-5xl font-extrabold text-primary">404</h1>
          <h2 className="font-display text-2xl font-bold text-primary">Aptitude Score Not Found!</h2>
          <p className="text-sm text-muted leading-relaxed">
            The page you are looking for has been moved, renamed, or does not exist in our curriculum. Let’s guide you back to our strategic tracks.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home Dashboard
          </Link>
          <Link
            href="/courses"
            className="btn-secondary bg-white w-full flex items-center justify-center"
          >
            Explore Courses & Fees
          </Link>
        </div>

        <div className="pt-6 text-xs text-muted">
          Need help? Contact Karol Bagh helpline: <span className="font-semibold text-accent">+91 8800833665</span>
        </div>
      </div>
    </div>
  );
}
