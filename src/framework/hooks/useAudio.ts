/**
 * Clean Audio Hook for Slide Presentations
 * Simple, reliable audio management with presentation integration
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface AudioConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export interface AudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
}

export interface AudioControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

export function useAudio(config?: AudioConfig): AudioState & AudioControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isLoaded: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: config?.volume ?? 0.7,
    error: null
  });

  // Initialize audio when config changes
  useEffect(() => {
    if (!config?.src) {
      setState(prev => ({ ...prev, isLoaded: false, error: null }));
      return;
    }

    const audio = new Audio();
    audio.src = `/audio/${config.src}`;
    audio.volume = config.volume ?? 0.7;
    audio.preload = 'metadata';

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        isLoaded: true,
        duration: audio.duration,
        error: null
      }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      if (config.loop) {
        audio.currentTime = 0;
        audio.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    };

    const handleError = () => {
      setState(prev => ({
        ...prev,
        error: `Failed to load audio: ${config.src}`,
        isLoaded: false
      }));
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Auto-play if configured
    if (config.autoPlay) {
      audio.play().then(() => {
        setState(prev => ({ ...prev, isPlaying: true }));
      }).catch(() => {
        // Auto-play blocked, that's ok
      });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      if (!audio.paused) audio.pause();
      audioRef.current = null;
    };
  }, [config?.src, config?.volume, config?.loop, config?.autoPlay]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !state.isLoaded) return;

    try {
      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true, error: null }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Playback failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  }, [state.isLoaded]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !state.isLoaded) return;

    const clampedTime = Math.max(0, Math.min(state.duration, time));
    audio.currentTime = clampedTime;
    setState(prev => ({ ...prev, currentTime: clampedTime }));
  }, [state.isLoaded, state.duration]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    setState(prev => ({ ...prev, volume: clampedVolume }));
    
    if (audio) {
      audio.volume = clampedVolume;
    }
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    seek,
    setVolume
  };
}