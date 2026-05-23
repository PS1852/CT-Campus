import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-background/90 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgb(26,26,46,0.08)] px-4 py-3 flex items-center gap-3">
      {/* Direct Call Button */}
      <a
        href="tel:8800833665"
        className="flex items-center justify-center bg-surface border border-border text-primary h-12 w-14 rounded-xl active:scale-95 transition-transform"
        aria-label="Call CT Campus Mentor"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* Main WhatsApp Mentorship CTA */}
      <a
        href="https://wa.me/918800833665?text=Hi%20CT%20Campus%20Mentor%2C%20I%20am%20interested%20in%20obtaining%20mentorship%20counselling%20for%20undergraduate%20entrances."
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-success text-white font-medium h-12 px-6 rounded-xl active:scale-98 transition-transform shadow-md"
      >
        <MessageCircle className="h-5 w-5 fill-current" />
        <span className="text-sm tracking-wide">Talk to Mentor</span>
      </a>
    </div>
  );
}
