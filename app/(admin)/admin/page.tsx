import React from 'react';
import { createClient } from '@/lib/supabase/server';
import {
  Inbox,
  UserCheck,
  TrendingUp,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Always fetch fresh database stats

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // 1. QUERY KPI STATS
  // Inquiries count
  const { count: pendingInquiriesCount } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Leads count
  const { count: totalLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  // Admissions count
  const { count: admissionsCount } = await supabase
    .from('admissions')
    .select('*', { count: 'exact', head: true });

  // 2. QUERY RECENT INQUIRIES FOR DATA TABLE
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  const kpis = [
    { title: 'Pending Queries', value: pendingInquiriesCount ?? 0, icon: Inbox, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { title: 'Total Leads Funnel', value: totalLeadsCount ?? 0, icon: TrendingUp, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { title: 'Admissions Applications', value: admissionsCount ?? 0, icon: UserCheck, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-primary">
            Welcome, System Administrator
          </h1>
          <p className="text-sm text-muted">
            Auditing campus admissions registers, courses timesteps, and lead dashboards opposite Pillar 80 Karol Bagh.
          </p>
        </div>
        <div className="text-xs font-semibold text-muted flex items-center gap-1.5 bg-white border border-border px-3 py-1.5 rounded-lg shadow-sm">
          <Calendar className="h-4 w-4 text-accent" />
          Server Time: {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-border rounded-xl p-6 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl border ${kpi.color} shrink-0`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                  {kpi.title}
                </span>
                <span className="text-3xl font-extrabold text-primary block mt-1">
                  {kpi.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Inquiries Inbox */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-primary">
              Recent Leads Inbox
            </h3>
            <p className="text-xs text-muted">
              Verify incoming career evaluations and course queries below.
            </p>
          </div>
          <Link href="/admin/inquiries" className="text-xs font-bold text-accent hover:text-accent/80 flex items-center gap-1">
            View Leads Funnel
            <span>→</span>
          </Link>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-[10px] uppercase font-bold text-muted tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Course Interest</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {inquiries && inquiries.length > 0 ? (
                inquiries.map((inq: any) => {
                  const submittedAt = new Date(inq.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={inq.id} className="hover:bg-surface/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-primary">{inq.name}</td>
                      <td className="py-3.5 px-4 font-mono text-muted">{inq.phone}</td>
                      <td className="py-3.5 px-4 text-primary/80 font-medium">{inq.course_interest}</td>
                      <td className="py-3.5 px-4 text-muted">{submittedAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                          inq.status === 'pending'
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted font-medium text-xs">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                      <span>No inquiries logged in the system yet.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
