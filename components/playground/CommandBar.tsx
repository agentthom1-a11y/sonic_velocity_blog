'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TICKER_MESSAGES = [
  'NEURAL_AUDIO_STREAM_ACTIVE',
  'CORE_SYNC_READY',
  'FETCHING_METADATA_SIGNALS',
  'CALIBRATING_WAVEFORMS',
  'TRANSMISSION_FLOW_ONLINE',
  'SIGNAL_BUS_INITIALIZED',
];

interface CommandBarProps {
  inputMode: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({ inputMode }) => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-6 h-14 border-b border-neutral-900 bg-black/90 backdrop-blur-sm z-50 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href="/en/transmissions"
          className="text-neutral-600 hover:text-white transition-colors p-1"
          aria-label="Back to Transmissions"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-black tracking-tight uppercase text-white leading-none">
            SONICVELOCITY<span className="text-neutral-600">_</span>PLAYGROUND
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${inputMode !== 'IDLE' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-700'}`} />
            <span className="text-[8px] font-mono tracking-widest uppercase text-neutral-500">
              {inputMode === 'IDLE' ? 'SYNTHETIC SIGNAL' : 'SIGNAL ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Center ticker */}
      <div className="hidden md:flex items-center h-7 overflow-hidden relative flex-1 max-w-xs mx-8 border-l border-r border-neutral-900 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tickerIndex}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute text-[8px] font-mono tracking-widest text-neutral-600 uppercase whitespace-nowrap"
          >
            {TICKER_MESSAGES[tickerIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-all text-[9px] font-mono uppercase tracking-widest"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
          <span className="hidden sm:inline">{isFullscreen ? 'EXIT' : 'FULLSCREEN'}</span>
        </button>
      </div>
    </div>
  );
};
