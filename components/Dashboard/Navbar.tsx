'use client';

import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-8">
      <div className="text-sm breadcrumbs text-gray-500">
        Dashboard
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
            {session?.user?.name || session?.user?.email || 'User'}
        </span>
        {session?.user?.image && (
            <img
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full bg-gray-200"
            />
        )}
      </div>
    </header>
  );
}
