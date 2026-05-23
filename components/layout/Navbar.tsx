'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Shield, GraduationCap, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Courses & Fees', href: '/courses' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Results', href: '/results' },
  { name: 'Blog', href: '/blog' },
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

  // Prevent scroll when mobile menu is open
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
            ? 'bg-background/90 backdrop-blur-md shadow-soft border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-background p-2 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-primary block">
                CT CAMPUS
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted block -mt-1">
                Academic Mentorship
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-accent font-semibold border-b-2 border-accent pb-1'
                      : 'text-primary/80 hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Portal
            </Link>
            <Link href="/contact" className="btn-primary flex items-center gap-2 group">
              Enquire Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-primary hover:bg-surface transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <div
        className={`fixed inset-0 z-35 bg-background lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px' }}
      >
        <div className="flex flex-col h-[calc(100vh-80px)] justify-between p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium tracking-wide pb-2 border-b border-border flex items-center justify-between ${
                    isActive ? 'text-accent font-bold' : 'text-primary'
                  }`}
                >
                  {link.name}
                  <span className="text-xs text-muted">→</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-4 mt-auto pb-10">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="btn-secondary w-full text-center flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Student/Admin Portal
            </Link>
            <Link
              href="tel:8800833665"
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Mentor (8800833665)
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
