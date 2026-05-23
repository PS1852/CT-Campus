import React from 'react';
import SeoLandingPage from '@/components/shared/SeoLandingPage';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'CLAT Mentorship in Delhi | NLU Alumni Guides | CT CAMPUS',
  description: '1-on-1 CLAT mentorship in Delhi. Learn passage speedups, logic shortcuts, and mock video audits directly from National Law University (NLU) alumni.',
  slug: '/clat-mentorship-delhi',
});

export default function ClatMentorshipDelhi() {
  return (
    <SeoLandingPage
      category="CLAT"
      locationName="Delhi NCR"
      keywordTitle="NLU Alumni CLAT Mentorship in Delhi — CT CAMPUS"
      slug="/clat-mentorship-delhi"
    />
  );
}
