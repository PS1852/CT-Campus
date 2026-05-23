import React from 'react';
import { generatePageMetadata, getLocalBusinessSchema } from '@/lib/seo/metadata';
import JsonLd from '@/components/shared/JsonLd';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Map } from 'lucide-react';
import HomeInquiryForm from '@/components/sections/HomeInquiryForm';
import { createClient } from '@/lib/supabase/server';

export const metadata = generatePageMetadata({
  title: 'Contact Us & Campus Directions | CT CAMPUS Karol Bagh',
  description: 'Reach our New Delhi campus. Get directions opposite Metro Pillar 80 Karol Bagh, view open hours, and request direct mentor support.',
  slug: '/contact',
});

// Fallback courses list if database is unreachable
const fallbackCourses = [
  { title: 'CLAT Mentorship Program', slug: 'clat-coaching-delhi', category: 'CLAT' },
  { title: 'IPMAT IIM Integrated Prep', slug: 'best-ipmat-coaching-delhi', category: 'IPMAT' },
  { title: 'CUET UG Success Batch', slug: 'best-cuet-coaching-delhi', category: 'CUET' },
];

export default async function ContactPage() {
  const supabase = createClient();

  const { data: dbCourses } = await supabase
    .from('courses')
    .select('title, slug, category')
    .eq('is_active', true);

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : fallbackCourses;

  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <>
      <JsonLd schema={localBusinessSchema} />

      <div className="py-12 sm:py-20 bg-background text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
              Reach Our Campus
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
              Contact Our New Delhi Helpdesk
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              Have a question regarding exam syllabus shifts or batch structures? Drop by our Karol Bagh campus or submit the contact query form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact details and Google Maps */}
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: MapPin, title: 'Campus Address', details: '5th Floor, 18/13 WEA, Karol Bagh, Behind Starbucks, Pusa Road, Opp. Pillar No. 80, Near Karur Vysya Bank, New Delhi – 110005' },
                  { icon: Clock, title: 'Campus Timings', details: 'Monday to Sunday\n9:00 AM to 8:00 PM\n(All Days Open)' },
                  { icon: Phone, title: 'Direct Helpline', details: '+91 8800833665\n(Call / WhatsApp)' },
                  { icon: Mail, title: 'Email Address', details: 'info@ctcampus.co.in\nadmissions@ctcampus.co.in' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-white border border-border/60 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-soft transition-shadow">
                      <div className="bg-surface text-accent p-2.5 rounded-lg inline-flex">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-primary text-sm sm:text-base">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">{item.details}</p>
                    </div>
                  );
                })}
              </div>

              {/* Google Map Container */}
              <div className="border border-border rounded-2xl overflow-hidden shadow-soft">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.442807353982!2d77.1868352!3d28.6464522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029961601d3b%3A0x6b4ef82df31a3821!2sWEA%2C%20Karol%20Bagh%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CT CAMPUS Karol Bagh Map Location"
                ></iframe>
                <div className="bg-surface px-6 py-4 flex items-center justify-between text-xs text-muted border-t border-border">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Map className="h-4 w-4 text-accent" />
                    Karol Bagh Campus Map Layout
                  </span>
                  <span>Opposite Metro Pillar 80</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Inquiry Form */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-soft">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-1">
                Book Career Counselling
              </h2>
              <p className="text-xs text-muted mb-6">
                Enter your details to schedule your free diagnostic mock test or academic consultation.
              </p>
              <HomeInquiryForm courses={courses} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
