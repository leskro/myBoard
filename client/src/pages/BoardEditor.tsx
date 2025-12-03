import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import { io, Socket } from 'socket.io-client';
import api from '../api';

const SOCKET_URL = 'http://localhost:3000';

interface BoardElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  content?: string;
}

const BoardEditor: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const [elements, setElements] = useState<BoardElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Fetch initial board state
    const fetchBoard = async () => {
      try {
        const res = await api.get(`/boards/${boardId}`);
        setElements(res.data.elements);
      } catch (err) {
        console.error('Failed to load board');
      }
    };
    fetchBoard();

    // Connect to Socket.io
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join-board', boardId);

    socketRef.current.on('element-added', (newElement: BoardElement) => {
      setElements((prev) => [...prev, newElement]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [boardId]);

  const addShape = (type: string) => {
    if (!boardId) return;

    const newElement = {
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 100,
      height: 100,
      fill: type === 'RECT' ? 'red' : 'blue',
    };

    // Optimistic update
    // We don't have the ID yet, but we will get it from the server or refresh
    // For smoother UX, in a real app we'd use a temp ID

    // Send to server
    socketRef.current?.emit('add-element', { boardId, element: newElement });
  };

  // Since we rely on the server to broadcast back (even to self? or just to others?)
  // The server implementation: socket.to(boardId).emit(...) usually broadcasts to OTHERS.
  // So the sender needs to add it locally themselves.
  // Let's modify the addShape to add locally as well, but we need the ID.
  // For this MVP, we will rely on a simplified flow:
  // 1. Client emits 'add-element'
  // 2. Client adds to local state optimistically (with temp ID) OR waits for ack?
  // Let's modify the SERVER to emit to EVERYONE including sender for simplicity in this MVP?
  // Or better: The server `io.to(boardId).emit` sends to everyone in room including sender?
  // `socket.to(boardId)` sends to everyone EXCEPT sender.
  // `io.in(boardId)` sends to everyone INCLUDING sender.

  // Checking server code...
  // server/src/index.ts uses: socket.to(boardId).emit('element-added', savedElement);
  // This means the sender DOES NOT get the event.
  // So the sender must add it locally.

  // Let's wrap the emit in a function that also updates local state.

  const handleStageClick = (e: any) => {
    // If we were doing "click to add", we'd use this.
    // For now, let's just use buttons to add shapes at random positions for the MVP.
  };

  const handleAddRect = () => {
      const element = {
          type: 'RECT',
          x: Math.random() * 500,
          y: Math.random() * 500,
          width: 100,
          height: 100,
          fill: '#ef4444' // Tailwind red-500
      };

      // We need to persist this.
      // Ideally we call the API to create it, then broadcast.
      // BUT, we set up the socket to handle creation in the backend for us.
      // So we emit, and we also need to add it locally.
      // We won't have the real ID immediately unless we wait for a callback.
      // For MVP, we'll just add it with a temp ID or re-fetch?
      // Re-fetching is slow.
      // Let's just add it locally with a temp ID.

      const tempId = Math.random().toString();
      const tempElement = { ...element, id: tempId };
      setElements(prev => [...prev, tempElement]);

      socketRef.current?.emit('add-element', { boardId, element });
  };

  const handleAddCircle = () => {
      const element = {
          type: 'CIRCLE',
          x: Math.random() * 500,
          y: Math.random() * 500,
          width: 100, // For circle, we'll use width as radius * 2 roughly or just diameter
          height: 100,
          fill: '#3b82f6' // Tailwind blue-500
      };

      const tempId = Math.random().toString();
      const tempElement = { ...element, id: tempId };
      setElements(prev => [...prev, tempElement]);

      socketRef.current?.emit('add-element', { boardId, element });
  };

  return (
    <div className="flex flex-col h-screen">
       <div className="bg-white border-b px-6 py-3 flex items-center justify-between z-10 shadow-sm">
          <h2 className="font-bold text-gray-800">Board Editor</h2>
          <div className="flex gap-2">
            <button
                onClick={handleAddRect}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 flex items-center gap-2"
            >
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                Rectangle
            </button>
             <button
                onClick={handleAddCircle}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 flex items-center gap-2"
            >
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                Circle
            </button>
          </div>
       </div>

       <div className="flex-1 bg-gray-50 overflow-hidden">
         <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
            <Layer>
                {elements.map((el, i) => {
                    if (el.type === 'RECT') {
                        return (
                            <Rect
                                key={el.id || i}
                                x={el.x}
                                y={el.y}
                                width={el.width}
                                height={el.height}
                                fill={el.fill}
                                draggable
                                shadowBlur={5}
                            />
                        );
                    } else if (el.type === 'CIRCLE') {
                        return (
                             <Circle
                                key={el.id || i}
                                x={el.x}
                                y={el.y}
                                radius={(el.width || 100) / 2}
                                fill={el.fill}
                                draggable
                                shadowBlur={5}
                            />
                        );
                    }
                    return null;
                })}
            </Layer>
         </Stage>
       </div>
    </div>
  );
};

export default BoardEditor;
