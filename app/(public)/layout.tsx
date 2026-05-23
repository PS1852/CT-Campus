import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyMobileCTA from '@/components/layout/StickyMobileCTA';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Dynamic Main Section with responsive bottom-padding to avoid mobile sticky bar overlapping */}
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
