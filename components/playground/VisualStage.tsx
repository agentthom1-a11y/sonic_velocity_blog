'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { PresetSettings } from '../../utils/presets';
import { hexToRgba, lerp, clamp, mapRange } from '../../utils/visualMath';

interface VisualStageProps {
  preset: PresetSettings;
  sampleAudio: () => { freqData: Uint8Array; timeData: Uint8Array } | null;
  getVideoElement: () => HTMLVideoElement | null;
  inputMode: string;
  getMouse: () => { x: number; y: number };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export const VisualStage: React.FC<VisualStageProps> = ({
  preset,
  sampleAudio,
  getVideoElement,
  inputMode,
  getMouse,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animIdRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const smoothBeatRef = useRef(0);
  const prevBeatRef = useRef(0);
  const beatPulseRef = useRef(0);

  // Use refs to always read latest props without restarting animation loop
  const presetRef = useRef(preset);
  presetRef.current = preset;
  const sampleAudioRef = useRef(sampleAudio);
  sampleAudioRef.current = sampleAudio;
  const getVideoRef = useRef(getVideoElement);
  getVideoRef.current = getVideoElement;
  const inputModeRef = useRef(inputMode);
  inputModeRef.current = inputMode;
  const getMouseRef = useRef(getMouse);
  getMouseRef.current = getMouse;

  // Synthetic idle signal generator
  const generateSyntheticSignal = useCallback((t: number, p: PresetSettings) => {
    const bins = 256;
    const freqData = new Uint8Array(bins);
    const timeData = new Uint8Array(bins);

    for (let i = 0; i < bins; i++) {
      const norm = i / bins;
      // Bass-heavy with rolling waves
      const bass = Math.max(0, Math.sin(t * 0.03 * p.tempo + norm * 2)) ** 2 * (1 - norm);
      const mid = Math.sin(t * 0.05 * p.tempo + norm * 8) * 0.3 * Math.exp(-norm * 3);
      const high = Math.sin(t * 0.08 * p.tempo + norm * 20) * 0.1 * (norm > 0.5 ? 1 : 0);
      const beat = Math.max(0, Math.sin(t * 0.06 * p.tempo)) ** 8 * (1 - norm) * 0.5;
      const val = clamp((bass + Math.abs(mid) + Math.abs(high) + beat) * p.drive, 0, 1);
      freqData[i] = Math.floor(val * 255);

      // Time domain: oscillating waveform
      const wave = Math.sin(t * 0.04 * p.tempo + i * 0.08) * p.waveformIntensity * 0.5;
      const wave2 = Math.sin(t * 0.07 * p.tempo + i * 0.12) * p.waveformIntensity * 0.3;
      timeData[i] = clamp(128 + (wave + wave2) * 80, 0, 255);
    }
    return { freqData, timeData };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      const p = presetRef.current;
      const mode = inputModeRef.current;
      const mouse = getMouseRef.current();
      timeRef.current++;
      const t = timeRef.current;

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      // Get audio data
      let audioData = sampleAudioRef.current();
      if (!audioData || mode === 'IDLE') {
        audioData = generateSyntheticSignal(t, p);
      }
      const { freqData, timeData } = audioData;

      // Calculate beat intensity from bass bins
      let bassSum = 0;
      const bassBins = Math.min(16, freqData.length);
      for (let i = 0; i < bassBins; i++) bassSum += freqData[i];
      const rawBeat = bassSum / (bassBins * 255);
      smoothBeatRef.current = lerp(smoothBeatRef.current, rawBeat, 0.15);
      const beat = smoothBeatRef.current;

      // Beat pulse detection
      if (rawBeat > prevBeatRef.current + 0.1 && rawBeat > 0.5) {
        beatPulseRef.current = 1;
      }
      prevBeatRef.current = rawBeat;
      beatPulseRef.current *= 0.92;

      // === BACKGROUND ===
      const fadeAlpha = mapRange(p.bloom, 0, 1, 0.3, 0.06);
      ctx.fillStyle = `rgba(3, 3, 3, ${fadeAlpha})`;
      ctx.fillRect(0, 0, W, H);

      // Background glow from bass
      const glowRadius = 200 + beat * 300 * p.bloom;
      const bgGlow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, glowRadius);
      bgGlow.addColorStop(0, hexToRgba(p.colorPrimary, beat * 0.08 * p.bloom));
      bgGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, W, H);

      // === CAMERA OVERLAY ===
      const videoEl = getVideoRef.current();
      if (videoEl && videoEl.readyState >= 2 && p.cameraMix > 0.01) {
        ctx.save();
        ctx.globalAlpha = p.cameraMix * 0.6;
        ctx.globalCompositeOperation = 'screen';
        // Draw with aspect ratio fill
        const vw = videoEl.videoWidth || W;
        const vh = videoEl.videoHeight || H;
        const scale = Math.max(W / vw, H / vh);
        const dw = vw * scale;
        const dh = vh * scale;
        ctx.drawImage(videoEl, (W - dw) / 2, (H - dh) / 2, dw, dh);

        // Scanline overlay on camera
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.cameraMix * 0.15;
        for (let y = 0; y < H; y += 3) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(0, y, W, 1);
        }
        // RGB split effect
        if (p.distortion > 0.2) {
          ctx.globalAlpha = p.distortion * 0.15;
          ctx.globalCompositeOperation = 'lighter';
          const shift = p.distortion * 6;
          ctx.drawImage(videoEl, (W - dw) / 2 + shift, (H - dh) / 2, dw, dh);
        }
        ctx.restore();
      }

      // === VISUALIZATION MODES ===
      ctx.save();

      if (p.visualMode === 'waveform') {
        // STREET_DRIVE style: horizontal motion, light streaks
        const cx = W / 2;
        const cy = H / 2;

        // Horizontal speed lines
        ctx.lineWidth = 1.5 + p.drive * 2;
        ctx.shadowBlur = p.bloom * 25;
        ctx.shadowColor = p.glowColor;
        ctx.strokeStyle = p.colorPrimary;

        ctx.beginPath();
        for (let i = 0; i < timeData.length; i++) {
          const x = (i / timeData.length) * W;
          const v = (timeData[i] - 128) / 128;
          const y = cy + v * (H * 0.35) * p.waveformIntensity;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary waveform (ghost)
        ctx.strokeStyle = hexToRgba(p.colorSecondary, 0.4);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < timeData.length; i++) {
          const x = (i / timeData.length) * W;
          const v = (timeData[i] - 128) / 128;
          const offset = Math.sin(t * 0.03 + i * 0.02) * 20;
          const y = cy + v * (H * 0.25) * p.waveformIntensity + offset;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Horizontal streaks
        if (beatPulseRef.current > 0.1) {
          ctx.strokeStyle = hexToRgba(p.colorPrimary, beatPulseRef.current * 0.3);
          ctx.lineWidth = 1;
          for (let i = 0; i < 8; i++) {
            const y = Math.random() * H;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W * (0.5 + Math.random() * 0.5), y);
            ctx.stroke();
          }
        }
      }

      else if (p.visualMode === 'spectrum') {
        // REC_MASTER style: clean analyzer bars
        const bars = 80;
        const gap = 2;
        const barW = (W - gap * bars) / bars;

        for (let i = 0; i < bars; i++) {
          const idx = Math.floor(i * freqData.length / bars);
          const val = freqData[idx] / 255;
          const barH = val * H * 0.8 * p.waveformIntensity;
          const x = i * (barW + gap);

          const grad = ctx.createLinearGradient(0, H, 0, H - barH);
          grad.addColorStop(0, hexToRgba(p.colorPrimary, 0.2));
          grad.addColorStop(0.5, p.colorPrimary);
          grad.addColorStop(1, hexToRgba(p.colorSecondary, 0.9));

          ctx.shadowBlur = val * p.bloom * 15;
          ctx.shadowColor = p.glowColor;
          ctx.fillStyle = grad;
          ctx.fillRect(x, H - barH, barW, barH);

          // Peak dot
          if (val > 0.6) {
            ctx.fillStyle = hexToRgba(p.colorPrimary, 0.8);
            ctx.fillRect(x, H - barH - 4, barW, 2);
          }
        }

        // Center frequency line
        ctx.strokeStyle = hexToRgba(p.colorPrimary, 0.15);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, H * 0.5);
        ctx.lineTo(W, H * 0.5);
        ctx.stroke();
      }

