'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap, LogOut, Layout, BookOpen } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Student Portal Header */}
      <header className="bg-primary text-background border-b border-primary/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-background text-primary p-1.5 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-background block text-sm sm:text-base">
                CT CAMPUS
              </span>
              <span className="text-[8px] uppercase font-bold tracking-wider text-accent block -mt-1">
                Student Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <Link href="/" className="text-background/70 hover:text-background flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Viewport */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
