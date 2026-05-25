'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  PhoneCall,
  Mail,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';

// Import the pre-existing QR code directly from the project directory
import qrCodeImage from '@/QR CODE/QR CODE.png';

interface Course {
  id: string;
  title: string;
  fee: number;
  category: string;
}

function FeesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const admissionId = searchParams.get('admission_id');

  const coachingEmail = process.env.NEXT_PUBLIC_COACHING_EMAIL || 'ctcampus2019@gmail.com';
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const [admission, setAdmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autofill form if logged in (for manual mode)
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.full_name || user.user_metadata?.name || '');
        setEmail(user.email || '');
      }
    };
    loadUser();
  }, [supabase]);

  // Load all active courses
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

  // Fetch admission details if ID is present
  useEffect(() => {
    if (!admissionId) return;

    const fetchAdmissionDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await supabase
          .from('admissions')
          .select(`
            id,
            status,
            payment_submitted,
            course_id,
            profiles (
              full_name,
              phone
            ),
            courses (
              title,
              fee,
              category
            )
          `)
          .eq('id', admissionId)
          .maybeSingle();

        if (fetchErr) throw fetchErr;
        if (!data) throw new Error('Enrollment registration not found.');

        setAdmission(data);
        if (data.status === 'pending_verification' || data.status === 'approved') {
          setSuccess(true);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch enrollment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionDetails();
  }, [admissionId, supabase]);

  // Course select handler
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

  // Submit direct checkout form (if no admissionId was provided yet)
  const handleDirectRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedCourseId || !name.trim() || !phone.trim() || !amount) {
      setError('Please fill out all billing details and select a program.');
      setLoading(false);
      return;
    }

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }

      // Check / Sync Profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      let profileId = '';
      if (profile) {
        profileId = profile.id;
      } else {
        const { data: newProfile, error: profileErr } = await supabase
          .from('profiles')
          .insert({
            full_name: name.trim(),
            phone: cleanPhone,
            role: 'student'
          })
          .select()
          .single();

        if (profileErr) throw profileErr;
        profileId = newProfile.id;
      }

      // Create Admission Record (initial status 'pending', payment_submitted false)
      const { data: newAdmission, error: admErr } = await supabase
        .from('admissions')
        .insert({
          student_id: profileId,
          course_id: selectedCourseId,
          status: 'pending',
          payment_submitted: false
        })
        .select()
        .single();

      if (admErr) throw admErr;

      // Update local query state
      router.push(`/fees?admission_id=${newAdmission.id}`);
    } catch (err: any) {
      setError(err.message || 'Staging checkout failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Complete Payment Flow
  const handlePaymentCompleted = async () => {
    if (!admission) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Update Database Record in Supabase
      const { error: updateErr } = await supabase
        .from('admissions')
        .update({
          payment_submitted: true,
          status: 'pending_verification',
          payment_submission_time: new Date().toISOString()
        })
        .eq('id', admission.id);

      if (updateErr) throw updateErr;

      // 2. Format details for Mailto
      const studentName = admission.profiles?.full_name || name || 'Aspirant';
      const studentPhone = admission.profiles?.phone || phone || 'Not provided';
      const studentEmail = email || 'Registered via OAuth';
      const selectedCourse = admission.courses?.title || 'Selected Course';

      const emailSubject = encodeURIComponent(`Payment Verification Request - ${studentName}`);
      const emailBody = encodeURIComponent(`Hello,

I have completed the payment for coaching enrollment.

Name: ${studentName}
Phone: ${studentPhone}
Email: ${studentEmail}
Course: ${selectedCourse}

Please verify my payment and activate my account.

Thank you.`);

      const mailtoUrl = `mailto:${coachingEmail}?subject=${emailSubject}&body=${emailBody}`;
      
      // Open native mail client
      window.location.href = mailtoUrl;

      // Show Success Screen
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Payment status registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. SUCCESS SCREEN STATE
  if (success) {
    return (
      <div className="py-20 text-left bg-background min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="bg-success/15 border border-success/30 text-success p-4 rounded-full inline-flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          
          <h2 className="font-display text-3xl font-extrabold text-primary">
            Request Logged Successfully!
          </h2>
          
          <p className="text-sm text-muted leading-relaxed">
            Your payment request has been submitted successfully. Our team will verify your payment and activate your account shortly.
          </p>

          <div className="bg-surface border border-border p-6 rounded-2xl text-left space-y-4">
            <h4 className="font-display font-bold text-primary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              What happens next?
            </h4>
            <ul className="text-xs text-muted space-y-2.5">
              <li className="flex gap-2">
                <span className="text-accent font-bold">1.</span>
                Our Karol Bagh accounting desk verifies SMS and bank records against your application parameters.
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">2.</span>
                Upon validation, your portal access is unlocked instantly, and an SMS confirmation is dispatched.
              </li>
              <li className="flex gap-2">
                <span className="text-accent font-bold">3.</span>
                Your allocated NLU/IIM alumni mentor will connect with you to book your study library cabin.
              </li>
            </ul>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="btn-primary flex items-center gap-2"
            >
              Access Dashboard
              <ChevronRight className="h-4 w-4" />
            </button>
            <a 
              href={`tel:${supportPhone}`}
              className="btn-secondary flex items-center gap-2 bg-white"
            >
              <PhoneCall className="h-4 w-4 text-accent" />
              Call Support Helpline
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOADING STATE
  if (loading) {
    return (
      <div className="py-32 text-center bg-background min-h-[70vh] flex items-center justify-center">
        <div className="space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
          <p className="text-xs text-muted font-bold tracking-wider uppercase">Loading Secure Payment Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-background text-left relative overflow-hidden">
      <div className="absolute inset-0 glow-gradient opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Segment */}
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/25 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Coaching Fee Checkout
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-primary leading-tight">
            Coaching Fee Settlement
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            Verify your admission credentials and settle your program fee instantly via manual UPI QR code transfer. No dynamic gate charges, zero platform commission leaks.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: PAYMENT SYSTEM (OR BILLING DETAILS IF GUEST) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft space-y-6">
            
            {admission ? (
              // ACTIVE UPI PAY SYSTEM SCREEN
              <div className="space-y-6">
                <div className="border-b border-border pb-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider font-body">Verification Targets</span>
                  <h3 className="font-display text-xl font-bold text-primary">{admission.courses?.title}</h3>
                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                    <div>
                      <span className="text-muted block">Student Name</span>
                      <span className="font-bold text-primary block mt-0.5">{admission.profiles?.full_name}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Helpline Mobile</span>
                      <span className="font-bold text-primary block mt-0.5">+91 {admission.profiles?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-surface border border-accent/15 rounded-xl p-5 space-y-3.5">
                  <h4 className="font-display font-bold text-sm text-primary flex items-center gap-1.5">
                    <QrCode className="h-4 w-4 text-accent" />
                    Payment Instructions
                  </h4>
                  <ul className="text-xs text-muted space-y-2.5 list-decimal pl-4 font-medium">
                    <li>Scan the UPI QR code shown on the screen using any application (GPay, PhonePe, Paytm, etc.).</li>
                    <li>Settle the precise program fee: <span className="font-extrabold text-primary">₹{admission.courses?.fee?.toLocaleString('en-IN')}</span></li>
                    <li>Once completed, click <span className="font-bold text-primary">"I've Completed Payment"</span> below.</li>
                    <li>Verify details and dispatch the auto-drafted email trigger to Karol Bagh desk.</li>
                    <li>Your account access and allocated silent library cabin will unlock upon verification.</li>
                  </ul>
                </div>

                {/* Main QR Display */}
                <div className="flex flex-col items-center justify-center p-6 border border-border rounded-2xl bg-surface/5 space-y-4">
                  <div className="bg-white p-3 border border-border/80 rounded-2xl shadow-soft relative max-w-[280px]">
                    <Image 
                      src={qrCodeImage} 
                      alt="UPI QR Code Payment Directory" 
                      className="rounded-xl w-full h-auto"
                      priority
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-primary">CT CAMPUS Karol Bagh Desk QR</span>
                    <span className="text-[10px] text-muted block mt-0.5">Settle: ₹{admission.courses?.fee?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Confirm Button */}
                {error && (
                  <div className="flex items-start gap-2 bg-error/5 text-error p-3 rounded-lg text-xs border border-error/15">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handlePaymentCompleted}
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Verification Status...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      I've Completed Payment
                    </>
                  )}
                </button>
              </div>

            ) : (
              // NO ADMISSION_ID: GUEST PRE-ENROLLMENT BILLING FORM
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2 border-b border-border pb-3">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Billing Details
                </h3>

                <form onSubmit={handleDirectRegistration} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="e.g. Priyanshu Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Helpline Mobile *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="e.g. 8800833665"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>

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

                  <div>
                    <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Select Program *
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

                  {amount && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Amount to Settle
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`₹${amount.toLocaleString('en-IN')}`}
                        className="form-input bg-surface font-extrabold text-primary"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="flex items-start gap-2 bg-error/5 text-error p-3 rounded-lg text-xs border border-error/15">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Checkout Ledger...
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
            )}
          </div>

          {/* RIGHT: HELPLINE & SECURE ASSURANCE */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface border border-accent/20 rounded-2xl p-6 sm:p-8 space-y-4">
              <h4 className="font-display font-extrabold text-primary flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Manual Verification Check
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                UPI transfer validation at CT CAMPUS is completely direct and manual. We eliminate intermediary banking delays, so 100% of your funds fuel your mentorship booklets and mock engines.
              </p>
              <ul className="text-xs text-primary/80 font-semibold space-y-3 pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  0% Payment Gateway Surcharges
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  Alumni Mentor Sync upon approval
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  Secure email-backed bank SMS checks
                </li>
              </ul>
            </div>

            {/* Helpline credentials linking directly to environmental vars */}
            <div className="bg-primary text-background rounded-2xl p-6 sm:p-8 space-y-4 text-left">
              <h4 className="font-display font-bold text-accent">Helpline & Verification Desk</h4>
              <p className="text-xs text-background/70 leading-relaxed">
                Need verification confirmation or facing an email trigger block? Reach our Karol Bagh campus coordinator directly:
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <a href={`tel:${supportPhone}`} className="flex items-center gap-2 hover:text-accent font-semibold text-background">
                  <PhoneCall className="h-4 w-4 text-accent shrink-0" />
                  <span>Call: +91 {supportPhone}</span>
                </a>
                <a href={`mailto:${coachingEmail}`} className="flex items-center gap-2 hover:text-accent font-semibold text-background">
                  <Mail className="h-4 w-4 text-accent shrink-0" />
                  <span>Email: {coachingEmail}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function FeesPage() {
  return (
    <Suspense fallback={
      <div className="py-32 text-center bg-background min-h-[70vh] flex items-center justify-center">
        <div className="space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
          <p className="text-xs text-muted font-bold tracking-wider uppercase">Loading Secure Payment Ledger...</p>
        </div>
      </div>
    }>
      <FeesPageContent />
    </Suspense>
  );
}
