'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  UserCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
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
    <div className="space-y-8 text-left font-worksans text-primary">
      {/* Header Segment */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-light pb-6">
        <div>
          <h1 className="font-manrope text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
            Admissions & Payments Ledger
          </h1>
          <p className="text-sm text-primary/60 mt-1">
            Audit manual UPI QR bank logs, examine marksheet documents link, and trigger student role access validations.
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-surface-white p-4 rounded border border-border-light shadow-sm">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/40" />
          <input
            type="text"
            placeholder="Search student, WhatsApp number, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="custom-input pl-11 w-full text-xs sm:text-sm py-2.5"
          />
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="custom-input bg-surface-white w-full text-xs sm:text-sm py-2.5"
          >
            <option value="all">All Registrations</option>
            <option value="pending">Pending Payment (pending)</option>
            <option value="pending_verification">Pending Audit (pending_verification)</option>
            <option value="approved">Approved Placement</option>
            <option value="rejected">Rejected Entries</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-white border border-border-light rounded shadow-sm p-6 md:p-8 space-y-6">
        <div className="border-b border-border-light pb-4">
          <h3 className="font-manrope text-lg md:text-xl font-bold text-primary">
            Student Ledger Registry
          </h3>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-focus-teal" />
            <span className="text-xs text-primary/45 uppercase tracking-widest font-bold">Accessing database channels...</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-xs border border-error/15">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
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
                minute: '2-digit'
              });

              const paymentDate = adm.payment_submission_time 
                ? new Date(adm.payment_submission_time).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'N/A';

              const isActioning = actionId === adm.id;

              return (
                <div key={adm.id} className="border border-border-light rounded p-5 hover:ambient-shadow transition-shadow flex flex-col lg:flex-row justify-between gap-6 bg-surface/10">
                  
                  {/* Left Metadata Info */}
                  <div className="space-y-3 flex-grow text-left">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-manrope font-bold text-lg text-primary">
                        {adm.profiles?.full_name || 'Aspirant Student'}
                      </h4>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                        adm.status === 'approved'
                          ? 'bg-success/10 border-success/30 text-success'
                          : adm.status === 'pending_verification'
                          ? 'bg-focus-teal/10 border-focus-teal/30 text-focus-teal'
                          : 'bg-primary/5 border-border-light text-primary/45'
                      }`}>
                        {adm.status === 'pending_verification' ? 'Pending Audit' : adm.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-primary/75">
                      <a href={`tel:${adm.profiles?.phone}`} className="flex items-center gap-2 hover:text-focus-teal">
                        <PhoneCall className="h-4 w-4 text-focus-teal shrink-0" />
                        <span>+91 {adm.profiles?.phone}</span>
                      </a>
                      {adm.profiles?.email && (
                        <a href={`mailto:${adm.profiles?.email}`} className="flex items-center gap-2 hover:text-focus-teal">
                          <Mail className="h-4 w-4 text-focus-teal shrink-0" />
                          <span>{adm.profiles?.email}</span>
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border-light/60 text-xs">
                      <div>
                        <span className="text-primary/45 block text-[9px] uppercase tracking-wider">Registration Date</span>
                        <span className="font-bold block mt-0.5">{regDate}</span>
                      </div>
                      <div>
                        <span className="text-primary/45 block text-[9px] uppercase tracking-wider">Manual Payment Submission</span>
                        <span className="font-bold block mt-0.5">
                          {adm.payment_submitted ? (
                            <span className="text-focus-teal flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {paymentDate}
                            </span>
                          ) : (
                            <span className="text-primary/30">Not Submitted</span>
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
                          className="inline-flex items-center gap-1.5 text-xs text-focus-teal hover:underline font-bold"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          Examine Submitted Marksheet Document Link
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Program Info & Audit Controls */}
                  <div className="flex flex-col justify-between items-stretch lg:items-end shrink-0 gap-6 lg:text-right font-semibold">
                    <div>
                      <span className="text-primary/45 block text-[9px] uppercase">Target Course Program</span>
                      <span className="text-primary font-bold text-sm block mt-0.5">{adm.courses?.title || 'Entrance Program'}</span>
                      <span className="px-2.5 py-0.5 text-[9px] font-bold bg-focus-teal/10 text-focus-teal rounded-full mt-1.5 inline-block uppercase">
                        {adm.courses?.category}
                      </span>
                    </div>

                    {/* Approve / Reject Controls */}
                    <div className="flex gap-2.5">
                      {adm.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(adm.id, 'approved')}
                          disabled={isActioning}
                          className="bg-success hover:bg-primary text-surface-white font-manrope font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm focus-ring"
                        >
                          {isActioning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                      )}

                      {adm.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(adm.id, 'rejected')}
                          disabled={isActioning}
                          className="border border-border-light hover:border-error hover:text-error bg-surface-white text-primary/60 font-manrope font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm focus-ring"
                        >
                          {isActioning ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          Reject
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-primary/45 text-xs font-semibold border border-dashed border-border-light rounded">
            <div className="flex flex-col items-center justify-center space-y-2">
              <UserCheck className="h-8 w-8 text-focus-teal" />
              <span>No registrations match search metrics.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
