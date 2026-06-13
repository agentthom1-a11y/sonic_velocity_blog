'use client';

import React from 'react';

interface PermissionCardProps {
  title: string;
  description: string;
  buttonText: string;
  isActive: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  error?: string | null;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  title, description, buttonText, isActive, onToggle, icon, error
}) => {
  return (
    <div className={`p-4 border mb-3 transition-all duration-300 ${
      isActive
        ? 'border-emerald-500/40 bg-emerald-500/5'
        : 'border-neutral-900 bg-black/40'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-1.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`}>
          {icon}
        </div>
        <h3 className="text-[10px] font-mono tracking-widest uppercase text-white">{title}</h3>
        {isActive && (
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </div>
      <p className="text-[9px] text-neutral-600 font-mono mb-3 leading-relaxed">
        {description}
      </p>
      {error && (
        <p className="text-[9px] text-red-400 font-mono mb-3">
          ⚠ {error}
        </p>
      )}
      <button
        onClick={onToggle}
        className={`w-full py-2 px-3 text-[10px] font-mono uppercase tracking-widest transition-all duration-200 ${
          isActive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/20'
            : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:bg-neutral-800 hover:text-white'
        }`}
      >
        {isActive ? 'DEACTIVATE' : buttonText}
      </button>
    </div>
  );
};
