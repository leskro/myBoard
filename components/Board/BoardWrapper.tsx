'use client';

import dynamic from 'next/dynamic';
import { RoomProvider } from '@liveblocks/react/suspense';
import { ClientSideSuspense } from '@liveblocks/react';

// Load the CanvasStage dynamically to avoid SSR issues with Konva
const CanvasStage = dynamic(() => import('./CanvasStage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">Loading Studio...</div>
});

interface BoardWrapperProps {
  roomId: string;
}

export default function BoardWrapper({ roomId }: BoardWrapperProps) {
  return (
    <RoomProvider id={roomId} initialPresence={{}} initialStorage={{}}>
      <ClientSideSuspense fallback={<div className="flex items-center justify-center h-screen bg-neutral-900 text-white">Connecting to Room...</div>}>
        <CanvasStage />
      </ClientSideSuspense>
    </RoomProvider>
  );
}
