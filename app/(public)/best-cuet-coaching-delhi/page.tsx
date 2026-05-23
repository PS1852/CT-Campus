import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Best CUET Coaching in Delhi | CT CAMPUS New Delhi',
  description: 'Join the best CUET coaching in Delhi for comprehensive language, domain subjects, and general test preparation. Directed opposite Metro Pillar 80 Karol Bagh.',
  slug: '/best-cuet-coaching-delhi',
});

export default function BestCuetCoachingDelhi() {
  return (
    <SeoLandingPage
      category="CUET"
      locationName="New Delhi, India"
      keywordTitle="Best CUET Coaching in Delhi — CT CAMPUS"
      slug="/best-cuet-coaching-delhi"
    />
  );
}
