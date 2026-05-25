'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  XCircle,
  Phone, 
  Mail, 
  Calendar,
  Clock,
  Loader2,
  Search,
  Check,
  X
} from 'lucide-react';

export default function AdminStudentsPage() {
  const supabase = createClient();

  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data, error: fetchErr } = await supabase
        .from('admissions')
        .select(`
          id,
          status,
          payment_submitted,
          payment_submission_time,
          created_at,
          documents_url,
          profiles (
            full_name,
            phone,
            email
          ),
          courses (
            title,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setAdmissions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admissions applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionId(id);
    try {
      const { error: updateErr } = await supabase
        .from('admissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateErr) throw updateErr;

      // Update state locally
      setAdmissions((prev) => 
        prev.map((adm) => adm.id === id ? { ...adm, status: newStatus } : adm)
      );
    } catch (err: any) {
      alert(err.message || 'Action failed. Please retry.');
    } finally {
      setActionId(null);
    }
  };

  const filteredAdmissions = admissions.filter((adm) => {
    const nameMatch = (adm.profiles?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = (adm.profiles?.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (adm.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const courseMatch = (adm.courses?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = nameMatch || phoneMatch || emailMatch || courseMatch;

    if (filterStatus === 'all') return matchesSearch;
    return adm.status === filterStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-primary">
            Enrollments & Payments Auditor
          </h1>
          <p className="text-sm text-muted mt-1">
            Audit manual UPI QR code transfers, review pre-filled emails, and unlock target program course resources.
          </p>
        </div>
      </div>

      {/* Control Segment */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by student name, phone, email or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 text-xs sm:text-sm"
          />
        </div>

        {/* Filter */}
        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input bg-white appearance-none text-xs sm:text-sm"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Payment (pending)</option>
            <option value="pending_verification">Verification Required (pending_verification)</option>
            <option value="approved">Approved Enrollments</option>
            <option value="rejected">Rejected Payments</option>
          </select>
        </div>
      </div>

      {/* Admissions Audit Ledger */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-primary">
              Enrollments Audit Registry
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Confirm bank SMS details and execute program access activations below.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted font-medium text-xs">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span>Fetching secure databases logs...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded-xl text-xs border border-error/15">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : filteredAdmissions.length > 0 ? (
          <div className="space-y-4">
            {filteredAdmissions.map((adm) => {
              const regDate = new Date(adm.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const paymentDate = adm.payment_submission_time 
                ? new Date(adm.payment_submission_time).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A';

              const isActioning = actionId === adm.id;

              return (
                <div key={adm.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left Specs */}
                  <div className="space-y-3 flex-grow text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-display font-bold text-lg text-primary">
                        {adm.profiles?.full_name || 'Anonymous Student'}
                      </h4>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        adm.status === 'pending'
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : adm.status === 'pending_verification'
                          ? 'bg-amber-50 border-amber-200 text-amber-600'
                          : adm.status === 'approved'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'bg-red-50 border-red-200 text-red-600'
                      }`}>
                        {adm.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted font-medium">
                      <a href={`tel:${adm.profiles?.phone}`} className="flex items-center gap-2 hover:text-accent font-semibold text-primary/80">
                        <Phone className="h-4 w-4 text-accent shrink-0" />
                        <span>+91 {adm.profiles?.phone || 'not_provided'}</span>
                      </a>
                      {adm.profiles?.email && (
                        <a href={`mailto:${adm.profiles?.email}`} className="flex items-center gap-2 hover:text-accent font-semibold text-primary/80">
                          <Mail className="h-4 w-4 text-accent shrink-0" />
                          <span>{adm.profiles?.email}</span>
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-bold tracking-wider font-body">Registration Time</span>
                        <span className="text-primary font-semibold block mt-0.5">{regDate}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px] uppercase font-bold tracking-wider font-body">Payment Submission</span>
                        <span className="text-primary font-semibold block mt-0.5">
                          {adm.payment_submitted ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {paymentDate}
                            </span>
                          ) : (
                            <span className="text-slate-400">Unsubmitted</span>
                          )}
                        </span>
                      </div>
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
                          View Submitted Marksheet Document
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Target Program & Actions */}
                  <div className="flex flex-col justify-between items-stretch lg:items-end shrink-0 gap-6 lg:text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block font-body">Target Course Program</span>
                      <span className="text-primary font-bold text-sm block mt-0.5">{adm.courses?.title || 'Unknown Course'}</span>
                      <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full mt-1.5 inline-block">
                        {adm.courses?.category}
                      </span>
                    </div>

                    {/* Approve / Reject Actions */}
                    <div className="flex gap-2.5">
                      {adm.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(adm.id, 'approved')}
                          disabled={isActioning}
                          className="btn-primary min-h-[40px] py-1 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 border-none flex items-center gap-1.5 font-bold shadow-sm"
                        >
                          {isActioning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve Payment
                        </button>
                      )}

                      {adm.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(adm.id, 'rejected')}
                          disabled={isActioning}
                          className="btn-secondary min-h-[40px] py-1 px-4 text-xs border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-bold bg-white shadow-sm"
                        >
                          {isActioning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          Reject Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-muted font-medium text-xs border border-dashed border-border rounded-xl">
            <div className="flex flex-col items-center justify-center space-y-2">
              <UserCheck className="h-8 w-8 text-amber-500" />
              <span>No registrations match your search criteria.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
