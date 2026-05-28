import React from 'react';
import { generatePageMetadata, getLocalBusinessSchema } from '@/lib/seo/metadata';
import { MapPin, Phone, Mail, Clock, Map, Landmark } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';
import { createClient } from '@/lib/supabase/server';
import JsonLd from '@/components/shared/JsonLd';

export const metadata = generatePageMetadata({
  title: 'Contact Us & Campus Directions | CT CAMPUS Karol Bagh',
  description: 'Reach our New Delhi campus. Get directions opposite Metro Pillar 80 Karol Bagh, view open hours, and request direct mentor support.',
  slug: '/contact',
});

// Fallback courses list
const fallbackCourses = [
  { title: 'CLAT Mastery Program', slug: 'clat-coaching-delhi', category: 'CLAT' },
  { title: 'IPMAT Excellence Program', slug: 'best-ipmat-coaching-delhi', category: 'IPMAT' },
  { title: 'CUET Foundation Course', slug: 'best-cuet-coaching-delhi', category: 'CUET' },
];

export default async function ContactPage() {
  const supabase = createClient();
  const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '8800833665';
  const coachingEmail = process.env.NEXT_PUBLIC_COACHING_EMAIL || 'ctcampus2019@gmail.com';

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('title, slug, category')
    .eq('is_active', true);

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  return (
    <div className="py-20 bg-background font-worksans text-primary flex flex-col items-center">
      <div className="w-full max-w-container-max px-margin-mobile md:px-gutter space-y-16">
        
        {/* Header Segment */}
        <header className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-focus-teal/10 text-focus-teal font-semibold text-xs uppercase tracking-wider">
            Campus Helpdesk
          </div>
          <h1 className="font-manrope text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
            Connect With Our Mentors
          </h1>
          <p className="text-sm md:text-base text-primary/60 leading-relaxed">
            Have queries regarding class timing options, admissions, or installment choices? Connect with our Karol Bagh center team directly.
          </p>
        </header>

        {/* Layout split */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column: Contact details cards & map */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: MapPin, title: 'Campus Address', details: '5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks, Pusa Road, Opp. Pillar No. 80, Near Karur Vysya Bank, New Delhi – 110005' },
                { icon: Clock, title: 'Center Timings', details: 'Monday to Sunday\n9:00 AM to 8:00 PM\n(All Days Open)' },
                { icon: Phone, title: 'Direct Phone', details: `+91 ${supportPhone}\n(Call / WhatsApp)` },
                { icon: Mail, title: 'Email Address', details: `${coachingEmail}` },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-surface-white border border-border-light rounded p-6 space-y-4 hover:ambient-shadow transition-shadow">
                    <div className="bg-focus-teal/10 text-focus-teal p-2.5 rounded inline-flex">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-manrope font-bold text-primary text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs md:text-sm text-primary/60 leading-relaxed whitespace-pre-line font-semibold">{item.details}</p>
                  </div>
                );
              })}
            </div>

            {/* Local Business Rich Snippet Schema Injection */}
            <JsonLd schema={getLocalBusinessSchema()} />

            {/* Embedded Google Maps Widget */}
            <div className="border border-border-light rounded overflow-hidden shadow-sm bg-surface-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4889166687483!2d77.1922226!3d28.6450779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05daf453e4eb%3A0xea6359e0f3d640b3!2sCT%20Campus!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CT CAMPUS Map Coordinates"
              ></iframe>
              <div className="bg-surface px-6 py-4 flex items-center justify-between text-xs text-primary/45 border-t border-border-light font-semibold">
                <span className="flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-focus-teal" />
                  Opposite Metro Pillar 80 Karol Bagh
                </span>
                <span>Karol Bagh Campus Map</span>
              </div>
            </div>
          </div>

          {/* Right Column: Career Counselling Inquiry Panel */}
          <div className="lg:col-span-5 bg-surface-white border border-border-light p-6 md:p-8 rounded shadow-sm text-left">
            <div className="space-y-2 mb-6">
              <h2 className="font-manrope text-xl md:text-2xl font-bold text-primary">Request Strategic Counseling</h2>
              <p className="text-xs text-primary/60">Schedule your individual offline mock trial session with senior advisors.</p>
            </div>
            <HomeInquiryForm courses={courses} />
          </div>
        </main>

      </div>
    </div>
  );
}
