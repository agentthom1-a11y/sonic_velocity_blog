
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Activity, Play, Radio, Volume2, Database, Zap, Loader2 } from 'lucide-react';
import { useAppContext } from './AppContext';

const LOG_MESSAGES = [
  'FETCHING_METADATA_SIGNALS',
  'ESTABLISHING_NEURAL_LINK',
  'SYNCING_BPM_QUANTILES',
  'ANALYZING_DRUM_PATTERNS',
  'CALCULATING_VIRAL_PROBABILITY',
  'MAPPING_MICRO_COMMUNITIES',
  'INJECTING_STREET_TEXTURES',
  'HARDENING_OUTPUT_BUFFERS',
  'GENERATING_WAVEFORM_PRESETS',
  'STABILIZING_SYNTH_LAYERS',
  'READY_FOR_SYNTHESIS'
];

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const { isMinimalist } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing Core');
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % LOG_MESSAGES.length);
    }, 100);
    return () => clearInterval(logTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress < 25) setStatus('Mapping Trend Fragments');
    else if (progress < 50) setStatus('Calibrating Synthesis Engine');
    else if (progress < 75) setStatus('Buffering Viral Signals');
    else if (progress < 95) setStatus('Finalizing Transmission');
    else setStatus('Ready for Access');
  }, [progress]);

  if (isMinimalist) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-mono">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <div className="text-[10px] text-neutral-500 uppercase tracking-[0.5em] flex items-center gap-3">
             <span className="text-white font-black">{Math.floor(progress)}%</span>
             <span>{status}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans">
      {/* Background Parallax Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]"
        />
        
        {/* Street Culture Oversized Type Parallax */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.1, y: [20, -20] }}
           transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center select-none"
        >
          <div className="text-[25vw] font-black italic uppercase leading-none text-white/5 tracking-tighter mix-blend-overlay">
            STREET_DRIVE
          </div>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-10 bg-grid opacity-10 pointer-events-none"></div>
      
      {/* Immersive 2D Tape/Studio Elements */}
      <div className="relative z-20 flex flex-col items-center px-6">
        {/* Stylized "Cassette" Visual */}
        <div className="relative mb-16">
            {/* Spinning Reels */}
            <div className="flex gap-20 relative">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 md:w-40 md:h-40 border border-neutral-900 rounded-full flex items-center justify-center bg-neutral-950/20 backdrop-blur-sm"
               >
                  <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center">
                     <div className="w-2 h-2 bg-neutral-950 rounded-full"></div>
                  </div>
                  <div className="absolute inset-2 border-t-2 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-4 border-b-2 border-cyan-500/10 rounded-full"></div>
               </motion.div>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 md:w-40 md:h-40 border border-neutral-900 rounded-full flex items-center justify-center bg-neutral-950/20 backdrop-blur-sm"
               >
                  <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center">
                     <div className="w-2 h-2 bg-neutral-950 rounded-full"></div>
                  </div>
                  <div className="absolute inset-2 border-b-2 border-cyan-500/20 rounded-full"></div>
                  <div className="absolute inset-4 border-t-2 border-cyan-500/10 rounded-full"></div>
               </motion.div>

               {/* Waveform between reels */}
               <div className="absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-12 flex items-center gap-1.5 justify-center">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: [12, 32, 16, 44, 12],
                        opacity: [0.4, 1, 0.6, 1, 0.4]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                      className="w-2 bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] rounded-full"
                    />
                  ))}
               </div>
            </div>

            {/* Recording Indicator */}
            <motion.div 
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-neutral-950 border border-neutral-900 px-4 py-1.5 rounded-full"
            >
               <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_12px_rgba(220,38,38,1)]"></div>
               <span className="text-[10px] font-mono text-white/90 uppercase tracking-widest font-black">REC_MASTER</span>
            </motion.div>
        </div>

        {/* Brand Presence */}
        <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none mb-4"
            >
              Sonic Velocity
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center justify-center gap-6 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.5em]"
            >
               <span className="flex items-center gap-2 transition-colors hover:text-white"><Database className="w-3.5 h-3.5" /> Archive_01</span>
               <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
               <span className="flex items-center gap-2 transition-colors hover:text-white"><Zap className="w-3.5 h-3.5" /> Neural_Link</span>
            </motion.div>
        </div>

        {/* Progress System */}
        <div className="w-full max-w-sm md:max-w-md space-y-6">
            <div className="bg-neutral-950/80 backdrop-blur-md p-3 border border-neutral-900 overflow-hidden h-10 flex items-center">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={logIndex}
                   initial={{ x: 10, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -10, opacity: 0 }}
                   transition={{ duration: 0.3 }}
                   className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-3 w-full"
                 >
                    <span className="text-cyan-600 font-black">»</span> 
                    <span className="flex-1 line-clamp-1">{LOG_MESSAGES[logIndex]}</span>
                    <span className="text-[8px] text-neutral-700">OK</span>
                 </motion.div>
               </AnimatePresence>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                    Transmission_Flow
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-black flex items-center gap-2">
                       {status}
                    </span>
                    <span className="text-[8px] font-mono text-neutral-700 uppercase tracking-widest mt-1">Syncing_{Math.floor(progress)}%</span>
                  </div>
              </div>
              
              {/* Progress Bar with Glitch Effect */}
              <div className="h-1.5 bg-neutral-900/50 overflow-hidden relative rounded-full">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 0.5, ease: 'easeOut' }}
                   className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                 />
              </div>
            </div>

            {/* Bottom Status Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[Mic2, Volume2, Radio, Play].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center p-3 border border-neutral-900/50 bg-neutral-950/20 rounded-sm">
                   <Icon className={`w-4 h-4 mb-2 ${progress > (i+1) * 20 ? 'text-cyan-400 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-neutral-800'} transition-all duration-700`} />
                   <div className={`h-0.5 w-full ${progress > (i+1) * 20 ? 'bg-cyan-500' : 'bg-neutral-900'} transition-all duration-700`} />
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Decorative Corner Borders */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute inset-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-neutral-800/50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-neutral-800/50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-neutral-800/50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-neutral-800/50"></div>
      </motion.div>
    </div>
  );
};

export default Preloader;
