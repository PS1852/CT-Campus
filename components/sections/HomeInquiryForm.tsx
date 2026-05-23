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
      <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
        <div className="bg-success/10 text-success p-4 rounded-full">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h4 className="font-display text-2xl font-bold text-primary">Inquiry Received!</h4>
        <p className="text-sm text-muted max-w-sm">
          Thank you for reaching out. An academic director from our Karol Bagh campus will call you on your phone within 30 minutes to schedule your counselling session.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-secondary mt-4 w-full"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Honeypot field (hidden from screen reader and standard viewport) */}
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

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
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
          className="form-input"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
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
          className="form-input"
        />
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Email Address (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="e.g. rahul@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      {/* Course Selection */}
      <div>
        <label htmlFor="course_interest" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Program Interest
        </label>
        <select
          id="course_interest"
          name="course_interest"
          value={formData.course_interest}
          onChange={handleChange}
          className="form-input bg-white appearance-none"
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
      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          Any Message or Question (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="How can our mentors help you?"
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
            Submitting...
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
