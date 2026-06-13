'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Mic, Camera, UploadCloud, Save, Square, Video } from 'lucide-react';
import { PermissionCard } from './PermissionCard';
import { PresetButton } from './PresetButton';
import { PresetName, PRESETS } from '../../utils/presets';
import { InputMode } from '../../hooks/usePlaygroundState';
import type { AudioAnalyzerState } from '../../hooks/useAudioAnalyzer';
import type { CameraState } from '../../hooks/useCameraSignal';

interface ModulePanelProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  currentPresetName: PresetName;
  changePreset: (name: PresetName) => void;
  onMicToggle: () => Promise<void>;
  onCameraToggle: () => Promise<void>;
  onAudioUpload: (file: File) => Promise<void>;
  onStop: () => void;
  audioState: AudioAnalyzerState;
  cameraState: CameraState;
  isRecording?: boolean;
  onToggleRecording?: () => void;
  seekAudio?: (time: number) => void;
  getPlaybackState?: () => { currentTime: number, duration: number } | null;
  sampleAudio?: () => { freqData: Uint8Array; timeData: Uint8Array } | null;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioScrubber = ({ 
  getPlaybackState, 
  seekAudio,
  sampleAudio
}: { 
  getPlaybackState: () => { currentTime: number, duration: number } | null,
  seekAudio: (time: number) => void,
  sampleAudio?: () => { freqData: Uint8Array; timeData: Uint8Array } | null
}) => {
  const [playbackState, setPlaybackState] = React.useState({ currentTime: 0, duration: 0 });
  const isDraggingRef = React.useRef(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    let id: number;
    const tick = () => {
      if (!isDraggingRef.current) {
        const state = getPlaybackState();
        if (state) {
          setPlaybackState(state);
        }
      }
      
      // Draw live visualizer
      if (sampleAudio && canvasRef.current) {
        const audioData = sampleAudio();
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && audioData) {
           const { freqData } = audioData;
           const width = canvasRef.current.width;
           const height = canvasRef.current.height;
           ctx.clearRect(0, 0, width, height);
           
           const barWidth = Math.max(1, width / 64);
           let x = 0;
           for (let i = 0; i < 64; i++) {
             // Use lower frequencies
             const v = freqData[i] / 255.0;
             const barHeight = v * height;
             ctx.fillStyle = `rgba(52, 211, 153, ${0.3 + (v * 0.7)})`; // emerald-400
             ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
             x += barWidth;
           }
        }
      }
      
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [getPlaybackState, sampleAudio]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setPlaybackState(prev => ({ ...prev, currentTime: newTime }));
  };

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    isDraggingRef.current = false;
    const newTime = parseFloat(e.currentTarget.value);
    seekAudio(newTime);
  };

  if (playbackState.duration === 0) return null;

  return (
    <div className="w-full mt-2 mb-4 bg-black/40 border border-neutral-800 p-3 flex flex-col gap-2">
      <div className="flex justify-between items-end text-[8px] font-mono text-neutral-500 mb-1">
        <span className="text-emerald-400">NOW_PLAYING</span>
        <div className="flex gap-2">
            <span>{formatTime(playbackState.currentTime)}</span>
            <span>/</span>
            <span>{formatTime(playbackState.duration)}</span>
        </div>
      </div>
      
      {/* Mini frequency canvas */}
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={30} 
        className="w-full h-8 bg-neutral-900/50 rounded-sm mb-1" 
      />

      <input
        type="range"
        min="0"
        max={playbackState.duration}
        step="0.1"
        value={playbackState.currentTime}
        onChange={handleChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="w-full h-1 bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
      />
    </div>
  );
};

