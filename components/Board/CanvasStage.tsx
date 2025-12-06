'use client';

import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { PAPER_SIZES, DEFAULT_PAPER_SIZE } from '@/lib/constants';

export default function CanvasStage() {
  const paperSize = PAPER_SIZES[DEFAULT_PAPER_SIZE];

  // Viewport State (Zoom & Pan)
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Initial centering logic could go here or be a useEffect
  // For now, let's start centered-ish if window is known, but window isn't known on first render in standard React easily without useEffect.
  // We'll rely on CSS centering for the container or just start at 0,0 and let user pan.
  // Better: Start with some padding.

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Limit zoom
    if (newScale < 0.1 || newScale > 5) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPos);
  };

  return (
    <div className="w-screen h-screen bg-neutral-900 overflow-hidden">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
            {/* The "Paper" Workspace */}
            {/* We add a shadow/border to visualize it against the dark background */}
            <Rect
                x={(window.innerWidth - paperSize.width) / 2} // Naive centering, actually works better if we don't rely on window for X, but just place it at 0,0 relative to stage and let user pan.
                // Let's place it at 100, 100 to give some breathing room
                y={100}
                width={paperSize.width}
                height={paperSize.height}
                fill="white"
                shadowColor="black"
                shadowBlur={20}
                shadowOpacity={0.3}
                shadowOffset={{ x: 0, y: 10 }}
            />
        </Layer>
      </Stage>

      {/* Overlay UI (Toolbar, etc) will go here */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-black text-sm">
        Format: {DEFAULT_PAPER_SIZE} ({paperSize.width}x{paperSize.height})
      </div>
    </div>
  );
}
