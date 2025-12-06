'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Folder, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const sidebarItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/teams', label: 'Teams', icon: Users },
  { href: '/dashboard/projects', label: 'Projects', icon: Folder },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">
            m
          </div>
          myBoard
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === item.href || pathname?.startsWith(item.href + '/')
                ? "bg-red-50 text-red-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md w-full"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
      </div>
    </div>
  );
}
