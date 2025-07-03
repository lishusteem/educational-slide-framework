import { useState, useCallback } from 'react';

export const useAudioSync = () => {
  const [volume, setVolumeState] = useState(1);
  const setVolume = useCallback((v: number) => setVolumeState(v), []);
  const toggleMute = useCallback(() => {}, []);
  const seekTo = useCallback(() => {}, []);

  return {
    isLoaded: false,
    duration: 0,
    currentTime: 0,
    volume,
    isMuted: false,
    setVolume,
    toggleMute,
    seekTo,
    audioElement: null,
  };
}; 