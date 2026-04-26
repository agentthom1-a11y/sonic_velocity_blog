'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, Zap, Layers, Music, ArrowRight, Activity, Mic, BarChart3, Settings, Sliders } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Showcase: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onStart = () => router.push('/studio');

  return (
    <div className="w-full bg-black text-white overflow-x-hidden perspective-[1000px]">
      
      {/* SECTION 1: 3D HERO INTERFACE */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
         {/* Ambient Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
         
         <div className="text-center mb-16 relative z-10 px-4">
            <div className="inline-block border border-neutral-800 bg-black/50 backdrop-blur-md px-4 py-1 rounded-full mb-6">
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">System Architecture v2.0</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-tight">
               The Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">Workstation</span>
            </h1>
            <p className="max-w-2xl mx-auto text-neutral-500 font-mono text-[10px] sm:text-xs md:text-sm uppercase tracking-widest leading-relaxed">
               Experience the synthesis of art and algorithm. <br className="hidden sm:block"/>
               A fully decomposed view of the Velocity Engine.
            </p>
         </div>

         {/* 3D EXPLODED UI CONTAINER */}
         <div 
           className="relative w-full max-w-5xl h-[500px] md:h-[600px] perspective-[2000px] group"
         >
            <div 
               className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out preserve-3d"
               style={{ 
                  transform: `rotateX(20deg) rotateY(${scrollY * 0.02}deg)`,
                  transformStyle: 'preserve-3d'
               }}
            >
               {/* LAYER 1: GRID BASE */}
               <div className="absolute inset-0 bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm rounded-xl transform translate-z-[-100px] shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_100%)] bg-[length:20px_20px]"></div>
               </div>

               {/* LAYER 2: MAIN DASHBOARD */}
               <div className="absolute inset-10 bg-black border border-neutral-700 rounded-lg shadow-2xl transform translate-z-[0px] flex flex-col overflow-hidden">
                  {/* Fake Toolbar */}
                  <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                     </div>
                     <div className="h-1 w-32 bg-neutral-800 rounded-full"></div>
                  </div>
                  {/* Content Area */}
                  <div className="flex-1 grid grid-cols-12 divide-x divide-neutral-800">
                     <div className="col-span-3 p-4 space-y-4 bg-neutral-950">
                        {[...Array(6)].map((_, i) => (
                           <div key={i} className="h-8 bg-neutral-900/50 border border-neutral-800 rounded-sm flex items-center px-2">
                              <div className="w-2 h-2 bg-neutral-700 rounded-full"></div>
                           </div>
                        ))}
                     </div>
                     <div className="col-span-9 p-6 relative">
                        <div className="flex items-center justify-center h-full gap-1">
                           {[...Array(40)].map((_, i) => (
                              <div 
                                 key={i} 
                                 className="w-2 bg-neutral-800 rounded-full animate-pulse" 
                                 style={{ 
                                    height: `${20 + Math.random() * 80}%`,
                                    animationDelay: `${i * 0.05}s`
                                 }} 
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* LAYER 3: FLOATING PANELS */}
               <div 
                  className="absolute top-10 right-0 md:-right-10 w-48 md:w-64 h-32 md:h-40 bg-black/80 backdrop-blur-xl border border-neutral-600 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform translate-z-[80px] p-4 hidden sm:block"
                  style={{ transform: `translateZ(80px) translateY(${-scrollY * 0.1}px)` }}
               >
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-mono text-white uppercase">EQ Parametric</span>
                     <Activity className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-end justify-between h-20 gap-1">
                     <div className="w-2 bg-neutral-700 h-[40%]"></div>
                     <div className="w-2 bg-white h-[80%] shadow-[0_0_10px_white]"></div>
                     <div className="w-2 bg-neutral-700 h-[60%]"></div>
                     <div className="w-2 bg-neutral-700 h-[30%]"></div>
                     <div className="w-2 bg-neutral-700 h-[50%]"></div>
                  </div>
               </div>

               <div 
                  className="absolute bottom-10 left-0 md:-left-10 w-48 md:w-56 h-24 md:h-32 bg-black/80 backdrop-blur-xl border border-neutral-600 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform translate-z-[120px] p-4 hidden sm:block"
                  style={{ transform: `translateZ(120px) translateY(${scrollY * 0.05}px)` }}
               >
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] font-mono text-white uppercase">Vocal Synth</span>
                     <Mic className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="space-y-2 mt-4">
                     <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-blue-500"></div>
                     </div>
                     <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-blue-500"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="py-32 bg-neutral-950 relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { icon: Cpu, title: "Neural Core", desc: "Zero-latency inference engine utilizing transformer architecture for coherent musical structure." },
                  { icon: Zap, title: "Instant Render", desc: "Distributed GPU clusters allow for sub-minute track generation at 320kbps quality." },
                  { icon: Layers, title: "Smart Stems", desc: "Automatically separates drums, bass, and melody for granular post-production control." }
               ].map((feature, i) => (
                  <div key={i} className="group cursor-default">
                     <div className="w-12 h-12 border border-neutral-800 bg-black flex items-center justify-center mb-6 group-hover:border-white transition-colors duration-500">
                        <feature.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" strokeWidth={1} />
                     </div>
                     <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4 group-hover:translate-x-2 transition-transform duration-300">
                        {feature.title}
                     </h3>
                     <p className="text-sm font-mono text-neutral-500 leading-relaxed max-w-xs border-l border-neutral-900 pl-4 group-hover:border-neutral-700 transition-colors">
                        {feature.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 3: INTERACTIVE MODULES */}
      <section className="py-40 relative overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-24">
               <h2 className="text-3xl font-bold text-white uppercase tracking-wide relative pl-20">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-[1px] bg-white"></span>
                  Production Suite
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="h-80 border border-neutral-800 bg-black p-8 relative group overflow-hidden hover:border-neutral-600 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                     <BarChart3 className="w-8 h-8 text-neutral-700" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-end">
                     <h3 className="text-2xl font-bold text-white uppercase mb-2">Analyzer</h3>
                     <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">Real-time Spectrum Visualization</p>
                     <div className="flex items-end gap-1 h-16 opacity-50 group-hover:opacity-100 transition-opacity">
                        {[...Array(20)].map((_,i) => (
                           <div key={i} className="flex-1 bg-white transition-all duration-300 group-hover:bg-green-500" style={{ height: `${Math.random() * 100}%` }}></div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="h-80 border border-neutral-800 bg-black p-8 relative group overflow-hidden hover:border-neutral-600 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                     <Settings className="w-8 h-8 text-neutral-700" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-end">
                     <h3 className="text-2xl font-bold text-white uppercase mb-2">Modulator</h3>
                     <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">LFO & Envelope Shaping</p>
                     <div className="relative w-full h-16 border-b border-neutral-800 overflow-hidden">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                           <path d="M0,64 Q30,0 60,64 T120,64 T180,64 T240,64" fill="none" stroke="white" strokeWidth="2" className="path-anim" />
                        </svg>
                     </div>
                  </div>
               </div>

               <div className="h-80 border border-neutral-800 bg-black p-8 relative group overflow-hidden hover:border-neutral-600 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4 opacity-50">
                     <Sliders className="w-8 h-8 text-neutral-700" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-end">
                     <h3 className="text-2xl font-bold text-white uppercase mb-2">Control Matrix</h3>
                     <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">Deep Parameter Sequencing</p>
                     <div className="flex justify-between items-center h-24 px-2 gap-3">
                        {[0, 1, 2, 3].map((i) => (
                           <div key={i} className="w-2 bg-neutral-900 h-full rounded-full relative border border-neutral-800 flex justify-center">
                              <div className="absolute w-6 h-3 bg-neutral-500 border border-neutral-400 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:bg-white transition-colors duration-300 z-10" style={{ bottom: `${20 + (i * 15)}%` }}></div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="h-[60vh] flex items-center justify-center relative border-t border-neutral-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          <div className="text-center relative z-10">
             <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-[0.5em] mb-8">System Ready</h2>
             <button onClick={onStart} className="group relative inline-flex items-center justify-center px-12 py-6 bg-black border border-white text-white uppercase tracking-[0.25em] text-lg hover:bg-white hover:text-black transition-all">
                Enter Studio <ArrowRight className="w-5 h-5" />
             </button>
          </div>
      </section>

    </div>
  );
};

export default Showcase;
