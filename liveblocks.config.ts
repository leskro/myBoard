import { LiveList } from "@liveblocks/client";
import { CanvasItem } from "@/lib/types";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      // cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      items: LiveList<CanvasItem>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
      };
    };

    // Custom events, for useBroadcastEvent, etc.
    RoomEvent: {};
      // Example, sending a specific event to other users
      // | { type: "PLAY" }
      // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with REST API, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and a url
      // title: string;
      // url: string;
    };
  }
}

export {};
