import React from 'react';
import Image from 'next/image';
import AdminAdmissionsLedger from '@/components/admin/AdminAdmissionsLedger';
import { getAdminAdmissions, type AdminAdmission } from '@/lib/admin/admissions';
import { AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  let admissions: AdminAdmission[] = [];
  let error: string | null = null;

  try {
    admissions = await getAdminAdmissions();
  } catch (err: any) {
    error = err.message || 'Failed to fetch admissions applications.';
  }

  return (
    <div className="space-y-8 text-left font-worksans text-primary">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-light pb-6">
        <div>
          <h1 className="font-manrope text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
            Admissions & Payments Ledger
          </h1>
          <p className="text-sm text-primary/60 mt-1">
            Review student details, payment status, submitted documents, and approve or reject admissions in real time.
          </p>
        </div>
        <div className="bg-surface-white p-2.5 rounded-lg border border-border-light shadow-sm flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="CT CAMPUS Logo"
            width={140}
            height={38}
            className="h-8 w-auto object-contain"
          />
        </div>
      </header>

      <div className="bg-surface-white border border-border-light rounded shadow-sm p-6 md:p-8 space-y-6">
        <div className="border-b border-border-light pb-4">
          <h3 className="font-manrope text-lg md:text-xl font-bold text-primary">
            Student Ledger Registry
          </h3>
        </div>

        {error ? (
          <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-xs border border-error/15">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <AdminAdmissionsLedger initialAdmissions={admissions} />
        )}
      </div>
    </div>
  );
}
