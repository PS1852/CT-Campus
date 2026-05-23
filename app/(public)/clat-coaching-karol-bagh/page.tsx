import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'Top CLAT Coaching in Karol Bagh Delhi | CT CAMPUS',
  description: 'Join the premier CLAT and law entrance coaching institute in Karol Bagh, Delhi. Situated opposite Metro Pillar 80. NLU alumni mentorship.',
  slug: '/clat-coaching-karol-bagh',
});

export default function ClatCoachingKarolBagh() {
  return (
    <SeoLandingPage
      category="CLAT"
      locationName="Karol Bagh, New Delhi"
      keywordTitle="Top CLAT Coaching in Karol Bagh — CT CAMPUS"
      slug="/clat-coaching-karol-bagh"
    />
  );
}
