import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-6 border-b">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                m
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">myBoard</span>
        </div>
        <div className="flex gap-4">
            <Link href="/api/auth/signin">
                <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/api/auth/signin">
                <Button>Get Started</Button>
            </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Visual Management <br/>
          <span className="text-red-600">Reimagined.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          The enterprise-grade digital whiteboard that respects your physical processes.
          ISO formats, real-time collaboration, and strict data governance.
        </p>
        <div className="flex gap-4">
            <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 h-14">
                    Start Collaborating
                </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                View Demo
            </Button>
        </div>

        <div className="mt-20 w-full max-w-5xl aspect-video bg-gray-100 rounded-xl shadow-2xl border border-gray-200 flex items-center justify-center">
            <p className="text-gray-400">Board Screenshot Placeholder</p>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        &copy; 2025 myBoard Inc. All rights reserved.
      </footer>
    </div>
  );
}
