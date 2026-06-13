export type PresetName = 'STREET_DRIVE' | 'REC_MASTER' | 'NEURAL_LINK' | 'TRANSMISSION_FLOW' | 'CORE_SYNC';

export interface PresetSettings {
  name: PresetName;
  drive: number;
  bloom: number;
  grain: number;
  distortion: number;
  signalNoise: number;
  tempo: number;
  neuralDensity: number;
  cameraMix: number;
  particleGravity: number;
  waveformIntensity: number;
  colorPrimary: string;
  colorSecondary: string;
  glowColor: string;
  visualMode: 'waveform' | 'spectrum' | 'particles' | 'neural' | 'core';
}

export const PRESETS: Record<PresetName, PresetSettings> = {
  STREET_DRIVE: {
    name: 'STREET_DRIVE',
    drive: 0.8,
    bloom: 0.6,
    grain: 0.8,
    distortion: 0.4,
    signalNoise: 0.5,
    tempo: 1.2,
    neuralDensity: 0.2,
    cameraMix: 0.3,
    particleGravity: 0.8,
    waveformIntensity: 0.9,
    colorPrimary: '#ff4500', // Orange/Red
    colorSecondary: '#ffffff', // White
    glowColor: 'rgba(255, 69, 0, 0.5)',
    visualMode: 'waveform',
  },
  REC_MASTER: {
    name: 'REC_MASTER',
    drive: 0.5,
    bloom: 0.3,
    grain: 0.2,
    distortion: 0.1,
    signalNoise: 0.1,
    tempo: 1.0,
    neuralDensity: 0.1,
    cameraMix: 0.1,
    particleGravity: 0.2,
    waveformIntensity: 1.0,
    colorPrimary: '#06b6d4', // Cyan
    colorSecondary: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    visualMode: 'spectrum',
  },
  NEURAL_LINK: {
    name: 'NEURAL_LINK',
    drive: 0.6,
    bloom: 0.8,
    grain: 0.4,
    distortion: 0.2,
    signalNoise: 0.3,
    tempo: 0.9,
    neuralDensity: 0.9,
    cameraMix: 0.6,
    particleGravity: 0.4,
    waveformIntensity: 0.6,
    colorPrimary: '#8b5cf6', // Purple
    colorSecondary: '#0ea5e9', // Blue
    glowColor: 'rgba(139, 92, 246, 0.6)',
    visualMode: 'neural',
  },
  TRANSMISSION_FLOW: {
    name: 'TRANSMISSION_FLOW',
    drive: 0.7,
    bloom: 0.5,
    grain: 0.7,
    distortion: 0.6,
    signalNoise: 0.8,
    tempo: 1.1,
    neuralDensity: 0.5,
    cameraMix: 0.8,
    particleGravity: 0.6,
    waveformIntensity: 0.7,
    colorPrimary: '#10b981', // Emerald
    colorSecondary: '#fbbf24', // Amber
    glowColor: 'rgba(16, 185, 129, 0.5)',
    visualMode: 'particles',
  },
  CORE_SYNC: {
    name: 'CORE_SYNC',
    drive: 0.9,
    bloom: 0.9,
    grain: 0.3,
    distortion: 0.3,
    signalNoise: 0.2,
    tempo: 0.5, // Slow cinematic motion
    neuralDensity: 0.4,
    cameraMix: 0.2,
    particleGravity: 0.1,
    waveformIntensity: 0.4,
    colorPrimary: '#f43f5e', // Rose
    colorSecondary: '#000000',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    visualMode: 'core',
  }
};
