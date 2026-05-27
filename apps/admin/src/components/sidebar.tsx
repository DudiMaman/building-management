'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Home, Users, FileText, ListChecks,
  MessageSquare, Wallet, Wrench, Bell, Settings, ScrollText,
  Receipt, Megaphone, Vote, FolderArchive, Bot, BarChart3, Building,
  History,
} from 'lucide-react';

const items = [
  { href: '/', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/buildings', label: 'בניינים', icon: Building2 },
  { href: '/apartments', label: 'דירות', icon: Home },
  { href: '/people', label: 'אנשים', icon: Users },
  { href: '/rental-contracts', label: 'חוזי שכירות', icon: FileText },
  { href: '/tasks', label: 'משימות', icon: ListChecks },
  { href: '/tickets', label: 'פניות', icon: Wrench },
  { href: '/charges', label: 'חיובים', icon: Wallet },
  { href: '/invoices', label: 'חשבוניות וקבלות', icon: Receipt },
  { href: '/checks', label: 'צ׳קים', icon: ScrollText },
  { href: '/documents', label: 'מסמכים', icon: FolderArchive },
  { href: '/vendors', label: 'ספקים', icon: Building },
  { href: '/bulletin', label: 'לוח מודעות', icon: Megaphone },
  { href: '/polls', label: 'סקרים', icon: Vote },
  { href: '/whatsapp', label: 'תקשורת', icon: MessageSquare },
  { href: '/ai-bot', label: 'בוט AI', icon: Bot },
  { href: '/reports', label: 'דוחות', icon: BarChart3 },
  { href: '/notifications', label: 'התראות', icon: Bell },
  { href: '/audit-log', label: 'לוג ביקורת', icon: History },
  { href: '/settings', label: 'הגדרות', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Building className="h-4 w-4" />
          </span>
          ניהול מבנים
        </Link>
      </div>
      <nav className="overflow-y-auto p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-primary-50 font-medium text-primary-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
