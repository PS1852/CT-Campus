import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'CUET Coaching Central Delhi | CT CAMPUS Karol Bagh',
  description: 'Join the premier CUET coaching center in Central Delhi. Providing comprehensive preparation for languages, NCERT domains, and general aptitude.',
  slug: '/cuet-coaching-central-delhi',
});

export default function CuetCoachingCentralDelhi() {
  return (
    <SeoLandingPage
      category="CUET"
      locationName="Central Delhi, NCR"
      keywordTitle="Top CUET Coaching in Central Delhi — CT CAMPUS"
      slug="/cuet-coaching-central-delhi"
    />
  );
}
