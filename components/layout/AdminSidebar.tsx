'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Megaphone,
  Inbox,
  UserCheck,
  Settings,
  LogOut,
  LineChart
} from 'lucide-react';

const adminMenu = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Courses CRUD', href: '/admin/courses', icon: BookOpen },
  { name: 'Blog Editor', href: '/admin/blog', icon: FileText },
  { name: 'Seeded FAQs', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Leads Funnel', href: '/admin/inquiries', icon: Inbox },
  { name: 'Admissions Log', href: '/admin/students', icon: UserCheck },
  { name: 'Portal Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-primary text-background border-r border-primary/20 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Brand logo header */}
      <div className="p-6 border-b border-background/10">
        <Link href="/admin" className="block">
          <div className="bg-surface-white p-2.5 rounded-lg flex items-center justify-center shadow-sm w-full">
            <Image
              src="/logo.png"
              alt="CT CAMPUS Logo"
              width={140}
              height={38}
              className="h-8 w-auto object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Menu links list */}
      <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'bg-accent text-primary font-bold shadow-sm'
                  : 'text-background/70 hover:bg-background/5 hover:text-background'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-background/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          System Sign Out
        </button>
      </div>
    </aside>
  );
}
