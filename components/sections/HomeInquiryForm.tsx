'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Course {
  id?: string;
  title: string;
  slug: string;
  category: string;
}

interface HomeInquiryFormProps {
  courses: Course[];
}

export default function HomeInquiryForm({ courses }: HomeInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interest: '',
    message: '',
    website_verify: '', // Honeypot trap
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide both your name and phone number.');
      setLoading(false);
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/inquiries', {
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
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_interest: '',
        message: '',
        website_verify: '',
      });
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up font-worksans">
        <div className="bg-success/10 text-success p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h4 className="font-manrope text-2xl font-bold text-primary">Inquiry Received!</h4>
        <p className="text-sm text-primary/60 max-w-sm">
          An academic director from our Karol Bagh campus will call you on your WhatsApp number within 30 minutes to schedule your strategic mockup session.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="w-full bg-primary hover:bg-focus-teal text-surface-white font-manrope font-bold py-3 px-6 rounded transition-colors mt-4"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left font-worksans">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_verify">Leave empty</label>
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

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-bold text-primary/80 uppercase">
          Student / Parent Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          className="custom-input"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-xs font-bold text-primary/80 uppercase">
          Phone / WhatsApp Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          placeholder="e.g. 9876543210"
          value={formData.phone}
          onChange={handleChange}
          className="custom-input"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-bold text-primary/80 uppercase">
          Email Address (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="e.g. rahul@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="custom-input"
        />
      </div>

      {/* Course Selection */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="course_interest" className="text-xs font-bold text-primary/80 uppercase">
          Program Interest
        </label>
        <select
          id="course_interest"
          name="course_interest"
          value={formData.course_interest}
          onChange={handleChange}
          className="custom-input bg-surface-white"
        >
          <option value="">Select a Course Program...</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.title}>
              {c.title} ({c.category})
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-bold text-primary/80 uppercase">
          Any Message or Question (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="How can our mentors help you?"
          value={formData.message}
          onChange={handleChange}
          className="custom-input resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 bg-error/5 text-error p-3 rounded text-xs border border-error/15">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2 mt-2 focus-ring"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Request...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Request Fee Discount
          </>
        )}
      </button>
    </form>
  );
}
