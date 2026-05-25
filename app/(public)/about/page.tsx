import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { CheckCircle2, Award, Clock, Users, Milestone, Landmark } from 'lucide-react';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: 'About CT CAMPUS | Leading Mentorship Institute New Delhi',
  description: 'Learn about CT CAMPUS Karol Bagh. Meet our NLU & IIM alumni directors and discover how our 1-on-1 coaching model ensures undergraduate success.',
  slug: '/about',
});

export default function AboutPage() {
  return (
    <div className="py-20 bg-background font-worksans text-primary flex flex-col items-center">
      <div className="w-full max-w-container-max px-margin-mobile md:px-gutter space-y-20">
        
        {/* Pitch Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-focus-teal/10 text-focus-teal font-semibold text-xs uppercase tracking-wider">
              Our Legacy & Pedagogy
            </span>
            <h1 className="font-manrope text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight">
              Personalized Mentorship Over Crowd Lectures
            </h1>
            <p className="text-sm md:text-base text-primary/75 leading-relaxed">
              At **CT CAMPUS**, we recognized a persistent systemic issue in undergraduate competitive coaching: student learning was normalized across giant crowded batch sizes of 100+. Feedback cycles and strategic mock calibrations were non-existent.
            </p>
            <p className="text-sm md:text-base text-primary/60 leading-relaxed">
              Established in New Delhi’s premier education hub of Karol Bagh, we committed to a radical learning blueprint: **limit all batch cohorts strictly to 30 candidates and allocate every aspirant an individual strategic NLU or IIM alumni coach**.
            </p>
          </div>
          
          <div className="lg:col-span-5 bg-surface-white border border-border-light p-8 rounded-lg space-y-6 shadow-sm">
            <h3 className="font-manrope text-xl font-bold text-primary border-b border-border-light pb-4">
              Institutional Pillars
            </h3>
            {[
              { icon: Award, title: 'Alumni Core Board', desc: 'Preparation syllabus curated and audited by NLU rankers and expert academic directors.' },
              { icon: Clock, title: 'Flexible Timing Batches', desc: 'Schedules adapted for high school students, morning dropouts, and comprehensive weekend tracks.' },
              { icon: Users, title: 'Silent Library Cabins', desc: 'Personal air-conditioned sound-damped study cabins for rigorous focus sessions.' },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="bg-focus-teal/10 p-2.5 rounded text-focus-teal shrink-0 h-10 w-10 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-bold text-primary text-sm sm:text-base">{pillar.title}</h4>
                    <p className="text-xs text-primary/60 leading-relaxed mt-0.5">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* Directors Panel Quote Section */}
        <section className="bg-primary text-surface-white rounded-lg p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-surface-white">
              "We Prepare You for the Test and the Career Ahead"
            </h2>
            <blockquote className="text-sm md:text-base text-surface-container/70 italic border-l-4 border-focus-teal pl-4 py-1 leading-relaxed">
              "Competitive exam preparation is a marathon. While we equip you with shortcut formulas and logic modules, our core priority is building the critical vocabulary and comprehension rigor needed to thrive in top-tier national institutions."
            </blockquote>
            <p className="text-xs text-focus-teal font-bold uppercase tracking-widest pt-2">
              — BOARD OF DIRECTORS, CT CAMPUS
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="border border-border-light/10 bg-primary-container p-6 rounded-lg text-center space-y-4 shadow-sm w-full">
              <div className="bg-focus-teal/20 p-3.5 rounded-full inline-flex text-focus-teal">
                <Milestone className="h-8 w-8" />
              </div>
              <h4 className="font-manrope font-bold text-surface-white">Need Counselling?</h4>
              <p className="text-xs text-surface-container/60 leading-relaxed">Schedule a free strategizing session at our campus desks.</p>
              <Link 
                href="/contact" 
                className="w-full bg-focus-teal hover:bg-secondary text-surface-white font-manrope font-bold py-2.5 rounded transition-colors text-xs flex items-center justify-center gap-1.5 focus-ring"
              >
                Book Campus Visit
              </Link>
            </div>
          </div>
        </section>

        {/* Why Trust Checklists Grid */}
        <section className="space-y-10 text-left">
          <div className="space-y-3">
            <h2 className="font-manrope text-3xl font-bold text-primary">Why Aspirants Trust CT CAMPUS</h2>
            <p className="text-sm text-primary/60">We provide the most robust and high-trust academic ecosystem in Delhi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '1-on-1 strategy diagnostic mentor assignment (NLU/IIM alumni)',
              'Restricted batch limits (Strictly 30 seats per cohort limit)',
              'Interactive classroom board channels with digital summaries',
              'Syllabus study materials packages dispatched to doorstep',
              'AC study rooms with silent customized library cabins',
              'Parent reporting loops and regular mock review audits',
            ].map((val, idx) => (
              <div key={idx} className="flex gap-3 bg-surface-white border border-border-light p-5 rounded hover:ambient-shadow transition-shadow">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-primary/70 font-semibold leading-relaxed">{val}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
