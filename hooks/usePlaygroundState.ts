'use client';

import { useState, useCallback, useRef } from 'react';
import { PRESETS, PresetName, PresetSettings } from '../utils/presets';
import { lerp } from '../utils/visualMath';

export type InputMode = 'IDLE' | 'MIC' | 'AUDIO' | 'CAMERA';

export const usePlaygroundState = () => {
  const [currentPresetName, setCurrentPresetName] = useState<PresetName>('NEURAL_LINK');
  const [presetSettings, setPresetSettings] = useState<PresetSettings>({ ...PRESETS.NEURAL_LINK });
  const [inputMode, setInputMode] = useState<InputMode>('IDLE');
  const [logs, setLogs] = useState<string[]>([
    '[OK] SIGNAL_BUS INITIALIZED',
    '[OK] NEURAL_DENSITY MAPPED',
    '[OK] SYNTHETIC_SIGNAL RUNNING',
  ]);

  // Mouse position for visual interaction (normalized 0-1)
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const addLog = useCallback((message: string) => {
    setLogs(prev => {
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLogs = [...prev, `[${ts}] ${message}`];
      if (newLogs.length > 8) return newLogs.slice(newLogs.length - 8);
      return newLogs;
    });
  }, []);

  const changePreset = useCallback((name: PresetName) => {
    setCurrentPresetName(name);
    // Animate transition by lerping to target preset
    const target = PRESETS[name];
    setPresetSettings(prev => {
      const numericKeys: (keyof PresetSettings)[] = [
        'drive', 'bloom', 'grain', 'distortion', 'signalNoise', 'tempo',
        'neuralDensity', 'cameraMix', 'particleGravity', 'waveformIntensity',
      ];
      const result = { ...target };
      // We do an immediate partial lerp for a smoother visual feel, 
      // but the real smoothing happens in the render loop
      for (const key of numericKeys) {
        (result as Record<string, unknown>)[key] = lerp(prev[key] as number, target[key] as number, 0.5);
      }
      return result;
    });
    // After a brief delay, snap to full target
    setTimeout(() => {
      setPresetSettings({ ...PRESETS[name] });
    }, 300);
    addLog(`PRESET_LOADED: ${name}`);
  }, [addLog]);

  const updateSetting = useCallback(<K extends keyof PresetSettings>(key: K, value: PresetSettings[K]) => {
    setPresetSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateMouse = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y };
  }, []);

  const getMouse = useCallback(() => mouseRef.current, []);

  return {
    currentPresetName,
    presetSettings,
    changePreset,
    updateSetting,
    inputMode,
    setInputMode,
    logs,
    addLog,
    updateMouse,
    getMouse,
  };
};
