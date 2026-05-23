import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, AlertCircle, Plus, Check, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const supabase = createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-primary">
            Course Catalog Administrator
          </h1>
          <p className="text-sm text-muted">
            Manage course tags, pricing metrics, and active timeline parameters.
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 space-y-6">
        <h3 className="font-display text-xl font-bold text-primary border-b border-border pb-3">
          Current Offerings List
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course: any) => (
              <div key={course.id} className="border border-border/80 rounded-xl p-5 hover:border-accent transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-0.5 text-[9px] uppercase font-bold bg-surface border border-accent/20 text-accent rounded-full">
                      {course.category}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                      course.is_active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {course.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-primary">{course.title}</h4>
                  <p className="text-xs text-muted leading-relaxed line-clamp-3">{course.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60 flex justify-between items-center text-xs font-semibold text-primary">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-accent" />
                    {course.duration}
                  </span>
                  <span className="text-base font-extrabold text-primary">
                    ₹{course.fee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-muted font-medium text-xs">
              <div className="flex flex-col items-center justify-center space-y-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <span>No courses found in database schema.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
