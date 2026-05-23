import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Gated admin sidebar menu */}
      <AdminSidebar />

      {/* Main dashboard content viewport */}
      <main className="flex-grow h-screen overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
