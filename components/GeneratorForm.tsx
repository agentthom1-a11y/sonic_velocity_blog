'use client';

import React, { useState } from 'react';
import { ArrowRight, Disc, Sliders, Activity, Mic, Settings, Layers, Repeat, Lock, ChevronRight, Zap, CheckCircle2, FileText, Volume2, BarChart3, Cpu, Upload, Music, RotateCw, Check, X, Sparkles, Waves, Wrench, FolderOpen, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PRESETS, PresetType, MixingSettings, StemSettings, RemixSettings } from '../types';
import { Visualizer } from './Visualizer';
import { useAppContext } from './AppContext';

const GeneratorForm: React.FC<{ dict?: any }> = ({ dict }) => {
  const t = (key: string, fallback: string) => {
    if (!dict) return fallback;
    const parts = key.split('.');
    let cur = dict;
    for (const part of parts) {
      if (cur && cur[part] !== undefined) {
        cur = cur[part];
      } else {
        return fallback;
      }
    }
    return cur || fallback;
  };

  const { userTier, handleCreateJob } = useAppContext();

  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('koplo');
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('');
  
  const [lyricsText, setLyricsText] = useState('');
  const [voiceModel, setVoiceModel] = useState('Siti_Koplo_V4');

  const [mixingSettings, setMixingSettings] = useState<MixingSettings>({
    bass: 0,
    mid: 0,
    treble: 0,
    compression: true,
    stereoWidth: 80,
    reverb: 25,
    delay: 10,
    distortion: 0
  });

  const [stemSettings, setStemSettings] = useState<StemSettings>({
    model: 'demucs-4stems',
    artifacts: {
        vocals: true,
        drums: true,
        bass: true,
        other: true
    }
  });

  const [remixSettings, setRemixSettings] = useState<RemixSettings>({
    targetBpm: 140,
    mixStyle: 'seamless',
    autoKeyDetect: true,
    referenceTrack: undefined
  });
  
  const [remixFile, setRemixFile] = useState<string | null>(null);
  const [isAnalyzingRemix, setIsAnalyzingRemix] = useState(false);

  const [activeModules, setActiveModules] = useState<{[key: string]: boolean}>({
    lyrics: false,
    advanced: false,
    cover: false,
    remix: false
  });

  const toggleModule = (id: string) => {
    setActiveModules(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleRemixUpload = () => {
     if (remixFile) return;
     setIsAnalyzingRemix(true);
     setTimeout(() => {
         const mockFile = "DJ_OPUS_VIRAL_V2.mp3";
         setRemixFile(mockFile);
         setRemixSettings(prev => ({
             ...prev, 
             referenceTrack: mockFile,
             targetBpm: 145
         }));
         setIsAnalyzingRemix(false);
     }, 2000);
   };

  const clearRemixFile = (e: React.MouseEvent) => {
       e.stopPropagation();
       setRemixFile(null);
       setRemixSettings(prev => ({...prev, referenceTrack: undefined}));
   };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    
    setIsSubmitting(true);
    
    const lyricsPayload = activeModules.lyrics ? lyricsText : undefined;
    const voicePayload = activeModules.lyrics ? voiceModel : undefined;
    const mixingPayload = activeModules.advanced ? mixingSettings : undefined;
    const stemPayload = activeModules.cover ? stemSettings : undefined;
    const remixPayload = activeModules.remix ? remixSettings : undefined;

    try {
      await handleCreateJob(selectedPreset, topic, mood || 'Viral, Upbeat, Bass-heavy', lyricsPayload, voicePayload, mixingPayload, stemPayload, remixPayload);
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('[GeneratorForm] Job creation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };


  const isUnlocked = (moduleId: string) => {
    if (moduleId === 'remix') return false;
    if (userTier === 'free') return false;
    if (userTier === 'pro' || userTier === 'agency') return true;
    if (userTier === 'premium') {
        if (moduleId === 'lyrics' || moduleId === 'cover') return true;
        return false;
    }
    return false;
  };

  const renderPhantomUI = (id: string) => {
    switch(id) {
      case 'lyrics':
        return (
          <div className="flex items-end gap-0.5 h-6 w-full mt-3 opacity-30">
             {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1 bg-white rounded-t-[1px]" style={{height: `${20 + Math.random() * 80}%`}}></div>
             ))}
          </div>
        );
      case 'advanced':
         return (
          <div className="flex justify-between items-center h-8 w-full mt-2 px-1 opacity-30">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-white/50 relative">
                    <div className="absolute w-1.5 h-0.5 bg-white -left-[2px]" style={{top: `${20 + Math.random() * 60}%`}}></div>
                </div>
             ))}
          </div>
         );
      case 'cover':
         return (
          <div className="flex flex-col gap-1 w-full mt-3 opacity-30">
             <div className="h-1 w-full bg-white/50 rounded-sm"></div>
             <div className="h-1 w-[70%] bg-white/30 rounded-sm"></div>
             <div className="h-1 w-[50%] bg-white/40 rounded-sm"></div>
             <div className="h-1 w-[85%] bg-white/20 rounded-sm"></div>
          </div>
         );
      case 'remix':
         return (
          <div className="flex justify-start w-full mt-2 opacity-30 pl-1">
              <div className="w-8 h-8 rounded-full border border-white relative rotate-45">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white"></div>
              </div>
          </div>
         );
      default: return null;
    }
  }

  const onUpgrade = () => router.push('/pricing');

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* NEW: System Modules */}
        <div className="space-y-4 relative">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
             <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                {userTier === 'free' ? <Lock className="w-3 h-3 text-neutral-600" /> : <Settings className="w-3 h-3 text-green-500" />}
                00 // {t('common.advancedModules', 'Advanced Modules')} ({userTier === 'free' ? 'Pro' : userTier})
             </label>
             {userTier === 'free' ? (
                <span className="text-[9px] font-mono text-red-900 bg-red-950/30 border border-red-900/50 px-1.5 py-0.5 rounded-sm uppercase">{t('common.restricted', 'Restricted')}</span>
             ) : (
                <span className="text-[9px] font-mono text-green-500 bg-green-900/20 border border-green-900/50 px-1.5 py-0.5 rounded-sm uppercase">{t('common.unlocked', 'Unlocked')}</span>
             )}
          </div>
          
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${userTier === 'free' ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
             {[
                { id: 'lyrics', label: t('common.lyricsEngine', 'Lyrics Engine'), icon: Mic, subtitle: t('common.vocalSynthesis', 'Vocal Synthesis') },
                { id: 'advanced', label: t('common.proControls', 'Pro Controls'), icon: Settings, subtitle: t('common.mixingFxEngine', 'Mixing & FX Engine') },
                { id: 'cover', label: t('common.coverMode', 'Cover Mode'), icon: Layers, subtitle: t('common.stemSeparation', 'Stem Separation') },
                { id: 'remix', label: t('common.remixEngine', 'Remix Engine'), icon: Repeat, subtitle: t('common.autoBeatmatch', 'Auto-Beatmatch (Dev)') }
             ].map((feature) => {
                const unlocked = isUnlocked(feature.id);
                const active = activeModules[feature.id];
                const isOnDev = feature.id === 'remix';

                return (
                <div
                  key={feature.id}
                  onClick={() => unlocked && toggleModule(feature.id)}
                  className={`relative overflow-hidden border transition-all duration-300 ${
                     unlocked 
                       ? active 
                          ? 'bg-green-950/20 border-green-500/50 cursor-pointer shadow-[0_0_15px_rgba(0,255,0,0.1)]' 
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-600 cursor-pointer'
                       : 'bg-neutral-950 border-neutral-900 opacity-70 cursor-not-allowed'
                  }`}
                >
                  {!unlocked && (
                      <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_6px)]"></div>
                  )}
                  {unlocked && (
                      <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_5px_#0f0]' : 'bg-neutral-800'}`}></div>
                  )}
                  {!unlocked && userTier !== 'free' && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 text-center px-2">
                          {isOnDev ? <Wrench className="w-4 h-4 text-yellow-500 mb-1" /> : <Lock className="w-4 h-4 text-neutral-500 mb-1" />}
                          <span className={`text-[8px] font-mono uppercase ${isOnDev ? 'text-yellow-500' : 'text-neutral-500'}`}>
                            {isOnDev ? 'On Development' : 'Locked'}
                          </span>
                      </div>
                  )}
                  <div className="p-4 relative z-10 flex flex-col h-32 justify-between">
                      <div className="flex justify-between items-start">
                          <feature.icon className={`w-4 h-4 ${active ? 'text-green-400' : 'text-neutral-400'}`} />
                      </div>
                      <div className="flex-1 flex items-center">
                        {renderPhantomUI(feature.id)}
                      </div>
                      <div>
                          <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-green-400' : 'text-neutral-400'}`}>{feature.label}</div>
                          <div className="text-[8px] font-mono uppercase text-neutral-600 mt-1">{feature.subtitle}</div>
                      </div>
                  </div>
                </div>
              )})}
          </div>

          {/* Module-specific UI (simplified for brevity, identical logic to original) */}
          {/* Lyrics UI */}
          {isUnlocked('lyrics') && activeModules.lyrics && (
            <div className="w-full border border-green-900/30 bg-green-950/5 p-6 mt-4 animate-[slideDown_0.3s_ease-out]">
               <div className="flex items-center justify-between mb-6 border-b border-green-900/20 pb-4">
                  <div className="flex items-center gap-3">
                     <Mic className="w-4 h-4 text-green-500" />
                     <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">Vocal Processing Unit</h3>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-mono text-green-600/70 uppercase mb-2">Voice Model</label>
                        <select 
                           value={voiceModel} 
                           onChange={(e) => setVoiceModel(e.target.value)}
                           className="w-full bg-black border border-green-900/30 text-green-400 text-xs font-mono px-3 py-2 focus:outline-none focus:border-green-500 uppercase"
                        >
                           <option value="Siti_Koplo_V4">Siti (Koplo Soprano)</option>
                           <option value="Bambang_Bass">Bambang (MC Bass)</option>
                           <option value="Cyber_Diva_ID">Cyber Diva (Electronic)</option>
                        </select>
                     </div>
                  </div>
                  <div className="md:col-span-2">
                     <textarea 
                        value={lyricsText}
                        onChange={(e) => setLyricsText(e.target.value)}
                        placeholder="Enter your lyrics here..."
                        className="w-full h-40 bg-black border border-green-900/30 text-green-400 font-mono text-xs p-3 focus:outline-none focus:border-green-500 resize-none placeholder-green-900"
                     />
                  </div>
               </div>
            </div>
          )}

          {/* Overlays for Locked state */}
          {userTier === 'free' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
                 <div className="relative bg-black/80 backdrop-blur-sm border border-neutral-800 p-6 md:p-8 shadow-2xl max-w-sm mx-auto">
                    <Lock className="w-6 h-6 text-white mb-4 mx-auto" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">{t('common.studioLocked', 'Studio Locked')}</h3>
                    <button 
                       type="button"
                       onClick={onUpgrade}
                       className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors"
                    >
                       {t('common.unlockProStudio', 'Unlock Pro Studio')}
                    </button>
                 </div>
              </div>
          )}
        </div>

        {/* Preset Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">01 // {t('common.selectGenrePreset', 'Select Genre Preset')}</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border border-neutral-800 bg-neutral-900/50">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPreset(p.id)}
                className={`relative group flex flex-col items-start justify-between p-6 h-32 border border-neutral-800/50 transition-all duration-200 ${
                  selectedPreset === p.id ? 'bg-white text-black' : 'bg-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <span className="text-lg font-bold leading-none mb-1">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">02 // {t('common.inputPrompt', 'Input Prompt')}</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe the song topic..."
                className="w-full bg-neutral-900/50 border border-neutral-800 py-4 px-4 text-white focus:outline-none focus:border-white transition-all"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="font-mono text-xs text-neutral-500 uppercase tracking-widest">03 // {t('common.atmosphere', 'Atmosphere')}</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="E.g. Energetic, Dark..."
                className="w-full bg-neutral-900/50 border border-neutral-800 py-4 px-4 text-white focus:outline-none focus:border-white transition-all"
              />
            </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !topic}
          className="w-full py-5 bg-white text-black font-bold text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-4 transition-all hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-600"
        >
          {isSubmitting ? t('common.processingSequence', 'Processing Sequence...') : t('common.initiateSynthesis', 'Initiate Synthesis')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default GeneratorForm;
