'use client';

import React, { useId } from 'react';

interface SignalSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color: string;
}

export const SignalSlider: React.FC<SignalSliderProps> = ({
  label, value, onChange, min = 0, max = 1, step = 0.01, color
}) => {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex justify-between items-center text-[9px] font-mono tracking-widest uppercase">
        <label htmlFor={id} className="text-neutral-500 cursor-pointer">{label}</label>
        <span style={{ color }} className="tabular-nums">{value.toFixed(2)}</span>
      </div>
      <div className="relative h-2 group">
        <div className="absolute inset-0 bg-neutral-900 rounded-sm" />
        <div
          className="absolute left-0 top-0 bottom-0 rounded-sm transition-all duration-75"
          style={{ width: `${percent}%`, backgroundColor: color, opacity: 0.7 }}
        />
        {/* Glow on the fill end */}
        <div
          className="absolute top-0 bottom-0 w-2 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: `calc(${percent}% - 4px)`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
};
