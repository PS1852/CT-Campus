import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, GraduationCap, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-background border-t border-primary/20">
      {/* Top detailed footer links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-background text-primary p-2 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-background block">
                CT CAMPUS
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-accent block -mt-1">
                Academic Mentorship
              </span>
            </div>
          </div>
          <p className="text-sm text-background/70 leading-relaxed pt-2">
            CT CAMPUS is New Delhi’s premier coaching institute, dedicated to 1-on-1 strategic mentorship for CLAT, IPMAT, and CUET aspirants.
          </p>
          <div className="pt-2 text-xs text-background/60">
            <span className="font-semibold text-accent">Domain: </span>
            ctcampus.co.in
          </div>
        </div>

        {/* Col 2: Core Programs */}
        <div>
          <h3 className="font-display text-lg font-bold text-background mb-6 border-b border-background/10 pb-2">
            Our Courses
          </h3>
          <ul className="space-y-3">
            {[
              { name: 'CLAT Coaching', href: '/courses/clat-coaching-delhi' },
              { name: 'IPMAT Preparation', href: '/courses/best-ipmat-coaching-delhi' },
              { name: 'CUET General/Domain', href: '/courses/best-cuet-coaching-delhi' },
              { name: 'Undergrad Foundation', href: '/courses/undergraduate-entrance-coaching-delhi' },
              { name: 'CLAT Target Batch', href: '/courses/clat-mentorship-delhi' },
              { name: 'CUET Crash Course', href: '/courses/cuet-coaching-central-delhi' },
            ].map((course) => (
              <li key={course.name}>
                <Link
                  href={course.href}
                  className="text-sm text-background/70 hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 text-accent/50 group-hover:translate-x-1 transition-transform" />
                  {course.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <h3 className="font-display text-lg font-bold text-background mb-6 border-b border-background/10 pb-2">
            Academic portal
          </h3>
          <ul className="space-y-3">
            {[
              { name: 'Admissions Process', href: '/admissions' },
              { name: 'Faculty & Mentors', href: '/faculty' },
              { name: 'Success Stories', href: '/results' },
              { name: 'Student Trust Wall', href: '/testimonials' },
              { name: 'Exam Strategy Blog', href: '/blog' },
              { name: 'Seeded FAQ Bank', href: '/faqs' },
              { name: 'Reach Our Campus', href: '/contact' },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-background/70 hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-3 w-3 text-accent/50 group-hover:translate-x-1 transition-transform" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Location & Touch */}
        <div>
          <h3 className="font-display text-lg font-bold text-background mb-6 border-b border-background/10 pb-2">
            Karol Bagh Campus
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-background/70">
              <MapPin className="h-5 w-5 text-accent shrink-0 pt-0.5" />
              <span>
                5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks, Pusa Road, Opp. Pillar No. 80, Near Karur Vysya Bank, New Delhi – 110005
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm text-background/70">
              <Phone className="h-4 w-4 text-accent shrink-0" />
              <a href="tel:8800833665" className="hover:text-accent transition-colors">
                +91 8800833665 (Call / WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm text-background/70">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:info@ctcampus.co.in" className="hover:text-accent transition-colors">
                info@ctcampus.co.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal & Bottom bar */}
      <div className="bg-[#0f0f20] text-background/60 py-8 border-t border-background/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-center md:text-left leading-relaxed">
            © {currentYear} CT CAMPUS. All Rights Reserved. Designed for premium coaching.
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-accent transition-colors">
              Refund & Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
