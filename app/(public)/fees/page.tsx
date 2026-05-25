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
  PhoneCall, 
  Mail, 
  QrCode, 
  Sparkles, 
  ChevronRight,
  Receipt
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

  // Autofill form if logged in
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.full_name || user.user_metadata?.name || '');
        setEmail(user.email || '');
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load active courses
  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('courses')
        .select('id, title, fee, category')
        .eq('is_active', true);
      if (data && data.length > 0) {
        setCourses(data);
      } else {
        // Fallback courses if DB query fails
        setCourses([
          { id: 'f1a82736-b0d6-4667-880a-bc3e9b7c322a', title: 'CLAT Mentorship Program', fee: 50000, category: 'CLAT' },
          { id: '551ae500-4057-4fe0-aa6b-887b004c566d', title: 'Undergraduate Entrance Foundation', fee: 120000, category: 'Foundation' },
          { id: '381a710f-19fa-42f9-b4e7-e0830fe466ac', title: 'CLAT Target Batch', fee: 50000, category: 'CLAT' },
          { id: '619bc63c-12b3-4fd5-b926-10a313cd9aac', title: 'CUET Crash Course', fee: 27500, category: 'CUET' },
          { id: 'e8cec99d-b29c-4656-95f3-03d75aa4c39c', title: 'IPMAT IIM Integrated Prep', fee: 80000, category: 'IPMAT' },
          { id: '92261f6f-82d1-4c3c-b9a4-1abf24f0a9ab', title: 'CUET UG Success Batch', fee: 30000, category: 'CUET' },
        ]);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissionId]);

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

      // Use SECURITY DEFINER RPC to bypass RLS for guest checkout
      const { data, error: rpcError } = await supabase.rpc('direct_checkout', {
        p_name: name.trim(),
        p_phone: cleanPhone,
        p_email: email.trim() || null,
        p_course_id: selectedCourseId,
      });

      if (rpcError) throw rpcError;

      router.push(`/fees?admission_id=${data.admission_id}`);
    } catch (err: any) {
      setError(err.message || 'Staging checkout failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCompleted = async () => {
    if (!admission) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Update Database Record
      const { error: updateErr } = await supabase
        .from('admissions')
        .update({
          payment_submitted: true,
          status: 'pending_verification',
          payment_submission_time: new Date().toISOString()
        })
        .eq('id', admission.id);

      if (updateErr) throw updateErr;

      // 2. Format prefilled mailto
      const studentName = admission.profiles?.full_name || name || 'Aspirant';
      const studentPhone = admission.profiles?.phone || phone || 'Not provided';
      const studentEmail = email || 'Registered';
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

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${coachingEmail}&su=${emailSubject}&body=${emailBody}`;
      window.open(gmailUrl, '_blank');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Payment status registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. SUCCESS STATE
  if (success) {
    return (
      <div className="w-full max-w-[800px] bg-surface-white border border-border-light rounded-lg shadow-sm p-8 md:p-12 text-center space-y-6 font-worksans">
        <div className="bg-success/10 border border-success/30 text-success p-4 rounded-full inline-flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        
        <h2 className="font-manrope text-3xl font-extrabold text-primary">
          Verification Request Logged
        </h2>
        
        <p className="text-sm text-primary/70 max-w-lg mx-auto leading-relaxed">
          Your manual payment status has been set to **"Pending Verification"**. Please make sure you have dispatched the pre-filled verification email trigger from your mail client.
        </p>

        <div className="bg-surface rounded-lg border border-border-light p-6 text-left space-y-4 max-w-xl mx-auto">
          <h4 className="font-manrope font-bold text-sm text-primary flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-focus-teal" />
            Verification Process Details
          </h4>
          <ul className="text-xs text-primary/60 space-y-2.5 list-decimal pl-4">
            <li>Our Karol Bagh accounts office reconciles bank logs and dispatches confirmation.</li>
            <li>Upon manual validation, your student account role unlocks instantly.</li>
            <li>Your strategic mock cabin and library allocation details will be sent via SMS support.</li>
          </ul>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto bg-primary hover:bg-focus-teal text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2"
          >
            Access Portal Dashboard
            <ChevronRight className="h-4 w-4" />
          </button>
          <a 
            href={`tel:${supportPhone}`}
            className="w-full sm:w-auto border border-border-light hover:border-focus-teal text-primary font-manrope font-bold py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="h-4 w-4 text-focus-teal" />
            Helpline Contact
          </a>
        </div>
      </div>
    );
  }

  // 2. LOADING STATE
  if (loading) {
    return (
      <div className="w-full max-w-[800px] py-20 text-center flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-focus-teal mb-4" />
        <p className="text-xs text-primary/45 uppercase tracking-widest font-bold">Verifying Admissions Coordinates...</p>
      </div>
    );
  }

  // 3. MAIN FORM / CHECKS
  return (
    <div className="w-full max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter font-worksans text-left px-margin-mobile md:px-0">
      
      {/* Checkout Box Column */}
      <div className="lg:col-span-8 bg-surface-white rounded-lg border border-border-light p-6 md:p-10 space-y-8 shadow-sm">
        {admission ? (
          // Secure payment QR display
          <div className="space-y-6">
            <div className="border-b border-border-light pb-4">
              <span className="text-[10px] uppercase font-bold text-focus-teal tracking-widest block mb-1">Coaching Placement Checkout</span>
              <h3 className="font-manrope text-2xl font-bold text-primary">{admission.courses?.title}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-semibold text-primary/70">
                <div>
                  <span className="text-primary/45 block text-[10px] uppercase">Registered Student</span>
                  <span className="block mt-0.5">{admission.profiles?.full_name}</span>
                </div>
                <div>
                  <span className="text-primary/45 block text-[10px] uppercase">Student Phone</span>
                  <span className="block mt-0.5">+91 {admission.profiles?.phone}</span>
                </div>
              </div>
            </div>

            {/* Instruction list */}
            <div className="bg-surface rounded border border-border-light p-6 space-y-4">
              <h4 className="font-manrope text-sm font-bold text-primary flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-focus-teal" />
                Scan to Settle Program Fee
              </h4>
              <ul className="text-xs text-primary/60 space-y-2.5 list-decimal pl-4 leading-relaxed font-semibold">
                <li>Launch your payment application (GPay, PhonePe, Paytm, or BHIM app).</li>
                <li>Scan the displayed QR code carefully.</li>
                <li>Complete the manual transfer transaction of: <span className="font-extrabold text-primary">₹{admission.courses?.fee?.toLocaleString('en-IN')}</span></li>
                <li>Click the <span className="font-bold text-focus-teal">"I've Completed Payment"</span> button below.</li>
                <li>Send the prefilled email trigger in your native client to complete auditing.</li>
              </ul>
            </div>

            {/* QR Embedded Display */}
            <div className="flex flex-col items-center justify-center p-6 border border-border-light rounded-lg bg-surface/50 space-y-4">
              <div className="bg-surface-white p-3 border border-border-light rounded-lg shadow-sm max-w-[240px]">
                <Image 
                  src={qrCodeImage} 
                  alt="Coaching UPI Checkout QR Code" 
                  className="rounded"
                  priority
                />
              </div>
              <div className="text-center font-semibold">
                <span className="text-xs text-primary block">CT CAMPUS Karol Bagh Desk</span>
                <span className="text-[10px] text-primary/45 block mt-0.5">Amount: ₹{admission.courses?.fee?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-xs border border-error/15">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handlePaymentCompleted}
              disabled={submitting}
              className="w-full bg-success hover:bg-primary text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-all focus-ring shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Updating Database Registry...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4.5 w-4.5 text-focus-teal" />
                  I've Completed Payment
                </>
              )}
            </button>
          </div>
        ) : (
          // Direct checkout fallback for guest bills
          <div className="space-y-6">
            <h3 className="font-manrope text-xl font-bold text-primary flex items-center gap-2 border-b border-border-light pb-4">
              <CreditCard className="h-5 w-5 text-focus-teal" />
              Direct Program Payment
            </h3>

            <form onSubmit={handleDirectRegistration} className="space-y-4 font-worksans font-medium text-sm text-primary/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Priyanshu Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="custom-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone">Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="program">Target Program *</label>
                <select
                  id="program"
                  required
                  value={selectedCourseId}
                  onChange={handleCourseChange}
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

              {error && (
                <div className="flex items-start gap-2 bg-error/5 text-error p-4 rounded text-xs border border-error/15">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-3.5 px-6 rounded transition-all focus-ring shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  'Generate UPI QR Checkout'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface-white rounded-lg border border-border-light p-6 shadow-sm space-y-6 sticky top-28">
          <h4 className="font-manrope text-lg font-bold text-primary flex items-center gap-2 border-b border-border-light pb-4">
            <Receipt className="h-4.5 w-4.5 text-focus-teal" />
            Fee Settlement Invoice
          </h4>

          {amount ? (
            <div className="space-y-4 text-xs font-semibold text-primary/70">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-primary text-sm font-bold">Standard Batch Fees</p>
                  <p className="text-primary/45 font-medium text-[10px] mt-0.5">Syllabus Study Material + Cabins</p>
                </div>
                <p className="font-bold text-primary">₹{(amount + 5001).toLocaleString('en-IN')}</p>
              </div>

              <div className="flex justify-between items-center text-success border-t border-dashed border-border-light pt-4">
                <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Special Waiver</span>
                <p className="font-bold">-₹5,001</p>
              </div>

              <div className="border-t border-border-light pt-4 space-y-2">
                <div className="flex justify-between items-center text-primary/50">
                  <span>Net Base Total</span>
                  <span>₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-primary/50">
                  <span>GST (Included 0%)</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="border-t border-border-light pt-4 flex justify-between items-center text-primary">
                <span className="font-manrope text-sm font-bold">Settlement Amount</span>
                <span className="font-manrope text-lg font-extrabold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-primary/30 text-xs font-semibold uppercase tracking-widest">
              Please Select a Program Track
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeesPage() {
  return (
    <div className="py-20 bg-background flex flex-col items-center">
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="CT CAMPUS Logo"
          width={200}
          height={56}
          className="h-14 w-auto object-contain"
          priority
        />
      </div>
      <Suspense fallback={
        <div className="w-full max-w-[800px] py-20 text-center flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-focus-teal mb-4" />
          <p className="text-xs text-primary/45 uppercase tracking-widest font-bold">Initiating Secured Portals...</p>
        </div>
      }>
        <FeesPageContent />
      </Suspense>
    </div>
  );
}
