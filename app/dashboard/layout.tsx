import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
        <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-auto p-8">
            {children}
            </main>
        </div>
        </div>
    </SessionProvider>
  );
}
