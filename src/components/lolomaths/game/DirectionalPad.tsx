// components/game/DirectionalPad.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

interface DirectionalPadProps {
  onDirectionClick?: (direction: Direction) => void;
  initialPosition?: { x: number; y: number };
  className?: string;
}

export const DirectionalPad: React.FC<DirectionalPadProps> = ({
  onDirectionClick,
  initialPosition = { x: 20, y: 20 },
  className = '',
}) => {
  // Gestion de la position flottante
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: initialPosition.x,
    posY: initialPosition.y,
  });

  // Gestion universelle du Pointer Event (Souris + Tactile)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Empêcher le drag si l'utilisateur clique directement sur un bouton de direction
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    setPosition({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleButtonClick = (dir: Direction, e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectionClick?.(dir);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
      className={`fixed z-50 select-none cursor-grab active:cursor-grabbing bg-slate-900/80 backdrop-blur-md p-3 rounded-full shadow-2xl border border-slate-700/50 flex flex-col items-center justify-center gap-1 w-36 h-36 ${className}`}
    >
      {/* Haut */}
      <button
        onClick={(e) => handleButtonClick('up', e)}
        aria-label="Haut"
        className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 active:scale-95 transition-all text-white rounded-t-lg flex items-center justify-center font-bold border border-slate-600"
      >
        ▲
      </button>

      <div className="flex items-center justify-between w-full px-1 gap-2">
        {/* Gauche */}
        <button
          onClick={(e) => handleButtonClick('left', e)}
          aria-label="Gauche"
          className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 active:scale-95 transition-all text-white rounded-l-lg flex items-center justify-center font-bold border border-slate-600"
        >
          ◄
        </button>

        {/* Centre / Indicateur de Drag */}
        <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-500/50 flex items-center justify-center text-[10px] text-slate-400">
          ::
        </div>

        {/* Droite */}
        <button
          onClick={(e) => handleButtonClick('right', e)}
          aria-label="Droite"
          className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 active:scale-95 transition-all text-white rounded-r-lg flex items-center justify-center font-bold border border-slate-600"
        >
          ►
        </button>
      </div>

      {/* Bas */}
      <button
        onClick={(e) => handleButtonClick('down', e)}
        aria-label="Bas"
        className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 active:scale-95 transition-all text-white rounded-b-lg flex items-center justify-center font-bold border border-slate-600"
      >
        ▼
      </button>
    </div>
  );
};