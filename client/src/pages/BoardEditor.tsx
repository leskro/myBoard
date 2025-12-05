import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { io, Socket } from 'socket.io-client';
import api from '../api';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

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
  const [activeTool, setActiveTool] = useState<string>('select'); // select, rect, circle
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

  const handleAddRect = () => {
      setActiveTool('rect');
      const element = {
          type: 'RECT',
          x: Math.random() * (window.innerWidth - 200) + 100, // keep somewhat visible
          y: Math.random() * (window.innerHeight - 200) + 100,
          width: 150,
          height: 100,
          fill: '#fca5a5' // Tailwind red-300
      };
      addElement(element);
  };

  const handleAddCircle = () => {
      setActiveTool('circle');
      const element = {
          type: 'CIRCLE',
          x: Math.random() * (window.innerWidth - 200) + 100,
          y: Math.random() * (window.innerHeight - 200) + 100,
          width: 120,
          height: 120,
          fill: '#93c5fd' // Tailwind blue-300
      };
      addElement(element);
  };

  const addElement = (element: any) => {
      const tempId = Math.random().toString();
      const tempElement = { ...element, id: tempId };
      setElements(prev => [...prev, tempElement]);
      socketRef.current?.emit('add-element', { boardId, element });
  };

  const handleStageClick = () => {
    // Future: Use this for "Click to place" logic depending on activeTool
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden relative">
       {/* Header */}
       <div className="absolute top-4 left-4 z-20">
            <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all text-gray-700 font-medium"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
       </div>

       {/* Canvas Area */}
       <div className="flex-1 cursor-grab active:cursor-grabbing bg-gray-50 relative">
         {/* Grid Pattern Background */}
         <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                  backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
              }}>
         </div>

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
                                cornerRadius={8}
                                draggable
                                shadowBlur={10}
                                shadowColor="rgba(0,0,0,0.15)"
                                shadowOffset={{x: 2, y: 5}}
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
                                shadowBlur={10}
                                shadowColor="rgba(0,0,0,0.15)"
                                shadowOffset={{x: 2, y: 5}}
                            />
                        );
                    }
                    return null;
                })}
            </Layer>
         </Stage>
       </div>

       {/* Floating Toolbar */}
       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
           <div className="flex items-center gap-2 px-2 py-2 bg-white rounded-full shadow-xl border border-gray-200">
               <button
                    onClick={() => setActiveTool('select')}
                    className={`p-3 rounded-full transition-all ${activeTool === 'select' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Select Tool"
               >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                   </svg>
               </button>
               <div className="w-px h-8 bg-gray-200 mx-1"></div>
               <button
                    onClick={handleAddRect}
                    className={`p-3 rounded-full transition-all ${activeTool === 'rect' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Rectangle"
               >
                   <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
               </button>
               <button
                    onClick={handleAddCircle}
                    className={`p-3 rounded-full transition-all ${activeTool === 'circle' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-600'}`}
                    title="Circle"
               >
                   <div className="w-6 h-6 border-2 border-current rounded-full"></div>
               </button>
           </div>
       </div>
    </div>
  );
};

export default BoardEditor;
