'use client';

import { useRef, useCallback, useState } from 'react';

export interface CameraState {
  isActive: boolean;
  error: string | null;
}

export const useCameraSignal = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>({ isActive: false, error: null });

  const startCamera = useCallback(async (): Promise<HTMLVideoElement | null> => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = () => reject(new Error('Video element failed'));
      });

      videoRef.current = video;
      setCameraState({ isActive: true, error: null });
      return video;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera access denied';
      console.error('[CameraSignal]', msg);
      setCameraState({ isActive: false, error: msg });
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    setCameraState({ isActive: false, error: null });
  }, []);

  /** Get the current video element for drawing. Returns null if camera isn't active. */
  const getVideoElement = useCallback((): HTMLVideoElement | null => {
    return videoRef.current;
  }, []);

  return { startCamera, stopCamera, getVideoElement, cameraState };
};
