import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { UserCheck, AlertCircle, FileText, CheckCircle2, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  const supabase = createClient();

  const { data: admissions } = await supabase
    .from('admissions')
    .select(`
      id,
      status,
      created_at,
      documents_url,
      profiles (
        full_name,
        phone
      ),
      courses (
        title,
        category
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Admissions Log Ledger
        </h1>
        <p className="text-sm text-muted">
          Review, approve, and assign batch timetables to incoming student applications.
        </p>
      </div>

      {/* Admissions List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Incoming Applications
        </h3>

        <div className="space-y-4">
          {admissions && admissions.length > 0 ? (
            admissions.map((adm: any) => {
              const submittedAt = new Date(adm.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={adm.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-display font-bold text-lg text-primary">
                        {adm.profiles?.full_name || 'Anonymous Student'}
                      </h4>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        adm.status === 'submitted'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : adm.status === 'approved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-red-50 border-red-200 text-red-600'
                      }`}>
                        {adm.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-primary/80 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-accent" />
                      <span>Phone: +91 {adm.profiles?.phone || 'not_provided'}</span>
                    </div>

                    <div className="text-xs text-muted block">
                      Applied on: {submittedAt}
                    </div>

                    {adm.documents_url && adm.documents_url.length > 0 && (
                      <div className="pt-2">
                        <a
                          href={adm.documents_url[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-bold"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          View Submitted Marksheet Document Link
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-stretch md:items-end shrink-0 gap-4">
                    <div className="text-xs font-semibold text-right">
                      <span className="text-[10px] uppercase font-bold text-muted block font-body">Target Course</span>
                      <span className="text-primary mt-1 block leading-normal">{adm.courses?.title || 'Unknown Course'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <UserCheck className="h-8 w-8 text-amber-500" />
                <span>No admissions applications logged in the database registry.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
