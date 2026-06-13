'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, Mic, MicOff, Play, Pause, Zap, Radio,
  Palette, Music, Waves, BarChart3, Circle, RefreshCw,
  ChevronRight, Volume2, Layers, Sparkles
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
type VisualizerMode = 'bars' | 'wave' | 'radial' | 'particles' | 'nebula';
type ColorScheme = 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'aurora';

const COLOR_SCHEMES: Record<ColorScheme, { primary: string; secondary: string; glow: string; stops: string[] }> = {
  cyan:    { primary: '#06b6d4', secondary: '#0891b2', glow: 'rgba(6,182,212,0.6)',    stops: ['#06b6d4','#0891b2','#0e7490'] },
  violet:  { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139,92,246,0.6)',  stops: ['#a78bfa','#8b5cf6','#7c3aed'] },
  amber:   { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245,158,11,0.6)',  stops: ['#fcd34d','#f59e0b','#d97706'] },
  emerald: { primary: '#10b981', secondary: '#059669', glow: 'rgba(16,185,129,0.6)',  stops: ['#34d399','#10b981','#059669'] },
  rose:    { primary: '#f43f5e', secondary: '#e11d48', glow: 'rgba(244,63,94,0.6)',   stops: ['#fb7185','#f43f5e','#e11d48'] },
  aurora:  { primary: '#06b6d4', secondary: '#8b5cf6', glow: 'rgba(139,92,246,0.5)', stops: ['#06b6d4','#8b5cf6','#f43f5e'] },
};

const MODES: { id: VisualizerMode; label: string; icon: React.ReactNode }[] = [
  { id: 'bars',      label: 'BARS',      icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'wave',      label: 'WAVE',      icon: <Waves className="w-4 h-4" /> },
  { id: 'radial',    label: 'RADIAL',    icon: <Circle className="w-4 h-4" /> },
  { id: 'particles', label: 'PARTICLES', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'nebula',    label: 'NEBULA',    icon: <Layers className="w-4 h-4" /> },
];

