import { Metadata } from 'next';

const BASE_URL = 'https://ctcampus.co.in';

interface MetadataOptions {
  title: string;
  description: string;
  slug?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  slug = '',
  ogImage = '/images/og-default.jpg',
  noIndex = false,
}: MetadataOptions): Metadata {
  const canonicalUrl = `${BASE_URL}${slug.startsWith('/') ? slug : `/${slug}`}`;

  return {
    title: `${title} | CT CAMPUS Karol Bagh`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: canonicalUrl,
      title: `${title} | CT CAMPUS`,
      description,
      siteName: 'CT CAMPUS',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | CT CAMPUS`,
      description,
      images: [ogImage],
    },
  };
}

// 1. ORGANIZATION SCHEMA
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    'name': 'CT CAMPUS',
    'url': BASE_URL,
    'logo': `${BASE_URL}/logo.png`,
    'sameAs': [
      'https://www.facebook.com/ctcampus',
      'https://www.instagram.com/ctcampus',
      'https://www.youtube.com/ctcampus'
    ],
    'description': 'Mentorship for CLAT, IPMAT & CUET Success in New Delhi.',
    'telephone': '+918800833665',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks, Pusa Road',
      'addressLocality': 'Karol Bagh',
      'addressRegion': 'New Delhi',
      'postalCode': '110005',
      'addressCountry': 'IN'
    }
  };
}

// 2. LOCAL BUSINESS SCHEMA
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    'name': 'CT CAMPUS',
    'image': `${BASE_URL}/images/campus-facade.jpg`,
    'telephone': '8800833665',
    'priceRange': '₹₹',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks, Pusa Road, Opp. Pillar No. 80, Near Karur Vysya Bank',
      'addressLocality': 'Karol Bagh',
      'addressRegion': 'New Delhi',
      'postalCode': '110005',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '28.6464522',
      'longitude': '77.1868352'
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '09:00',
      'closes': '20:00'
    }
  };
}

// 3. COURSE SCHEMA
interface CourseSchemaOptions {
  title: string;
  description: string;
  price: number;
  slug: string;
}

export function getCourseSchema({ title, description, price, slug }: CourseSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': title,
    'description': description,
    'provider': {
      '@type': 'EducationalOrganization',
      'name': 'CT CAMPUS',
      'sameAs': BASE_URL
    },
    'offers': {
      '@type': 'Offer',
      'price': price.toString(),
      'priceCurrency': 'INR',
      'category': 'Paid',
      'url': `${BASE_URL}/courses/${slug}`
    }
  };
}

// 4. FAQ PAGE SCHEMA
interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

// 5. BLOG POSTING SCHEMA
interface BlogPostSchemaOptions {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  ogImage?: string;
}

export function getBlogPostSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName,
  ogImage = '/images/og-default.jpg',
}: BlogPostSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
    'datePublished': datePublished,
    'dateModified': dateModified,
    'author': {
      '@type': 'Person',
      'name': authorName
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CT CAMPUS',
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`
    }
  };
}

// 6. BREADCRUMB LIST SCHEMA
interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.item.startsWith('http') ? item.item : `${BASE_URL}${item.item}`
    }))
  };
}
