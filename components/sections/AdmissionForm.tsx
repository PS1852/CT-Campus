'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Send, AlertCircle, Loader2, Lock } from 'lucide-react';

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
    documents_url: '', 
    message: '',
    website_verify: '', // Honeypot field
  });

  const [loading, setLoading] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 text-left font-worksans">
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website_verify">Leave blank</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-semibold text-sm text-primary/80">
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
              className="custom-input"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-semibold text-sm text-primary/80">
              Phone / WhatsApp Number *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/45 font-medium">+91</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                className="custom-input w-full"
                style={{ paddingLeft: '3.25rem' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-sm text-primary/80">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. student@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="custom-input"
            />
          </div>

          {/* Board Percentage */}
          <div className="flex flex-col gap-2">
            <label htmlFor="board_percentage" className="font-semibold text-sm text-primary/80">
              Class 10/12 Board Score (%)
            </label>
            <input
              type="text"
              id="board_percentage"
              name="board_percentage"
              placeholder="e.g. 96.4%"
              value={formData.board_percentage}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
        </div>

        {/* Program Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="course_id" className="font-semibold text-sm text-primary/80">
            Select Target Program *
          </label>
          <select
            id="course_id"
            name="course_id"
            required
            value={formData.course_id}
            onChange={handleChange}
            className="custom-input bg-surface-white"
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
        <div className="flex flex-col gap-2">
          <label htmlFor="documents_url" className="font-semibold text-sm text-primary/80">
            Marksheet Document Link (Google Drive / Dropbox)
          </label>
          <input
            type="url"
            id="documents_url"
            name="documents_url"
            placeholder="e.g. https://drive.google.com/your-marksheet-link"
            value={formData.documents_url}
            onChange={handleChange}
            className="custom-input"
          />
          <span className="text-xs text-primary/45 -mt-1 block">
            Provide a public folder link containing your marksheet files for fast manual scholarship approvals.
          </span>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="font-semibold text-sm text-primary/80">
            Comments / Special Request (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Hostel assistance options, morning or weekend batch preference..."
            value={formData.message}
            onChange={handleChange}
            className="custom-input resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-sm border border-error/15">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-border-light my-6"></div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-primary/45 font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-focus-teal" />
            Your admission data is 100% encrypted & secure.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3.5 px-8 rounded transition-all focus-ring shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Validating Entry...
              </>
            ) : (
              <>
                <Send className="h-4.5 w-4.5" />
                Continue to Payment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
