'use client';

import React, { useEffect, useState, useRef } from 'react';
import { InputMode } from '../../hooks/usePlaygroundState';
import { PresetName } from '../../utils/presets';

interface SignalStripProps {
  logs: string[];
  inputMode: InputMode;
  currentPresetName: PresetName;
}

export const SignalStrip: React.FC<SignalStripProps> = ({ logs, inputMode, currentPresetName }) => {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let id: number;
    const tick = (now: number) => {
      frameCountRef.current++;
      if (now - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const lastLog = logs[logs.length - 1] || '';

  return (
    <div className="w-full h-10 bg-black border-t border-neutral-900 flex items-center justify-between px-4 sm:px-6 z-50 shrink-0 overflow-hidden">
      {/* Left status */}
      <div className="flex items-center gap-4 sm:gap-6 text-[8px] font-mono uppercase tracking-widest text-neutral-600 shrink-0">
        <div className="flex items-center gap-1.5">
          <span>FPS</span>
          <span className={`tabular-nums ${fps >= 50 ? 'text-emerald-500' : fps >= 30 ? 'text-amber-500' : 'text-red-400'}`}>
            {fps}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-l border-neutral-900 pl-4">
          <span>IN</span>
          <span className={inputMode !== 'IDLE' ? 'text-emerald-400' : 'text-neutral-500'}>{inputMode}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 border-l border-neutral-900 pl-4">
          <span>PRESET</span>
          <span className="text-neutral-400">{currentPresetName}</span>
        </div>
      </div>

      {/* Right terminal log */}
      <div className="text-[8px] font-mono tracking-widest text-neutral-600 truncate max-w-xs text-right">
        {lastLog}
      </div>
    </div>
  );
};
