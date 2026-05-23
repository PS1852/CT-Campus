'use client';

import React, { useState } from 'react';
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

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_id: '',
        board_percentage: '',
        documents_url: '',
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
  );
}
