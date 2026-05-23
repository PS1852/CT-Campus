import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'IPMAT Coaching in New Delhi | IIM Integrated Prep | CT CAMPUS',
  description: 'Join the ultimate IPMAT integrated program prep coaching in New Delhi. directed by IIM alumni with dedicated WAT/PI simulated interview panels.',
  slug: '/ipmat-coaching-new-delhi',
});

export default function IpmatCoachingNewDelhi() {
  return (
    <SeoLandingPage
      category="IPMAT"
      locationName="New Delhi, India"
      keywordTitle="Premier IPMAT Coaching in New Delhi — CT CAMPUS"
      slug="/ipmat-coaching-new-delhi"
    />
  );
}
