import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { CheckCircle2, Award, Clock, Users, MapPin, Milestone } from 'lucide-react';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'About CT CAMPUS | Leading Mentorship Institute New Delhi',
  description: 'Learn about CT CAMPUS Karol Bagh. Meet our NLU & IIM alumni directors and discover how our 1-on-1 coaching model ensures undergraduate success.',
  slug: '/about',
});

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 bg-background text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Hero Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-surface border border-accent/20 px-3 py-1 rounded-full">
              Our Legacy & Core Values
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary leading-tight">
              Pioneering Personal Mentorship Over Mass Classes
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed">
              At **CT CAMPUS**, we recognized a glaring flaw in the Indian competitive exam coaching sector: students were treated as roll numbers in crowded lecture halls of 150+. Direct feedback was non-existent.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Established in the competitive education hub of Karol Bagh, New Delhi, we set out with a simple mission: **restrict our batch sizes to 30 candidates and assign every student a personal coach (NLU/IIM alumni)**. This ensures custom mock schedules, daily query settlement, and continuous mental health counseling.
            </p>
          </div>
          
          <div className="lg:col-span-5 bg-surface border border-border p-8 rounded-2xl space-y-6">
            <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-2">
              Institute Pillars
            </h3>
            {[
              { icon: Award, title: 'Expert Alumni Board', desc: 'Syllabus designed and audited directly by top rankers from National Law Universities and IIM directors.' },
              { icon: Clock, title: 'Flexible Timing Batches', desc: 'Tailored shifts for school-going Class 11/12 students, dropper sprinters, and weekend tracks.' },
              { icon: Users, title: 'Personal Quiet Cabins', desc: 'Enjoy full library access with individualized air-conditioned, sound-damped study cabins.' },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="bg-primary/5 p-2 rounded-lg text-accent shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm sm:text-base">{pillar.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Directors Message */}
        <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12 mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
              "We Prepare You for the Test and the Career"
            </h2>
            <blockquote className="text-sm sm:text-base text-muted italic border-l-4 border-accent pl-4 py-1 leading-relaxed">
              "Competitive prep is a marathon, not a sprint. While we teach you logical shortcuts and legal rules, our primary focus is helping you build the reading endurance and analytical vocabulary required to thrive in law, management, and elite universities."
            </blockquote>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider pt-2">
              — Board of Directors, CT CAMPUS
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="border border-border/80 bg-white p-6 rounded-2xl text-center space-y-3 shadow-sm w-full">
              <div className="bg-primary/5 p-3 rounded-full inline-flex text-accent">
                <Milestone className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-primary">Need Counselling?</h4>
              <p className="text-xs text-muted">Arrange a personal mock counseling diagnostic run at our campus.</p>
              <Link href="/contact" className="btn-primary w-full text-xs min-h-[40px] flex items-center justify-center">
                Book Campus Visit
              </Link>
            </div>
          </div>
        </div>

        {/* Section 3: Value Addons Checklist */}
        <div className="space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
              Why Aspirants Trust CT CAMPUS
            </h2>
            <p className="text-sm text-muted">
              We provide the most robust undergraduate entrance preparation ecosystem in Delhi.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '1-on-1 Personal Strategy Mentor (NLU/IIM alumni)',
              'Restricted batch limits (Strictly 30 seats per cohort)',
              'Interactive smartboards with modern digital portal logs',
              'Couriers of printed comprehensive topic modules',
              'Silent study library cabins (A/C and sound-damped)',
              'Weekly parent reporting dashboards and video calls syncs',
            ].map((val, idx) => (
              <div key={idx} className="flex gap-3 bg-white border border-border p-4 rounded-xl shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-primary/80 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
