'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  fee: number;
  category: string;
}

export default function FeesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('id, title, fee, category')
        .eq('is_active', true);
      if (data) {
        setCourses(data);
      }
    };
    fetchCourses();
  }, [supabase]);

  // Handle course changes to populate standard fees automatically
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setAmount(course.fee);
    } else {
      setAmount('');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedCourseId || !name || !phone || !amount) {
      setError('Please fill out all required billing fields.');
      setLoading(false);
      return;
    }

    try {
      // 1. INITIATE MOCK PAYMENT VIA ENDPOINT
      const initResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: selectedCourseId,
          name,
          phone,
          email,
          amount,
        }),
      });

      const initResult = await initResponse.json();

      if (!initResponse.ok) {
        throw new Error(initResult.error || 'Payment initiation failed.');
      }

      const { order_id, mock_key } = initResult;

      // 2. VERIFY MOCK PAYMENT VIA ENDPOINT
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id,
          payment_id: `pay_MOCK_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          signature: `sig_MOCK_${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.success) {
        router.push(`/payment/success?order=${order_id}&course=${selectedCourseId}`);
      } else {
        router.push('/payment/failure');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
            Secure Checkout
          </span>
          <h1 className="font-display text-4xl font-bold text-primary">
            Online Fee Settlement
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Enter your target program details below. Future production runs support Razorpay checkouts using secure keys. Enter credentials below for a quick mock verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Checkout billing details */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft">
            <h3 className="font-display text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b border-border pb-3">
              <CreditCard className="h-5 w-5 text-accent" />
              Billing Specifications
            </h3>

            <form onSubmit={handlePayment} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Billing Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Billing Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Billing Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. rahul@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Program Selection */}
              <div>
                <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Select Target Program *
                </label>
                <select
                  id="course"
                  required
                  value={selectedCourseId}
                  onChange={handleCourseChange}
                  className="form-input bg-white appearance-none"
                >
                  <option value="">Choose a Program...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.category}) — ₹{c.fee.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                  Payable Amount (INR) *
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  disabled
                  placeholder="0.00"
                  value={amount}
                  className="form-input bg-surface font-semibold text-primary"
                />
              </div>

              {/* Errors */}
              {error && (
                <div className="flex items-start gap-2 bg-error/5 text-error p-3 rounded-lg text-xs border border-error/15">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting Secure Gateway...
                  </>
                ) : (
                  <>
                    Settle Mentorship Fees
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Trust Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-surface border border-accent/20 rounded-2xl p-6 space-y-4">
              <h4 className="font-display font-bold text-primary flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                CT Campus Gateway
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                All digital transactions are encrypted under secure socket layers. Your payment details are never saved locally.
              </p>
              <ul className="text-xs text-primary/80 font-medium space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  256-bit SSL transaction encryptions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  Instantly generated receipts in portal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  Structured Razorpay-ready placeholder API
                </li>
              </ul>
            </div>

            <div className="bg-primary text-background rounded-2xl p-6 text-xs leading-relaxed space-y-2">
              <h4 className="font-display font-bold text-accent">Enrollment Help</h4>
              <p>For cash payments at the Karol Bagh center or checks submissions, please obtain a manual receipt directly from our frontdesk registry.</p>
              <div className="font-semibold text-accent pt-2">Helpline: +91 8800833665</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
