import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Undergraduate Entrance Exam Coaching Delhi | CT CAMPUS',
  description: 'Elevate your Class 11 and 12 prep intersections. CT CAMPUS offers New Delhi’s finest foundation classes for CLAT legal, IPMAT aptitude, and CUET domains.',
  slug: '/undergraduate-entrance-coaching-delhi',
});

export default function UndergraduateEntranceCoachingDelhi() {
  return (
    <SeoLandingPage
      category="Foundation"
      locationName="Delhi, NCR"
      keywordTitle="Undergraduate Entrance Coaching in Delhi — CT CAMPUS"
      slug="/undergraduate-entrance-coaching-delhi"
    />
  );
}