// ─── Particle System ────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PlaygroundClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const [mode, setMode] = useState<VisualizerMode>('bars');
  const [scheme, setScheme] = useState<ColorScheme>('cyan');
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState('');
  const [sensitivity, setSensitivity] = useState(1.4);
  const [bpmTaps, setBpmTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inspireText, setInspireText] = useState('');
  const [showInspire, setShowInspire] = useState(false);

  const INSPIRATIONS = [
    'What if 808s could feel like sunrise?',
    'Every frequency is a story waiting to be told.',
    'The silence between notes is where emotion lives.',
    'Distortion is just controlled chaos.',
    'Rhythm is the architecture of time.',
    'Bass is the heartbeat of the crowd.',
    'What genre would this waveform be?',
    'Sound is invisible sculpture.',
    'Every melody is a neural pattern.',
    'The mix is the message.',
  ];

  const getInspiration = () => {
    setInspireText(INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)]);
    setShowInspire(true);
    setTimeout(() => setShowInspire(false), 4000);
  };

  // BPM Tap
  const handleTap = useCallback(() => {
    const now = Date.now();
    setBpmTaps(prev => {
      const next = [...prev.filter(t => now - t < 5000), now];
      if (next.length >= 2) {
        const gaps = next.slice(1).map((t, i) => t - next[i]);
        const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        setBpm(Math.round(60000 / avg));
      }
      return next;
    });
  }, []);

  // Mic
  const toggleMic = useCallback(async () => {
    if (micActive) {
      sourceRef.current?.disconnect();
      audioCtxRef.current?.close();
      analyserRef.current = null;
      dataArrayRef.current = null;
      setMicActive(false);
      return;
    }
    try {
      setMicError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;
      audioCtxRef.current = ctx;
      sourceRef.current = source;
      setMicActive(true);
    } catch {
      setMicError('Microphone access denied.');
    }
  }, [micActive]);

  // Canvas Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = COLOR_SCHEMES[scheme];
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const getFreqData = (): number[] => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        return Array.from(dataArrayRef.current).map(v => (v / 255) * sensitivity);
      }
      // Synthetic demo data
      return Array.from({ length: 128 }, (_, i) => {
        const t = timeRef.current;
        const base = Math.sin(t * 0.02 + i * 0.3) * 0.5 + 0.5;
        const beat = Math.max(0, Math.sin(t * 0.08)) ** 3;
        return Math.min(1, (base * 0.4 + beat * 0.6) * sensitivity);
      });
    };

    const drawBars = (data: number[]) => {
      const w = W(), h = H();
      const bars = 64;
      const barW = w / bars - 2;
      for (let i = 0; i < bars; i++) {
        const v = data[Math.floor(i * data.length / bars)];
        const barH = v * h * 0.85;
        const x = i * (barW + 2) + 1;
        const grad = ctx.createLinearGradient(0, h, 0, h - barH);
        grad.addColorStop(0, colors.stops[2]);
        grad.addColorStop(0.5, colors.stops[1]);
        grad.addColorStop(1, colors.stops[0]);
        ctx.fillStyle = grad;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = v * 20;
        const radius = Math.min(barW / 2, 4);
        ctx.beginPath();
        ctx.roundRect(x, h - barH, barW, barH, [radius, radius, 0, 0]);
        ctx.fill();
      }
    };

    const drawWave = (data: number[]) => {
      const w = W(), h = H();
      ctx.lineWidth = 2;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 15;
      for (let line = 0; line < 3; line++) {
        const alpha = 1 - line * 0.3;
        ctx.strokeStyle = colors.stops[line] + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
          const x = (i / data.length) * w;
          const v = data[i];
          const y = h / 2 + (v - 0.5) * h * 0.7 * Math.sin(timeRef.current * 0.01 + line * 1.2 + i * 0.05);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawRadial = (data: number[]) => {
      const w = W(), h = H();
      const cx = w / 2, cy = h / 2;
      const baseR = Math.min(w, h) * 0.2;
      const slices = data.length;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 20;
      for (let i = 0; i < slices; i++) {
        const angle = (i / slices) * Math.PI * 2 - Math.PI / 2;
        const v = data[i];
        const r1 = baseR;
        const r2 = baseR + v * Math.min(w, h) * 0.3;
        const hue = (i / slices) * 360;
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
        ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
        ctx.stroke();
      }
      // Center circle
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR);
      grad.addColorStop(0, colors.primary + '80');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawParticles = (data: number[]) => {
      const w = W(), h = H();
      const avgV = data.reduce((a, b) => a + b, 0) / data.length;
      // Spawn
      if (Math.random() < avgV * 3) {
        const hue = ((timeRef.current * 2) % 360);
        particlesRef.current.push({
          x: Math.random() * w, y: h,
          vx: (Math.random() - 0.5) * 4,
          vy: -(2 + avgV * 8),
          life: 1, maxLife: 1,
          size: 2 + avgV * 6,
          hue,
        });
      }
      // Draw & update
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05;
        p.life -= 0.012;
        const alpha = p.life / p.maxLife;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.8)`;
        ctx.shadowBlur = 12;
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawNebula = (data: number[]) => {
      const w = W(), h = H();
      const cx = w / 2, cy = h / 2;
      const t = timeRef.current;
      const n = 6;
      for (let i = 0; i < n; i++) {
        const v = data[Math.floor(i * data.length / n)];
        const angle = (i / n) * Math.PI * 2 + t * 0.005;
        const dist = 60 + v * Math.min(w, h) * 0.25;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + Math.sin(angle) * dist;
        const r = 30 + v * 120;
        const hue = (i / n) * 360 + t * 0.5;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, `hsla(${hue}, 80%, 60%, ${0.3 * v})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!isPlaying) { animRef.current = requestAnimationFrame(loop); return; }
      timeRef.current++;
      const w = W(), h = H();
      // Fade
      ctx.fillStyle = 'rgba(5,5,5,0.18)';
      ctx.fillRect(0, 0, w, h);
      ctx.shadowBlur = 0;

      const data = getFreqData();
      if (mode === 'bars')      drawBars(data);
      else if (mode === 'wave') drawWave(data);
      else if (mode === 'radial') drawRadial(data);
      else if (mode === 'particles') drawParticles(data);
      else if (mode === 'nebula') drawNebula(data);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mode, scheme, sensitivity, isPlaying]);

  const colors = COLOR_SCHEMES[scheme];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-20">
      {/* Header */}
      <div className="px-6 py-8 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-neutral-600 tracking-[0.3em] uppercase mb-1">
              VELOCITY_LAB / PLAYGROUND
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Zap className="w-8 h-8" style={{ color: colors.primary }} />
              SONIC PLAYGROUND
            </h1>
            <p className="text-neutral-500 text-sm mt-1 font-mono">
              Interactive audio–visual exploration tools
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={getInspiration}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all text-[10px] font-mono uppercase tracking-widest"
            >
              <Sparkles className="w-3 h-3" /> Inspire
            </button>
          </div>
        </div>
      </div>

      {/* Inspiration Toast */}
      <AnimatePresence>
        {showInspire && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 border text-sm font-mono text-center max-w-md"
            style={{ borderColor: colors.primary + '60', background: '#050505', color: colors.primary }}
          >
            "{inspireText}"
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-6 flex-1 flex flex-col gap-6 w-full">

        {/* Main Canvas */}
        <div
          className="relative rounded-none border overflow-hidden"
          style={{ borderColor: colors.primary + '30', height: '420px' }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          {/* Overlay badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: micActive ? '#10b981' : colors.primary }}
            />
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              {micActive ? 'MIC_ACTIVE' : 'DEMO_SIGNAL'} / {mode.toUpperCase()}
            </span>
          </div>
          {/* Corner scan effect */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 80px ${colors.glow}15` }} />
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Mode Selector */}
          <div className="border border-neutral-900 bg-neutral-950/50 p-4">
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Visualizer Mode
            </p>
            <div className="flex flex-col gap-1.5">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition-all"
                  style={{
                    background: mode === m.id ? colors.primary + '20' : 'transparent',
                    borderLeft: `2px solid ${mode === m.id ? colors.primary : '#333'}`,
                    color: mode === m.id ? colors.primary : '#666',
                  }}
                >
                  {m.icon} {m.label}
                  {mode === m.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="border border-neutral-900 bg-neutral-950/50 p-4">
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-3 flex items-center gap-1">
              <Palette className="w-3 h-3" /> Color Palette
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(Object.entries(COLOR_SCHEMES) as [ColorScheme, typeof COLOR_SCHEMES['cyan']][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setScheme(key)}
                  className="h-10 rounded-sm relative overflow-hidden transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${val.stops.join(',')})`,
                    outline: scheme === key ? `2px solid ${val.primary}` : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold text-white/80 uppercase">
                    {key}
                  </span>
                </button>
              ))}
            </div>

            {/* Sensitivity */}
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Sensitivity: {sensitivity.toFixed(1)}x
            </p>
            <input
              type="range" min="0.5" max="3" step="0.1"
              value={sensitivity}
              onChange={e => setSensitivity(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1"
              style={{ accentColor: colors.primary }}
            />
          </div>

          {/* Controls Panel */}
          <div className="border border-neutral-900 bg-neutral-950/50 p-4 flex flex-col gap-4">
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-1">
              <Radio className="w-3 h-3" /> Signal Controls
            </p>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="flex items-center justify-center gap-2 py-3 border text-[10px] font-mono uppercase tracking-widest transition-all hover:bg-neutral-900"
              style={{ borderColor: colors.primary + '40', color: colors.primary }}
            >
              {isPlaying ? <><Pause className="w-4 h-4" /> Pause Signal</> : <><Play className="w-4 h-4" /> Resume Signal</>}
            </button>

            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className="flex items-center justify-center gap-2 py-3 border text-[10px] font-mono uppercase tracking-widest transition-all"
              style={{
                borderColor: micActive ? '#10b981' : '#333',
                color: micActive ? '#10b981' : '#666',
                background: micActive ? 'rgba(16,185,129,0.08)' : 'transparent',
              }}
            >
              {micActive ? <><MicOff className="w-4 h-4" /> Stop Mic</> : <><Mic className="w-4 h-4" /> Use Microphone</>}
            </button>
            {micError && <p className="text-[9px] font-mono text-red-500">{micError}</p>}

            {/* Reset particles */}
            {mode === 'particles' && (
              <button
                onClick={() => { particlesRef.current = []; }}
                className="flex items-center justify-center gap-2 py-2 border border-neutral-800 text-neutral-600 hover:text-white hover:border-neutral-600 text-[10px] font-mono uppercase tracking-widest transition-all"
              >
                <RefreshCw className="w-3 h-3" /> Clear Particles
              </button>
            )}
          </div>
        </div>

        {/* BPM Tapper + Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* BPM Tapper */}
          <div className="border border-neutral-900 bg-neutral-950/50 p-6">
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Music className="w-3 h-3" /> BPM Tap Detector
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={handleTap}
                className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-[10px] font-mono uppercase tracking-widest transition-all active:scale-95 select-none"
                style={{ borderColor: colors.primary, color: colors.primary }}
                id="bpm-tap-button"
              >
                TAP
              </button>
              <div>
                {bpm ? (
                  <>
                    <div className="text-5xl font-black tabular-nums" style={{ color: colors.primary }}>
                      {bpm}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">BPM</div>
                    <div className="text-[9px] font-mono text-neutral-700 mt-1">
                      {bpmTaps.length} taps recorded
                    </div>
                  </>
                ) : (
                  <div className="text-neutral-700 font-mono text-sm">
                    Tap to detect<br />your tempo
                  </div>
                )}
              </div>
              {bpm && (
                <button
                  onClick={() => { setBpm(null); setBpmTaps([]); }}
                  className="ml-auto text-neutral-700 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Frequency Profile */}
          <div className="border border-neutral-900 bg-neutral-950/50 p-6">
            <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Frequency Profile
            </p>
            <div className="grid grid-cols-4 gap-3">
              {['Sub Bass', 'Bass', 'Mid', 'High'].map((label, i) => {
                const heights = [85, 60, 45, 30];
                return (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="w-full h-16 bg-neutral-900 relative overflow-hidden">
                      <motion.div
                        className="absolute bottom-0 w-full"
                        style={{ background: `linear-gradient(to top, ${colors.stops.join(',')})` }}
                        animate={{ height: `${heights[i]}%` }}
                        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1 + i * 0.4 }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-neutral-600 uppercase">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer label */}
        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-800 uppercase tracking-widest pb-4">
          <span>VELOCITY_LAB // PLAYGROUND_v1.0</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 animate-pulse" />
            SIGNAL_ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
