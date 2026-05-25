'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Courses', href: '/courses' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-surface-white/95 backdrop-blur-md shadow-sm border-b border-border-light'
            : 'bg-surface-white border-b border-border-light shadow-sm'
        }`}
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-gutter h-20 flex items-center justify-between">
          {/* LOGO / BRAND */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="CT CAMPUS Logo"
              width={160}
              height={45}
              className="h-10 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-worksans text-sm font-semibold tracking-wide transition-all py-2 border-b-2 ${
                    isActive
                      ? 'text-focus-teal border-focus-teal'
                      : 'text-primary/70 hover:text-focus-teal border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="font-worksans text-sm font-semibold text-primary hover:text-focus-teal transition-colors flex items-center gap-1.5 px-3 py-2 rounded focus-ring"
            >
              <ShieldCheck className="h-4 w-4" />
              Portal
            </Link>
            <Link 
              href="/admissions" 
              className="font-worksans text-sm font-semibold text-surface-white bg-success hover:bg-primary transition-all px-6 py-3 rounded focus-ring shadow-sm hover:ambient-shadow flex items-center gap-2 group"
            >
              Start Enrollment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded text-primary hover:bg-surface focus-ring"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 bg-surface-white lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
        style={{ top: '80px' }}
      >
        <div className="flex flex-col h-full justify-between p-6 overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-worksans text-base font-semibold py-3 border-b border-border-light flex items-center justify-between ${
                    isActive ? 'text-focus-teal' : 'text-primary/80'
                  }`}
                >
                  {link.name}
                  <span className="text-xs text-secondary">→</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-4 mt-auto pb-24">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="font-worksans text-center text-primary font-semibold border border-primary py-3 rounded flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              Student/Admin Portal
            </Link>
            <Link
              href="tel:8800833665"
              className="font-worksans text-center text-surface-white bg-success py-3 rounded flex items-center justify-center gap-2 font-semibold"
            >
              <Phone className="h-4 w-4" />
              Call Support: 8800833665
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

