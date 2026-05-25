import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const coachingEmail = process.env.NEXT_PUBLIC_COACHING_EMAIL || 'ctcampus2019@gmail.com';
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';

  return (
    <footer className="bg-primary text-surface-container border-t border-border-light pt-16 pb-8 font-worksans">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="bg-surface-white p-3 rounded-lg shadow-sm max-w-[180px] flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="CT CAMPUS Logo"
                width={150}
                height={42}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-surface-container/70 leading-relaxed">
              Achieve your dreams with us. Expert strategic mentorship for top tier law and management entrance exams CLAT, IPMAT, and CUET.
            </p>
          </div>

          {/* Programs Column */}
          <div>
            <h4 className="font-manrope text-sm font-bold uppercase tracking-wider text-surface-white mb-4">Programs</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  CLAT Preparation
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  IPMAT Excellence
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  CUET Foundation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-manrope text-sm font-bold uppercase tracking-wider text-surface-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-sm text-surface-container/70 hover:text-focus-teal transition-colors flex items-center gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-focus-teal" />
                  Admissions Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-manrope text-sm font-bold uppercase tracking-wider text-surface-white mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-surface-container/70">
                <MapPin className="h-5 w-5 text-focus-teal shrink-0 mt-0.5" />
                <span>WEA, Karol Bagh, Behind Starbucks, Pusa Road, New Delhi – 110005</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-surface-container/70">
                <Phone className="h-4 w-4 text-focus-teal shrink-0" />
                <a href={`tel:${supportPhone}`} className="hover:text-focus-teal transition-colors">
                  +91 {supportPhone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-surface-container/70">
                <Mail className="h-4 w-4 text-focus-teal shrink-0" />
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${coachingEmail}`} target="_blank" rel="noopener noreferrer" className="hover:text-focus-teal transition-colors">
                  {coachingEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-light/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-surface-container/60">
          <p>© {currentYear} CT CAMPUS. All Rights Reserved. Achieve your academic dreams with us.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-focus-teal transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-focus-teal transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

