'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
        return;
      }

      setSignedUp(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oAuthError) {
        throw oAuthError;
      }
    } catch (err: any) {
      setError(err.message || 'Google OAuth failed.');
    }
  };

  if (signedUp) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left relative overflow-hidden">
        <div className="absolute inset-0 glow-gradient opacity-40 pointer-events-none" />
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white border border-border shadow-soft rounded-2xl p-8 text-center space-y-4">
          <div className="bg-white p-3.5 rounded-2xl inline-flex items-center justify-center shadow-md border border-slate-100">
            <Image
              src="/logo.png"
              alt="CT CAMPUS Logo"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary">Verify Email</h2>
          <p className="text-sm text-muted">
            We have dispatched a verification link to <span className="font-semibold text-primary">{email}</span>. Please check your inbox and verify your email to unlock your strategic candidate portal.
          </p>
          <div className="pt-4">
            <Link href="/login" className="btn-primary w-full text-center">
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-left relative overflow-hidden">
      <div className="absolute inset-0 glow-gradient opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 relative text-center">
        <Link href="/" className="inline-block group mx-auto">
          <div className="bg-white p-3.5 rounded-2xl flex items-center justify-center shadow-md border border-slate-100">
            <Image
              src="/logo.png"
              alt="CT CAMPUS Logo"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </div>
        </Link>
        <h2 className="font-display text-3xl font-bold text-primary tracking-tight">
          Create Aspirant Account
        </h2>
        <p className="text-xs text-muted">
          Register to view online admissions status, program timetables, and Mock analysis mistakes log.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative">
        <div className="bg-white py-8 px-4 border border-border shadow-soft rounded-2xl sm:px-10">
          <form onSubmit={handleEmailSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Full Legal Name *
              </label>
              <input
                type="text"
                id="fullName"
                required
                placeholder="e.g. Priyanshu Sen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="e.g. priyanshu@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Portal Password *
              </label>
              <input
                type="password"
                id="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-error/5 text-error p-3 rounded-lg text-xs leading-relaxed border border-error/15">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Student Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-muted">Or signup with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn-secondary w-full bg-white border border-border flex items-center justify-center gap-2 hover:bg-surface font-semibold"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.57,11.45 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.62c2.61,0 4.8,-0.87 6.4,-2.36l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.1,0.98 -2.39,0 -4.41,-1.61 -5.13,-3.78H3.45v2.66C5.07,18.84 8.35,20.62 12,20.62z" fill="#34A853" />
              <path d="M6.87,12.88c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7 0,-0.59 0.11,-1.16 0.29,-1.7V6.82H3.45C2.83,8.08 2.48,9.5 2.48,11c0,1.5 0.35,2.92 0.97,4.18l3.42,-2.3z" fill="#FBBC05" />
              <path d="M12,6.38c1.42,0 2.7,0.49 3.7,1.44l2.78,-2.78C16.8,3.52 14.61,2.62 12,2.62c-3.65,0 -6.93,1.78 -8.55,4.2L6.87,9.12C7.59,6.95 9.61,5.38 12,6.38z" fill="#EA4335" />
            </svg>
            Google OAuth
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-accent hover:text-accent/80 underline">
              Login to portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
