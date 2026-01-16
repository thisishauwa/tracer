
import React, { useState, useRef, useEffect } from 'react';

interface TraceOverlayProps {
  src: string;
  opacity: number;
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  isLocked: boolean;
  isFlipped: boolean;
}

const TraceOverlay: React.FC<TraceOverlayProps> = ({ 
  src, 
  opacity, 
  scale, 
  rotation, 
  position, 
  onPositionChange,
  isLocked,
  isFlipped
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLocked) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isLocked) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    onPositionChange({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`absolute z-10 select-none flex items-center justify-center transition-opacity duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        opacity: opacity,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: isLocked ? 'none' : 'auto'
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div 
        className="relative transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
        }}
      >
        <img 
          src={src} 
          alt="Trace target" 
          className="max-w-[80vw] max-h-[80vh] shadow-2xl pointer-events-none rounded-lg"
          draggable={false}
        />
        
        {/* Alignment Grid Overlay (only visible when not locked) */}
        {!isLocked && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 rounded-lg pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/30"></div>
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-blue-500/30"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraceOverlay;
