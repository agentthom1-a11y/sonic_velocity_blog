'use client';

import { useRef, useCallback, useState } from 'react';

export interface AudioAnalyzerState {
  isMicActive: boolean;
  isFileActive: boolean;
  fileName: string | null;
}

// Helper to create a distortion curve for the WaveShaperNode
function makeDistortionCurve(amount = 50) {
  const k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export const useAudioAnalyzer = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null); // To compensate for filter volume drops
  const sourceRef = useRef<MediaStreamAudioSourceNode | AudioBufferSourceNode | MediaElementAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  const [state, setState] = useState<AudioAnalyzerState>({
    isMicActive: false,
    isFileActive: false,
    fileName: null,
  });

  const ensureContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    const ctx = audioCtxRef.current;
    
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.82;
      const bins = analyserRef.current.frequencyBinCount;
      freqDataRef.current = new Uint8Array(bins);
      timeDataRef.current = new Uint8Array(bins);

      // Create FX Nodes
      distortionRef.current = ctx.createWaveShaper();
      distortionRef.current.curve = makeDistortionCurve(0);
      distortionRef.current.oversample = '4x';

      filterRef.current = ctx.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.value = 20000; // start fully open

      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = 1.0;

      // Routing: Distortion -> Filter -> Analyser -> Gain -> Destination
      distortionRef.current.connect(filterRef.current);
      filterRef.current.connect(analyserRef.current);
      analyserRef.current.connect(gainRef.current);
      gainRef.current.connect(ctx.destination);
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const disconnectSource = useCallback(() => {
    try { 
      if (sourceRef.current && 'stop' in sourceRef.current) {
        (sourceRef.current as AudioBufferSourceNode).stop();
      }
      sourceRef.current?.disconnect(); 
    } catch (_) { /* already disconnected */ }
    sourceRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.src = '';
      audioElRef.current = null;
    }
  }, []);

  const startMic = useCallback(async (): Promise<boolean> => {
    try {
      disconnectSource();
      ensureContext();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const source = audioCtxRef.current!.createMediaStreamSource(stream);
      // Connect source to the first FX node instead of directly to analyser
      source.connect(distortionRef.current!);
      sourceRef.current = source;

      setState({ isMicActive: true, isFileActive: false, fileName: null });
      return true;
    } catch (err) {
      console.error('[AudioAnalyzer] Mic access denied:', err);
      return false;
    }
  }, [disconnectSource, ensureContext]);

  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const playbackStartTimeRef = useRef<number>(0);

  const playAudioFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      disconnectSource();
      ensureContext();

      const ctx = audioCtxRef.current!;
      
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBufferRef.current = audioBuffer;
      
      // Create buffer source
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      
      // Connect source to FX chain
      source.connect(distortionRef.current!);
      sourceRef.current = source;

      playbackStartTimeRef.current = ctx.currentTime;
      source.start(0);

      setState({ isMicActive: false, isFileActive: true, fileName: file.name });
      return true;
    } catch (err) {
      console.error('[AudioAnalyzer] Audio file error:', err);
      return false;
    }
  }, [disconnectSource, ensureContext]);

  const seekAudio = useCallback((timeInSeconds: number) => {
    if (!audioBufferRef.current || !audioCtxRef.current || !distortionRef.current) return;
    const ctx = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    
    // Stop current source
    try { 
      if (sourceRef.current && 'stop' in sourceRef.current) {
        (sourceRef.current as AudioBufferSourceNode).stop();
      }
    } catch (_) {}

    // Create a new source node
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(distortionRef.current);
    sourceRef.current = source;
    
    // Calculate new start time offset (handle looping by wrapping around)
    const offset = Math.max(0, timeInSeconds) % buffer.duration;
    playbackStartTimeRef.current = ctx.currentTime - offset;
    
    source.start(0, offset);
  }, []);

  const getPlaybackState = useCallback(() => {
    if (!audioBufferRef.current || !audioCtxRef.current || !state.isFileActive) return null;
    const duration = audioBufferRef.current.duration;
    // Calculate current time, wrapping around if looped
    const currentTime = Math.max(0, (audioCtxRef.current.currentTime - playbackStartTimeRef.current)) % duration;
    return { currentTime, duration };
  }, [state.isFileActive]);

  const stopAll = useCallback(() => {
    disconnectSource();
    setState({ isMicActive: false, isFileActive: false, fileName: null });
  }, [disconnectSource]);

  const updateAudioFilters = useCallback((distortionAmount: number, filterAmount: number) => {
    if (!distortionRef.current || !filterRef.current || !gainRef.current) return;
    
    // Map distortion amount (0-1) to curve intensity (0-400)
    // 0 = no distortion, 1 = heavy distortion
    const distValue = Math.pow(distortionAmount, 2) * 400;
    distortionRef.current.curve = makeDistortionCurve(distValue);

    // Map filterAmount (0-1) to lowpass frequency
    // 0 = fully open (20000Hz), 1 = heavily muffled (400Hz)
    // Using exponential scale for natural hearing curve
    const minFreq = 400;
    const maxFreq = 20000;
    // When filterAmount = 0, exp = 1. When filterAmount = 1, exp = 0
    const exp = 1 - filterAmount;
    const freq = minFreq * Math.pow(maxFreq / minFreq, exp);
    
    // Use ramp for smooth transitions to avoid audio popping
    const ctx = audioCtxRef.current;
    if (ctx) {
       filterRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.1);
       
       // Boost gain slightly when filtering heavily to maintain apparent volume
       const gainCompensation = 1.0 + (filterAmount * 1.5);
       gainRef.current.gain.setTargetAtTime(gainCompensation, ctx.currentTime, 0.1);
    }
  }, []);

  /** Call this inside requestAnimationFrame. Returns live typed arrays (mutated in-place). */
  const sampleAudio = useCallback((): { freqData: Uint8Array; timeData: Uint8Array } | null => {
    if (!analyserRef.current || !freqDataRef.current || !timeDataRef.current) return null;
    analyserRef.current.getByteFrequencyData(freqDataRef.current);
    analyserRef.current.getByteTimeDomainData(timeDataRef.current);
    return { freqData: freqDataRef.current, timeData: timeDataRef.current };
  }, []);

  const getAudioContext = useCallback(() => audioCtxRef.current, []);

  // Use a ref to store a single destination node that we only create once per context
  const destNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  
  const getAudioDestinationStream = useCallback((): MediaStream | null => {
    const ctx = audioCtxRef.current;
    if (!ctx || !gainRef.current) return null;
    
    if (!destNodeRef.current) {
        destNodeRef.current = ctx.createMediaStreamDestination();
        // Connect the final processed output (gain node) to the recording destination
        gainRef.current.connect(destNodeRef.current);
    }
    
    return destNodeRef.current.stream;
  }, []);

  return { 
    startMic, 
    playAudioFile, 
    stopAll, 
    sampleAudio, 
    updateAudioFilters, 
    getAudioContext, 
    getAudioDestinationStream, 
    seekAudio,
    getPlaybackState,
    state 
  };
};
