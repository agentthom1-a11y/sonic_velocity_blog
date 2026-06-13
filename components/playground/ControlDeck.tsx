'use client';

import React from 'react';
import { PresetSettings } from '../../utils/presets';
import { SignalSlider } from './SignalSlider';

interface ControlDeckProps {
  preset: PresetSettings;
  updateSetting: <K extends keyof PresetSettings>(key: K, value: PresetSettings[K]) => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({ preset, updateSetting }) => {
  return (
    <div className="w-full h-full bg-black/95 p-5 overflow-y-auto">
      <div className="mb-5 pb-3 border-b border-neutral-900">
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 mb-1">CONTROL_DECK</h2>
        <div className="text-xs font-bold tracking-widest uppercase" style={{ color: preset.colorPrimary }}>
          {preset.name.replace(/_/g, ' ')}
        </div>
      </div>

      <SignalSlider label="DRIVE" value={preset.drive} onChange={(v) => updateSetting('drive', v)} color={preset.colorPrimary} />
      <SignalSlider label="BLOOM" value={preset.bloom} onChange={(v) => updateSetting('bloom', v)} color={preset.colorPrimary} />
      <SignalSlider label="GRAIN" value={preset.grain} onChange={(v) => updateSetting('grain', v)} color={preset.colorSecondary} />
      <SignalSlider label="DISTORTION" value={preset.distortion} onChange={(v) => updateSetting('distortion', v)} color={preset.colorSecondary} />
      <SignalSlider label="SIGNAL_NOISE" value={preset.signalNoise} onChange={(v) => updateSetting('signalNoise', v)} color={preset.colorPrimary} />
      <SignalSlider label="TEMPO" value={preset.tempo} onChange={(v) => updateSetting('tempo', v)} min={0.1} max={3} color={preset.colorPrimary} />
      <SignalSlider label="NEURAL_DENSITY" value={preset.neuralDensity} onChange={(v) => updateSetting('neuralDensity', v)} color={preset.colorSecondary} />
      <SignalSlider label="CAMERA_MIX" value={preset.cameraMix} onChange={(v) => updateSetting('cameraMix', v)} color={preset.colorSecondary} />
      <SignalSlider label="PARTICLE_GRAVITY" value={preset.particleGravity} onChange={(v) => updateSetting('particleGravity', v)} color={preset.colorPrimary} />
      <SignalSlider label="WAVEFORM_INTENSITY" value={preset.waveformIntensity} onChange={(v) => updateSetting('waveformIntensity', v)} max={2} color={preset.colorPrimary} />

      <div className="mt-6 pt-4 border-t border-neutral-900">
        <p className="text-[8px] font-mono text-neutral-700 tracking-widest uppercase">
          DRAG SLIDERS TO MANIPULATE
        </p>
        <p className="text-[8px] font-mono text-neutral-800 tracking-widest uppercase mt-1">
          ALL CONTROLS REAL-TIME
        </p>
      </div>
    </div>
  );
};
