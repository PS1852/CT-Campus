'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
}

interface AdmissionFormProps {
  courses: Course[];
}

export default function AdmissionForm({ courses }: AdmissionFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_id: '',
    board_percentage: '',
    documents_url: '', // Text link for marksheet documents
    message: '',
    website_verify: '', // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autofill if logged in
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.user_metadata?.name || prev.name,
          email: user.email || prev.email,
        }));
      }
    };
    loadUser();
  }, [supabase]);

  const handleGoogleAutofill = async () => {
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/admissions`,
        },
      });
      if (oAuthError) throw oAuthError;
    } catch (err: any) {
      setError(err.message || 'Google Sign In failed.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validations
    if (!formData.name.trim() || !formData.phone.trim() || !formData.course_id) {
      setError('Name, phone number, and program selection are required.');
      setLoading(false);
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a minute before submitting again.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Admissions submission failed. Please try again.');
      }

      router.push(`/fees?admission_id=${result.admission.id}`);
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
        <div className="bg-success/10 text-success p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h4 className="font-display text-2xl font-bold text-primary">Application Submitted!</h4>
        <p className="text-sm text-muted max-w-md">
          Your admission request has been logged successfully under status **"Submitted"**. An admissions panel advisor from Karol Bagh will contact you on your registered phone number within 24 hours to verify documents and assign your batch timing.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-secondary mt-6"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Sign In Autofill Button */}
      <button
        type="button"
        onClick={handleGoogleAutofill}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-surface hover:bg-surface/80 text-primary font-semibold text-sm transition-all shadow-sm"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.57,11.45 21.35,11.1z" fill="#4285F4" />
          <path d="M12,20.62c2.61,0 4.8,-0.87 6.4,-2.36l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.1,0.98 -2.39,0 -4.41,-1.61 -5.13,-3.78H3.45v2.66C5.07,18.84 8.35,20.62 12,20.62z" fill="#34A853" />
          <path d="M6.87,12.88c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7 0,-0.59 0.11,-1.16 0.29,-1.7V6.82H3.45C2.83,8.08 2.48,9.5 2.48,11c0,1.5 0.35,2.92 0.97,4.18l3.42,-2.3z" fill="#FBBC05" />
          <path d="M12,6.38c1.42,0 2.7,0.49 3.7,1.44l2.78,-2.78C16.8,3.52 14.61,2.62 12,2.62c-3.65,0 -6.93,1.78 -8.55,4.2L6.87,9.12C7.59,6.95 9.61,5.38 12,6.38z" fill="#EA4335" />
        </svg>
        <span>1-Click Apply & Autofill with Google</span>
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-muted uppercase tracking-wider font-semibold font-body">Or Enter Manually</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Honeypot field (hidden from viewports) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_verify">Leave this field blank</label>
        <input
          type="text"
          id="website_verify"
          name="website_verify"
          value={formData.website_verify}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Student Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="e.g. Priyanshu Sen"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Phone / WhatsApp Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="e.g. 8800833665"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Email Address (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. priyanshu@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Board Percentage */}
        <div>
          <label htmlFor="board_percentage" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Class 10/12 Board Score (%)
          </label>
          <input
            type="text"
            id="board_percentage"
            name="board_percentage"
            placeholder="e.g. 96.4%"
            value={formData.board_percentage}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      {/* Program Selection */}
      <div>
        <label htmlFor="course_id" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Select Target Program *
        </label>
        <select
          id="course_id"
          name="course_id"
          required
          value={formData.course_id}
          onChange={handleChange}
          className="form-input bg-white appearance-none"
        >
          <option value="">Choose a Program...</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} ({c.category})
            </option>
          ))}
        </select>
      </div>

      {/* Document Link */}
      <div>
        <label htmlFor="documents_url" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Marksheet Document Link (Google Drive / Dropbox)
        </label>
        <input
          type="url"
          id="documents_url"
          name="documents_url"
          placeholder="e.g. https://drive.google.com/your-marksheet-link"
          value={formData.documents_url}
          onChange={handleChange}
          className="form-input"
        />
        <span className="text-[10px] text-muted block mt-1">
          Provide a public link to your marksheets for immediate scholarship audit approvals.
        </span>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Comments / Special Request (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Add any specific requirements regarding hostel bookings or weekend batch shifts..."
          value={formData.message}
          onChange={handleChange}
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
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing Application...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Online Admission
          </>
        )}
      </button>
    </form>
    </div>
  );
}
