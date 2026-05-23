import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Megaphone, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
  const supabase = createClient();

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Banners & Announcements
        </h1>
        <p className="text-sm text-muted">
          Broadcast alerts regarding holiday calendars, scholarship exams, and new intakes schedules.
        </p>
      </div>

      {/* Announcements List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Broadcasting Ledger
        </h3>

        <div className="space-y-4">
          {announcements && announcements.length > 0 ? (
            announcements.map((ann: any) => (
              <div key={ann.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors text-left space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                    {ann.type}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                    ann.is_active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    {ann.is_active ? 'Broadcasting' : 'Expired'}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-base text-primary flex items-start gap-2">
                  <Megaphone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  {ann.title}
                </h4>
                <p className="text-xs text-muted leading-relaxed pl-7">{ann.body}</p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Megaphone className="h-8 w-8 text-amber-500" />
                <span>No announcements are currently broadcasting in the system.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
