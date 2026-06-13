'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { usePlaygroundState } from '../../hooks/usePlaygroundState';
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer';
import { useCameraSignal } from '../../hooks/useCameraSignal';

import { CommandBar } from './CommandBar';
import { ControlDeck } from './ControlDeck';
import { ModulePanel } from './ModulePanel';
import { VisualStage } from './VisualStage';
import { SignalStrip } from './SignalStrip';

export const PlaygroundShell = () => {
  const {
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
  } = usePlaygroundState();

  const { startMic, playAudioFile, stopAll: stopAudio, sampleAudio, updateAudioFilters, getAudioDestinationStream, seekAudio, getPlaybackState, state: audioState } = useAudioAnalyzer();
  const { startCamera, stopCamera, getVideoElement, cameraState } = useCameraSignal();
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Update Audio Filters when slider changes
  useEffect(() => {
    // We map 'grain' slider to the lowpass filter amount
    updateAudioFilters(presetSettings.distortion, presetSettings.grain);
  }, [presetSettings.distortion, presetSettings.grain, updateAudioFilters]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopCamera();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [stopAudio, stopCamera]);

  // Mouse / touch tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      updateMouse(
        (e.clientX - rect.left) / rect.width,
        (e.clientY - rect.top) / rect.height
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = container.getBoundingClientRect();
      updateMouse(
        (touch.clientX - rect.left) / rect.width,
        (touch.clientY - rect.top) / rect.height
      );
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [updateMouse]);

  // MediaRecorder Logic
  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        addLog('VIDEO RECORDING STOPPED. PROCESSING...');
      }
      setIsRecording(false);
      return;
    }

    const canvas = document.querySelector('canvas');
    if (!canvas) {
      addLog('[ERR] CANVAS NOT FOUND FOR RECORDING');
      return;
    }

    try {
      // 1. Get Canvas Stream (60fps)
      const canvasStream = canvas.captureStream(60);
      const combinedStream = new MediaStream();

      // 2. Add Video Tracks
      canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

      // 3. Add Audio Tracks (if we have an active audio context destination stream)
      if (inputMode !== 'IDLE') {
        const audioStream = getAudioDestinationStream();
        if (audioStream) {
           audioStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
        }
      }

      const options = { mimeType: 'video/webm; codecs=vp9' };
      const recorder = new MediaRecorder(combinedStream, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);
      
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `sonic_velocity_capture_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        addLog('VIDEO SAVED TO DISK');
      };

      recorder.start(100); // collect 100ms chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      addLog('VIDEO RECORDING STARTED');
    } catch (err) {
      console.error(err);
      addLog('[ERR] RECORDING FAILED');
      setIsRecording(false);
    }
  }, [isRecording, addLog, getAudioDestinationStream, inputMode]);

  const handleMicToggle = useCallback(async () => {
    if (inputMode === 'MIC') {
      stopAudio();
      setInputMode('IDLE');
      addLog('MIC_STREAM DISCONNECTED');
    } else {
      stopAudio();
      stopCamera();
      addLog('REQUESTING MIC_ACCESS...');
      const success = await startMic();
      if (success) {
        setInputMode('MIC');
        addLog('MIC_STREAM ACTIVE — LISTENING');
      } else {
        setInputMode('IDLE');
        addLog('[WARN] MIC_ACCESS DENIED');
      }
    }
  }, [inputMode, startMic, stopAudio, stopCamera, addLog, setInputMode]);

  const handleCameraToggle = useCallback(async () => {
    if (inputMode === 'CAMERA') {
      stopCamera();
      setInputMode('IDLE');
      addLog('CAMERA_SIGNAL DISCONNECTED');
    } else {
      stopCamera();
      addLog('REQUESTING CAMERA_ACCESS...');
      const video = await startCamera();
      if (video) {
        setInputMode('CAMERA');
        addLog('CAMERA_SIGNAL ACTIVE');
      } else {
        setInputMode('IDLE');
        addLog('[WARN] CAMERA_ACCESS DENIED');
      }
    }
  }, [inputMode, startCamera, stopCamera, addLog, setInputMode]);

  const handleAudioUpload = useCallback(async (file: File) => {
    stopAudio();
    stopCamera();
    addLog(`LOADING_AUDIO: ${file.name.toUpperCase()}`);
    const success = await playAudioFile(file);
    if (success) {
      setInputMode('AUDIO');
      addLog('AUDIO_BUS PLAYING');
    } else {
      addLog('[ERR] AUDIO_DECODE FAILED');
    }
  }, [playAudioFile, stopAudio, stopCamera, addLog, setInputMode]);

  const handleStopAudio = useCallback(() => {
    stopAudio();
    stopCamera();
    setInputMode('IDLE');
    addLog('ALL SIGNALS DISCONNECTED — SYNTHETIC_SIGNAL RUNNING');
  }, [stopAudio, stopCamera, setInputMode, addLog]);

  return (
    <div ref={containerRef} className="fixed inset-0 flex flex-col w-full bg-black text-white overflow-hidden z-[100]" style={{ fontFamily: 'var(--font-mono), monospace' }}>
      <CommandBar inputMode={inputMode} />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Control Deck (desktop) */}
        <div className="w-60 shrink-0 hidden lg:block border-r border-neutral-900">
          <ControlDeck preset={presetSettings} updateSetting={updateSetting} />
        </div>

        {/* Center: Visual Stage */}
        <div className="flex-1 relative bg-black min-w-0">
          <VisualStage
            preset={presetSettings}
            sampleAudio={sampleAudio}
            getVideoElement={getVideoElement}
            inputMode={inputMode}
            getMouse={getMouse}
          />
        </div>

        {/* Right: Module Panel (desktop) */}
        <div className="w-64 shrink-0 hidden lg:block border-l border-neutral-900">
          <ModulePanel
            inputMode={inputMode}
            setInputMode={setInputMode}
            currentPresetName={currentPresetName}
            changePreset={changePreset}
            onMicToggle={handleMicToggle}
            onCameraToggle={handleCameraToggle}
            onAudioUpload={handleAudioUpload}
            onStop={handleStopAudio}
            audioState={audioState}
            cameraState={cameraState}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            seekAudio={seekAudio}
            getPlaybackState={getPlaybackState}
            sampleAudio={sampleAudio}
          />
        </div>
      </div>

      <SignalStrip logs={logs} inputMode={inputMode} currentPresetName={currentPresetName} />

      {/* Mobile Controls Drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="fixed bottom-12 right-4 z-50 w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white text-lg font-mono"
          aria-label="Toggle controls"
        >
          {mobileDrawerOpen ? '✕' : '≡'}
        </button>
        {mobileDrawerOpen && (
          <div className="fixed inset-x-0 bottom-12 top-auto z-40 max-h-[60vh] overflow-y-auto bg-black/95 backdrop-blur-md border-t border-neutral-800">
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ModulePanel
                  inputMode={inputMode}
                  setInputMode={setInputMode}
                  currentPresetName={currentPresetName}
                  changePreset={changePreset}
                  onMicToggle={handleMicToggle}
                  onCameraToggle={handleCameraToggle}
                  onAudioUpload={handleAudioUpload}
                  onStop={handleStopAudio}
                  audioState={audioState}
                  cameraState={cameraState}
                  isRecording={isRecording}
                  onToggleRecording={handleToggleRecording}
                  seekAudio={seekAudio}
                  getPlaybackState={getPlaybackState}
                  sampleAudio={sampleAudio}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
