import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Inbox, AlertCircle, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const supabase = createClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-primary">
          Mentorship Leads Funnel
        </h1>
        <p className="text-sm text-muted">
          Track and process student inquiries, diagnostic bookings, and discount requests.
        </p>
      </div>

      {/* Leads List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Active Submissions Inbox
        </h3>

        <div className="space-y-4">
          {inquiries && inquiries.length > 0 ? (
            inquiries.map((inq: any) => {
              const submittedAt = new Date(inq.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={inq.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-display font-bold text-lg text-primary">{inq.name}</h4>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        inq.status === 'pending'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-primary/80">
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-2 hover:text-accent">
                        <Phone className="h-4 w-4 text-accent" />
                        <span>+91 {inq.phone}</span>
                      </a>
                      {inq.email && (
                        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inq.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent">
                          <Mail className="h-4 w-4 text-accent" />
                          <span>{inq.email}</span>
                        </a>
                      )}
                    </div>

                    <div className="text-xs text-muted flex items-center gap-1.5 pt-1">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>Submitted: {submittedAt}</span>
                    </div>

                    {inq.message && (
                      <div className="bg-surface border border-border/60 p-3 rounded-lg text-xs leading-relaxed text-muted flex gap-2">
                        <MessageSquare className="h-4 w-4 text-accent/60 shrink-0 mt-0.5" />
                        <p>{inq.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-stretch md:items-end shrink-0 gap-4">
                    <div className="text-xs font-semibold text-right">
                      <span className="text-[10px] uppercase font-bold text-muted block">Program Interest</span>
                      <span className="text-primary mt-1 block">{inq.course_interest}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Inbox className="h-8 w-8 text-amber-500" />
                <span>No inquiry records logged in the database.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
