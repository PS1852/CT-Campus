import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Best CLAT Coaching in Delhi | CT CAMPUS Karol Bagh',
  description: 'Searching for the best CLAT coaching in Delhi? Enroll in the elite Law mentorship program at CT CAMPUS Karol Bagh. Directed by NLU alumni. Restricted 30-student batches.',
  slug: '/best-clat-coaching-delhi',
});

export default function BestClatCoachingDelhi() {
  return (
    <SeoLandingPage
      category="CLAT"
      locationName="New Delhi, India"
      keywordTitle="Best CLAT Coaching in Delhi — CT CAMPUS"
      slug="/best-clat-coaching-delhi"
    />
  );
}
