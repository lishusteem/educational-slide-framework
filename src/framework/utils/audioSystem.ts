/**
 * Audio System for Educational Slides
 * Manages audio playback with play/pause/stop controls
 * Independent of layout cycling system
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SlideAudio } from '../types/slide.types';

export type AudioState = 'loading' | 'ready' | 'playing' | 'paused' | 'stopped' | 'error';

export interface AudioSystemState {
  state: AudioState;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export interface AudioSystemControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

export interface UseAudioSystemOptions {
  audioConfig?: SlideAudio;
  isSlideActive?: boolean;
}

export const useAudioSystem = ({
  audioConfig,
  isSlideActive = true
}: UseAudioSystemOptions = {}): AudioSystemState & AudioSystemControls => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>('ready');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [error, setError] = useState<string | null>(null);

  // Initialize audio element when config changes
  useEffect(() => {
    if (!audioConfig?.src) {
      setState('ready');
      return;
    }

    setState('loading');
    setError(null);

    // Create new audio element
    const audio = new Audio(`/audio/${audioConfig.src}`);
    audio.preload = 'metadata';
    audio.volume = audioConfig.volume ?? 0.8;
    setVolumeState(audioConfig.volume ?? 0.8);

    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setState('ready');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setState('stopped');
      setCurrentTime(0);
      
      // Handle loop
      if (audioConfig.loop) {
        audio.currentTime = 0;
        audio.play();
        setState('playing');
      }
    };

    const handleError = () => {
      setError(`Failed to load audio: ${audioConfig.src}`);
      setState('error');
    };

    const handleCanPlay = () => {
      setState('ready');
      
      // Auto-play if configured and slide is active
      if (audioConfig.autoPlay && isSlideActive) {
        audio.play();
        setState('playing');
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      
      if (!audio.paused) {
        audio.pause();
      }
      audioRef.current = null;
    };
  }, [audioConfig?.src, audioConfig?.volume, audioConfig?.loop, audioConfig?.autoPlay, isSlideActive]);

  // Control functions
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || state === 'loading' || state === 'error') return;

    audio.play()
      .then(() => {
        setState('playing');
      })
      .catch((err) => {
        setError(`Playback failed: ${err.message}`);
        setState('error');
      });
  }, [state]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || state !== 'playing') return;

    audio.pause();
    setState('paused');
  }, [state]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setState('stopped');
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    setVolumeState(clampedVolume);
    
    if (audio) {
      audio.volume = clampedVolume;
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const clampedTime = Math.max(0, Math.min(duration, time));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, [duration]);

  // Pause audio when slide becomes inactive
  useEffect(() => {
    if (!isSlideActive && state === 'playing') {
      pause();
    }
  }, [isSlideActive, state, pause]);

  return {
    // State
    state,
    currentTime,
    duration,
    volume,
    isLoading: state === 'loading',
    error,
    
    // Controls
    play,
    pause,
    stop,
    setVolume,
    seek
  };
}; 