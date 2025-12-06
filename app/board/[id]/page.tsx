'use client';

import React from 'react';
import BoardWrapper from '@/components/Board/BoardWrapper';
import { LiveblocksProvider } from "@liveblocks/react";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const API_KEY = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  if (!API_KEY) {
     return (
        <div className="h-screen flex flex-col items-center justify-center bg-neutral-900 text-white gap-4">
             <h1 className="text-2xl font-bold">Configuration Missing</h1>
             <p>Please add <code className="bg-neutral-800 p-1 rounded">NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY</code> to your .env.local file.</p>
             <p className="text-sm text-neutral-400">You can get one at <a href="https://liveblocks.io" className="underline hover:text-blue-400">liveblocks.io</a></p>
        </div>
     );
  }

  return (
    <LiveblocksProvider publicApiKey={API_KEY}>
       <BoardWrapper roomId={id} />
    </LiveblocksProvider>
  );
}
