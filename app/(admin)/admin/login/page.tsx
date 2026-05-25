'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Check if query params reported unauthorized access
    const errParam = searchParams.get('error');
    if (errParam === 'unauthorized') {
      setError('Access Denied: Your account does not possess administrator permissions.');
    } else if (errParam === 'server_error') {
      setError('Internal security check failed. Please try logging in again.');
    }
  }, [searchParams]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!session || !session.user) {
        throw new Error('Authentication session creation failed.');
      }

      // Check profile role on database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError || !profile || profile.role !== 'admin') {
        // Sign out if authenticated user is not an admin
        await supabase.auth.signOut();
        throw new Error('Access Denied: Your profile role is registered as student.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Admin Username (Email)
        </label>
        <input
          type="email"
          id="email"
          required
          placeholder="admin@ctcampus.co.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-accent"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Access Code (Password)
        </label>
        <input
          type="password"
          id="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-accent"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 bg-red-950/20 text-red-400 p-3.5 rounded-xl text-xs leading-relaxed border border-red-900/30">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full bg-accent text-primary hover:bg-accent/90 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying Credentials...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Admin Sign In
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,137,106,0.1),transparent_70%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 relative text-center">
        <Link href="/" className="inline-block group">
          <div className="bg-white p-3.5 rounded-2xl flex items-center justify-center shadow-lg border border-slate-800">
            <Image
              src="/logo.png"
              alt="CT CAMPUS Logo"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>
        <h2 className="font-display text-3xl font-extrabold text-white tracking-tight pt-2">
          Admin Control Center
        </h2>
        <p className="text-xs text-slate-400">
          Gated system. All administrative entries and changes are logged under audit ledgers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-slate-950 py-8 px-4 border border-slate-800 shadow-2xl rounded-2xl sm:px-10">
          <Suspense fallback={
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <span className="text-xs">Loading Security Modules...</span>
            </div>
          }>
            <AdminLoginForm />
          </Suspense>

          {/* Help notice */}
          <div className="mt-6 text-center text-[10px] text-slate-500">
            Forgot access codes? Contact CT Campus Tech Operations.
          </div>
        </div>
      </div>
    </div>
  );
}