export const ModulePanel: React.FC<ModulePanelProps> = ({
  inputMode, setInputMode, currentPresetName, changePreset,
  onMicToggle, onCameraToggle, onAudioUpload, onStop,
  audioState, cameraState, isRecording, onToggleRecording,
  seekAudio, getPlaybackState, sampleAudio
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await onAudioUpload(file);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      await onAudioUpload(file);
    }
  }, [onAudioUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleCapture = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `sonic_velocity_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="w-full h-full bg-black/95 p-5 overflow-y-auto">
      {/* Input Modules */}
      <div className="mb-6">
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 mb-4 pb-2 border-b border-neutral-900">
          INPUT_MODULES
        </h2>

        <PermissionCard
          title="MIC_INPUT"
          description="Mic is used locally for real-time visualization only. No audio is recorded or uploaded."
          buttonText="ACTIVATE MIC"
          isActive={inputMode === 'MIC'}
          onToggle={onMicToggle}
          icon={<Mic className="w-4 h-4" />}
        />

        <PermissionCard
          title="CAMERA_SIGNAL"
          description="Camera feed becomes part of the visual system with neural mesh and scanline effects."
          buttonText="ACTIVATE CAMERA"
          isActive={inputMode === 'CAMERA'}
          onToggle={onCameraToggle}
          icon={<Camera className="w-4 h-4" />}
          error={cameraState.error}
        />

        {/* Audio Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 border border-dashed mb-4 transition-all cursor-pointer ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-500/5'
              : inputMode === 'AUDIO'
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-neutral-800 bg-black/40 hover:border-neutral-600'
          }`}
        >
          <input
            type="file"
            accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center gap-2 py-3 text-center">
            <UploadCloud className={`w-5 h-5 ${isDragOver ? 'text-emerald-400' : 'text-neutral-500'}`} />
            <div className="text-[10px] font-mono uppercase tracking-widest text-white">AUDIO_DROP</div>
            {audioState.fileName ? (
              <div className="w-full flex flex-col items-center">
                <div className="text-[9px] font-mono text-emerald-400 truncate w-full px-2">
                  ▶ {audioState.fileName}
                </div>
              </div>
            ) : (
              <div className="text-[9px] font-mono text-neutral-600">
                Click or drag MP3 / WAV / OGG
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Audio Scrubber Component (Outside Drop Zone) */}
        {audioState.isFileActive && seekAudio && getPlaybackState && (
          <AudioScrubber 
            seekAudio={seekAudio} 
            getPlaybackState={getPlaybackState} 
            sampleAudio={sampleAudio}
          />
        )}

        {/* Stop All button */}
        {inputMode !== 'IDLE' && (
          <button
            onClick={onStop}
            className="w-full flex items-center justify-center gap-2 py-2.5 mb-4 border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-mono uppercase tracking-widest"
          >
            <Square className="w-3 h-3" /> DISCONNECT ALL
          </button>
        )}
      </div>

      {/* Preset Bank */}
      <div className="mb-6">
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 mb-4 pb-2 border-b border-neutral-900">
          PRESET_BANK
        </h2>
        <div className="flex flex-col gap-1.5">
          {(Object.keys(PRESETS) as PresetName[]).map(name => (
            <PresetButton
              key={name}
              name={name}
              isActive={currentPresetName === name}
              onClick={changePreset}
            />
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 mb-4 pb-2 border-b border-neutral-900">
          CAPTURE
        </h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleCapture}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors text-[10px] font-mono uppercase tracking-widest"
          >
            <Save className="w-4 h-4" /> SAVE SNAPSHOT
          </button>
          
          <button
            onClick={onToggleRecording}
            className={`w-full flex items-center justify-center gap-2 py-2.5 border transition-all text-[10px] font-mono uppercase tracking-widest relative overflow-hidden ${
              isRecording 
                ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse' 
                : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
            }`}
          >
            <Video className="w-4 h-4 relative z-10" /> 
            <span className="relative z-10">{isRecording ? 'STOP RECORDING' : 'RECORD VIDEO'}</span>
            {isRecording && (
              <div className="absolute inset-0 bg-red-500/5 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