      else if (p.visualMode === 'neural') {
        // NEURAL_LINK: nodes + connections + rings
        const cx = W / 2 + (mouse.x - 0.5) * 40;
        const cy = H / 2 + (mouse.y - 0.5) * 40;
        const baseR = Math.min(W, H) * 0.12;
        const r = baseR + beat * 80 * p.drive;

        // Pulsing core
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        coreGrad.addColorStop(0, hexToRgba(p.colorPrimary, 0.5 + beat * 0.3));
        coreGrad.addColorStop(0.7, hexToRgba(p.colorSecondary, 0.15));
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Neural rings
        const ringCount = Math.floor(p.neuralDensity * 12) + 2;
        ctx.lineWidth = 1;
        for (let i = 0; i < ringCount; i++) {
          const ringR = r + i * 18 + Math.sin(t * 0.025 + i * 1.5) * 12;
          const alpha = mapRange(i, 0, ringCount, 0.6, 0.05);
          ctx.strokeStyle = hexToRgba(p.colorSecondary, alpha);
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Frequency ring (spectrum around circle)
        ctx.lineWidth = 2;
        ctx.shadowBlur = p.bloom * 20;
        ctx.shadowColor = p.glowColor;
        const freqRingR = r + ringCount * 18 + 30;
        const slices = Math.min(128, freqData.length);
        for (let i = 0; i < slices; i++) {
          const angle = (i / slices) * Math.PI * 2 - Math.PI / 2;
          const val = freqData[i] / 255;
          const innerR = freqRingR;
          const outerR = freqRingR + val * 60 * p.waveformIntensity;

          ctx.strokeStyle = hexToRgba(p.colorPrimary, 0.3 + val * 0.5);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
          ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
          ctx.stroke();
        }

        // Neural nodes floating around
        const nodeCount = Math.floor(p.neuralDensity * 8) + 3;
        ctx.fillStyle = hexToRgba(p.colorPrimary, 0.7);
        for (let i = 0; i < nodeCount; i++) {
          const a = (i / nodeCount) * Math.PI * 2 + t * 0.01 * p.tempo;
          const d = freqRingR + 30 + Math.sin(t * 0.02 + i * 2) * 30;
          const nx = cx + Math.cos(a) * d;
          const ny = cy + Math.sin(a) * d;
          ctx.beginPath();
          ctx.arc(nx, ny, 3 + beat * 4, 0, Math.PI * 2);
          ctx.fill();

          // Connection line to center
          ctx.strokeStyle = hexToRgba(p.colorSecondary, 0.1);
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
      }

      else if (p.visualMode === 'particles') {
        // TRANSMISSION_FLOW: particles + radio rings
        const cx = W / 2;
        const cy = H / 2;

        // Spawn particles from center
        const spawnRate = Math.floor(2 + beat * 10 * p.particleGravity);
        for (let s = 0; s < spawnRate; s++) {
          if (particlesRef.current.length > 400) break;
          const angle = Math.random() * Math.PI * 2;
          const speed = (1 + Math.random() * 4) * p.drive;
          particlesRef.current.push({
            x: cx + (mouse.x - 0.5) * 100,
            y: cy + (mouse.y - 0.5) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: 1.5 + Math.random() * 3 * p.bloom,
            color: Math.random() > 0.4 ? p.colorPrimary : p.colorSecondary,
          });
        }

        // Update and draw particles
        const particles = particlesRef.current;
        let writeIdx = 0;
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.02 * p.particleGravity; // gravity
          pt.life -= 0.008 * p.tempo;
          pt.vx *= 0.995;
          pt.vy *= 0.995;

          if (pt.life > 0 && pt.x > -20 && pt.x < W + 20 && pt.y > -20 && pt.y < H + 20) {
            ctx.fillStyle = hexToRgba(pt.color, pt.life * 0.8);
            ctx.shadowBlur = pt.life * p.bloom * 8;
            ctx.shadowColor = pt.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2);
            ctx.fill();
            particles[writeIdx++] = pt;
          }
        }
        particles.length = writeIdx;

        // Radio rings pulsing from center
        ctx.shadowBlur = 0;
        if (beatPulseRef.current > 0.05) {
          const ringR = (1 - beatPulseRef.current) * 300;
          ctx.strokeStyle = hexToRgba(p.colorPrimary, beatPulseRef.current * 0.4);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      else if (p.visualMode === 'core') {
        // CORE_SYNC: central orb, deep bass pulse, heavy bloom
        const cx = W / 2;
        const cy = H / 2;
        const maxR = Math.min(W, H) * 0.25;
        const r = maxR * 0.3 + beat * maxR * 0.7 * p.drive;

        // Deep background glow
        const deepGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.5);
        deepGlow.addColorStop(0, hexToRgba(p.colorPrimary, beat * 0.12));
        deepGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = deepGlow;
        ctx.fillRect(0, 0, W, H);

        // Core orb
        ctx.shadowBlur = p.bloom * 60;
        ctx.shadowColor = p.colorPrimary;
        const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        orbGrad.addColorStop(0, hexToRgba(p.colorPrimary, 0.9));
        orbGrad.addColorStop(0.4, hexToRgba(p.colorPrimary, 0.4));
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Slow rotating outer ring
        ctx.strokeStyle = hexToRgba(p.colorPrimary, 0.3);
        ctx.lineWidth = 2;
        const outerR = maxR * 0.8 + Math.sin(t * 0.01 * p.tempo) * 20;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, t * 0.005, t * 0.005 + Math.PI * 1.5);
        ctx.stroke();

        // Second rotating arc
        ctx.strokeStyle = hexToRgba(p.colorSecondary || p.colorPrimary, 0.2);
        ctx.beginPath();
        ctx.arc(cx, cy, outerR + 15, -t * 0.003, -t * 0.003 + Math.PI * 1.2);
        ctx.stroke();

        // Beat pulse ring
        if (beatPulseRef.current > 0.05) {
          const pulseR = r + (1 - beatPulseRef.current) * maxR * 0.8;
          ctx.strokeStyle = hexToRgba(p.colorPrimary, beatPulseRef.current * 0.5);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      // === OVERLAYS ===

      // Scanlines (grain effect)
      if (p.grain > 0.05) {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.grain * 0.03})`;
        for (let y = 0; y < H; y += 3) {
          ctx.fillRect(0, y, W, 1);
        }
      }

      // Film grain noise
      if (p.signalNoise > 0.1) {
        const imageData = ctx.getImageData(0, 0, 
          Math.min(W, canvas.width / dpr), 
          Math.min(H, canvas.height / dpr)
        );
        const pixels = imageData.data;
        const noiseAmt = p.signalNoise * 15;
        // Apply noise to a sparse set of pixels for performance
        for (let i = 0; i < pixels.length; i += 16) {
          const noise = (Math.random() - 0.5) * noiseAmt;
          pixels[i] = clamp(pixels[i] + noise, 0, 255);
          pixels[i + 1] = clamp(pixels[i + 1] + noise, 0, 255);
          pixels[i + 2] = clamp(pixels[i + 2] + noise, 0, 255);
        }
        ctx.putImageData(imageData, 0, 0);
      }

      // Distortion glitch lines
      if (p.distortion > 0.2 && Math.random() < p.distortion * 0.15) {
        const sliceH = 2 + Math.random() * 10;
        const sliceY = Math.random() * H;
        const shift = (Math.random() - 0.5) * p.distortion * 30;
        try {
          const slice = ctx.getImageData(0, sliceY, W, sliceH);
          ctx.putImageData(slice, shift, sliceY);
        } catch (_) { /* ignore if out of bounds */ }
      }

      // Vignette
      const vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.7);
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      // Mouse glow cursor
      const mx = mouse.x * W;
      const my = mouse.y * H;
      const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
      cursorGlow.addColorStop(0, hexToRgba(p.colorPrimary, 0.06));
      cursorGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, W, H);

      animIdRef.current = requestAnimationFrame(draw);
    };

    animIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [generateSyntheticSignal]);

  // Status overlay text
  const statusLabel = inputMode === 'IDLE' ? 'SYNTHETIC_SIGNAL' : inputMode === 'MIC' ? 'MIC_ACTIVE' : inputMode === 'AUDIO' ? 'AUDIO_PLAYING' : 'CAMERA_ACTIVE';

  return (
    <div className="relative w-full h-full bg-[#030303] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Status badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
        <div className={`w-2 h-2 rounded-full ${inputMode !== 'IDLE' ? 'bg-emerald-500' : 'bg-neutral-600'} animate-pulse`} />
        <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500">
          {statusLabel} / {preset.visualMode.toUpperCase()}
        </span>
      </div>

      {/* Mode badge */}
      <div className="absolute top-4 right-4 pointer-events-none z-10">
        <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-1 border border-neutral-800 bg-black/60 backdrop-blur-sm"
              style={{ color: preset.colorPrimary, borderColor: hexToRgba(preset.colorPrimary, 0.3) }}>
          {preset.name}
        </span>
      </div>

      {/* Inset border glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ boxShadow: `inset 0 0 80px ${hexToRgba(preset.glowColor, 0.15)}, inset 0 0 2px ${hexToRgba(preset.colorPrimary, 0.2)}` }}
      />

      {/* Corner decoration */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10 text-[8px] font-mono text-neutral-700 tracking-widest">
        VELOCITY_CORE_ENGINE v2.0
      </div>
    </div>
  );
};
