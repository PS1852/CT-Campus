import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Terms of Service | CT CAMPUS',
  description: 'Review the official terms of service, enrollment rules, and academic code of conduct at CT CAMPUS Karol Bagh New Delhi.',
  slug: '/terms',
});

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary mb-8 border-b border-border pb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-muted">Last Updated: May 23, 2026</p>

        <p className="text-sm sm:text-base text-muted leading-relaxed">
          By accessing the website at <span className="font-semibold">ctcampus.co.in</span> or enrolling in our offline/online mentorship programs at Karol Bagh, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">1. Enrollment & Course Access</h3>
        <p className="text-sm text-muted leading-relaxed">
          Our batch sizes are strictly limited to 30 candidates to ensure alumni strategy density. Once a batch is allocated to a student post career consultation, they must comply with the timetable rules. Switch shifts are only permitted upon written approval from the directors.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">2. Code of Conduct & Library Usage</h3>
        <p className="text-sm text-muted leading-relaxed">
          Students must maintain absolute academic decorum inside our Karol Bagh center. The air-conditioned quiet cabins are dedicated strictly to mock tests solving and silent learning. Any disruptive actions will lead to immediate cancellation of campus permissions.
        </p>

        <h3 className="font-display text-xl font-bold text-primary pt-4">3. Revisions & Errata</h3>
        <p className="text-sm text-muted leading-relaxed">
          The competitive syllabus (CLAT, IPMAT, CUET) is dynamic. We continually update our booklet couriers and online portal questions to match current exam grids.
        </p>
      </div>
    </div>
  );
}
