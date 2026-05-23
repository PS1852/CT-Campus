import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy | CT CAMPUS',
  description: 'Understand how CT CAMPUS Karol Bagh handles and secures your personal details, academic marks, and admissions documents.',
  slug: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-8 border-b border-border pb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted">Last Updated: May 23, 2026</p>
        
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Welcome to **CT CAMPUS** ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <span className="font-semibold">info@ctcampus.co.in</span>.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">1. Information We Collect</h3>
        <p className="text-sm text-muted leading-relaxed">
          We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products, when participating in activities on the website (such as filling out our inquiry forms or online admission applications), or otherwise contacting us. The personal information we collect includes:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm text-muted">
          <li>Personal Names, Phone Numbers, and Email Addresses.</li>
          <li>Academic details (e.g. Class 10/12 board score percentages).</li>
          <li>Links to public marksheets or documents uploaded by you for scholarship reviews.</li>
          <li>IP addresses (collected automatically via our rate limiting shields to prevent abuse).</li>
        </ul>

        <h3 className="font-display text-xl font-bold text-primary pt-4">2. How We Use Your Information</h3>
        <p className="text-sm text-muted leading-relaxed">
          We use the information we collect or receive to facilitate the creation of your student profile, process your online admission applications, send you strategic entrance exam notifications via SMS or WhatsApp, and ensure our APIs remain shielded from automated denial-of-service bot spams.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">3. Sharing & Disclosures</h3>
        <p className="text-sm text-muted leading-relaxed">
          We do not sell, rent, or trade your personal details with third-party advertising companies. Your records are only accessed by the authorized academic directors and admissions panel at our Karol Bagh center in New Delhi.
        </p>
      </div>
    </div>
  );
}
