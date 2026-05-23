import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Best IPMAT Coaching in Delhi | CT CAMPUS Karol Bagh',
  description: 'Searching for the best IPMAT coaching in Delhi? Enroll in the IIM integrated program prep course at CT CAMPUS Karol Bagh. Mapped with IIM Indore trends.',
  slug: '/best-ipmat-coaching-delhi',
});

export default function BestIpmatCoachingDelhi() {
  return (
    <SeoLandingPage
      category="IPMAT"
      locationName="New Delhi, NCR"
      keywordTitle="Best IPMAT Coaching in Delhi — CT CAMPUS"
      slug="/best-ipmat-coaching-delhi"
    />
  );
}
