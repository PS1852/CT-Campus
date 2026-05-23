import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Settings, AlertCircle, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = createClient();

  const { data: dbSettings } = await supabase
    .from('settings')
    .select('*');

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Portal Setup & Core Variables
        </h1>
        <p className="text-sm text-muted">
          Manage institution identifiers, helpline phone, address text, and coordinates metrics.
        </p>
      </div>

      {/* Settings List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3 flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          Active Configuration Parameters
        </h3>

        <div className="space-y-4 max-w-2xl">
          {dbSettings && dbSettings.length > 0 ? (
            dbSettings.map((set: any) => (
              <div key={set.key} className="border border-border/60 rounded-xl p-4 flex justify-between items-center gap-4 hover:border-accent transition-colors bg-surface/20">
                <div className="space-y-0.5 text-left flex-grow">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider block font-mono">
                    {set.key}
                  </span>
                  <span className="text-sm font-semibold text-primary block leading-relaxed pt-1">
                    {set.value}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <span>No setup settings registered in the database store.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
