'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Check,
  Clock,
  FileText,
  Loader2,
  Mail,
  PhoneCall,
  Search,
  UserCheck,
  X
} from 'lucide-react';
import type { AdminAdmission } from '@/lib/admin/admissions';

type Props = {
  initialAdmissions: AdminAdmission[];
  compact?: boolean;
};

export default function AdminAdmissionsLedger({ initialAdmissions, compact = false }: Props) {
  const [admissions, setAdmissions] = useState<AdminAdmission[]>(initialAdmissions);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const search = searchQuery.toLowerCase();
      const nameMatch = (adm.profiles?.full_name || '').toLowerCase().includes(search);
      const phoneMatch = (adm.profiles?.phone || '').toLowerCase().includes(search);
      const emailMatch = (adm.profiles?.email || '').toLowerCase().includes(search);
      const courseMatch = (adm.courses?.title || '').toLowerCase().includes(search);
      const matchesSearch = nameMatch || phoneMatch || emailMatch || courseMatch;

      if (filterStatus === 'all') return matchesSearch;
      return adm.status === filterStatus && matchesSearch;
    });
  }, [admissions, filterStatus, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/admissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Action failed. Please retry.');
      }

      setAdmissions((prev) =>
        prev.map((adm) => (adm.id === id ? result.admission : adm))
      );
    } catch (err: any) {
      setError(err.message || 'Action failed. Please retry.');
    } finally {
      setActionId(null);
    }
  };

  const visibleAdmissions = compact ? filteredAdmissions.slice(0, 5) : filteredAdmissions;

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-surface-white p-4 rounded border border-border-light shadow-sm">
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

          <div className="sm:col-span-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="custom-input bg-surface-white w-full text-xs sm:text-sm py-2.5"
            >
              <option value="all">All Registrations</option>
              <option value="pending">Pending Payment</option>
              <option value="pending_verification">Pending Audit</option>
              <option value="approved">Approved Placement</option>
              <option value="rejected">Rejected Entries</option>
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-xs border border-error/15">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {visibleAdmissions.length > 0 ? (
        <div className="space-y-4">
          {visibleAdmissions.map((adm) => {
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
            const documentUrl = typeof adm.documents_url === 'string' ? adm.documents_url : '';

            return (
              <div key={adm.id} className="border border-border-light rounded p-5 hover:ambient-shadow transition-shadow flex flex-col lg:flex-row justify-between gap-6 bg-surface/10">
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
                        : adm.status === 'rejected'
                        ? 'bg-error/10 border-error/30 text-error'
                        : 'bg-primary/5 border-border-light text-primary/45'
                    }`}>
                      {adm.status === 'pending_verification' ? 'Pending Audit' : adm.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-primary/75">
                    {adm.profiles?.phone ? (
                      <a href={`tel:${adm.profiles.phone}`} className="flex items-center gap-2 hover:text-focus-teal">
                        <PhoneCall className="h-4 w-4 text-focus-teal shrink-0" />
                        <span>+91 {adm.profiles.phone}</span>
                      </a>
                    ) : (
                      <span className="text-primary/35">Phone not provided</span>
                    )}

                    {adm.profiles?.email ? (
                      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${adm.profiles.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-focus-teal">
                        <Mail className="h-4 w-4 text-focus-teal shrink-0" />
                        <span>{adm.profiles.email}</span>
                      </a>
                    ) : (
                      <span className="text-primary/35">Email not provided</span>
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

                  {documentUrl && (
                    <div className="pt-2">
                      <a
                        href={documentUrl}
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

                <div className="flex flex-col justify-between items-stretch lg:items-end shrink-0 gap-6 lg:text-right font-semibold">
                  <div>
                    <span className="text-primary/45 block text-[9px] uppercase">Target Course Program</span>
                    <span className="text-primary font-bold text-sm block mt-0.5">{adm.courses?.title || 'Entrance Program'}</span>
                    <span className="px-2.5 py-0.5 text-[9px] font-bold bg-focus-teal/10 text-focus-teal rounded-full mt-1.5 inline-block uppercase">
                      {adm.courses?.category || 'Program'}
                    </span>
                  </div>

                  <div className="flex gap-2.5">
                    {adm.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(adm.id, 'approved')}
                        disabled={isActioning}
                        className="bg-success hover:bg-primary text-surface-white font-manrope font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm focus-ring"
                      >
                        {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Approve
                      </button>
                    )}

                    {adm.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(adm.id, 'rejected')}
                        disabled={isActioning}
                        className="border border-border-light hover:border-error hover:text-error bg-surface-white text-primary/60 font-manrope font-bold py-2.5 px-4 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm focus-ring"
                      >
                        {isActioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {compact && admissions.length > visibleAdmissions.length && (
            <div className="pt-2 text-right">
              <Link href="/admin/students" className="text-xs font-bold text-accent hover:text-accent/80">
                View full admissions ledger →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-primary/45 text-xs font-semibold border border-dashed border-border-light rounded">
          <div className="flex flex-col items-center justify-center space-y-2">
            <UserCheck className="h-8 w-8 text-focus-teal" />
            <span>No admissions registrations found.</span>
          </div>
        </div>
      )}
    </div>
  );
}
