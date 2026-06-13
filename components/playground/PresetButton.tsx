'use client';

import React from 'react';
import { PresetName, PRESETS } from '../../utils/presets';

interface PresetButtonProps {
  name: PresetName;
  isActive: boolean;
  onClick: (name: PresetName) => void;
}

export const PresetButton: React.FC<PresetButtonProps> = ({ name, isActive, onClick }) => {
  const preset = PRESETS[name];
  const displayName = name.replace(/_/g, ' ');

  return (
    <button
      onClick={() => onClick(name)}
      className={`relative w-full px-3 py-2.5 text-left border transition-all duration-200 group overflow-hidden ${
        isActive
          ? 'border-neutral-600 bg-white/5'
          : 'border-neutral-900 hover:border-neutral-700 bg-transparent'
      }`}
      aria-label={`Select preset: ${displayName}`}
      aria-pressed={isActive}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: preset.colorPrimary }}
        />
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
        style={{ backgroundColor: preset.colorPrimary }}
      />

      <div className="flex justify-between items-center relative z-10">
        <span className={`text-[10px] font-mono tracking-widest uppercase ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'} transition-colors`}>
          {displayName}
        </span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: preset.colorPrimary }} />
          {preset.colorSecondary !== '#000000' && (
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: preset.colorSecondary }} />
          )}
        </div>
      </div>
    </button>
  );
};
