/**
 * Audio Controls Component
 * Clean, integrated audio controls for presentations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';
import { useAudio } from '../../framework/hooks/useAudio';
import type { AudioConfig } from '../../framework/hooks/useAudio';

export interface AudioControlsProps {
  audioConfig?: AudioConfig;
  size?: 'compact' | 'normal' | 'large';
  className?: string;
  onTimeUpdate?: (time: number) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  audioConfig,
  size = 'normal',
  className = '',
  onTimeUpdate
}) => {
  const audio = useAudio(audioConfig);

  const sizeClasses = {
    compact: 'text-xs gap-1 p-2',
    normal: 'text-sm gap-2 p-3',
    large: 'text-base gap-3 p-4'
  };

  const iconSizes = {
    compact: 12,
    normal: 16,
    large: 20
  };

  // Sync with parent component
  React.useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(audio.currentTime);
    }
  }, [audio.currentTime, onTimeUpdate]);

  if (!audioConfig?.src) {
    return null; // No audio to control
  }

  const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center bg-gradient-to-r from-purple-900/80 to-indigo-900/80 
        backdrop-blur-md rounded-lg border border-purple-500/30 shadow-lg
        ${sizeClasses[size]} ${className}
      `}
    >
      {/* Audio Status Indicator */}
      <div className="flex items-center gap-1">
        {renderIcon('volume-2', { 
          size: iconSizes[size], 
          className: `${audio.isLoaded ? 'text-purple-300' : 'text-gray-500'}` 
        })}
        {!audio.isLoaded && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
        {audio.error && (
          <div className="w-2 h-2 bg-red-400 rounded-full" title={audio.error} />
        )}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={audio.isPlaying ? audio.pause : audio.play}
        disabled={!audio.isLoaded}
        className="text-white hover:text-purple-300 disabled:text-gray-500 transition-colors"
        title={audio.isPlaying ? 'Pause Audio' : 'Play Audio'}
      >
        {renderIcon(audio.isPlaying ? 'pause' : 'play', { size: iconSizes[size] })}
      </button>

      {/* Stop Button */}
      <button
        onClick={audio.stop}
        disabled={!audio.isLoaded}
        className="text-white/80 hover:text-white disabled:text-gray-500 transition-colors"
        title="Stop Audio"
      >
        {renderIcon('square', { size: iconSizes[size] })}
      </button>

      {/* Progress & Time (only if not compact) */}
      {size !== 'compact' && audio.isLoaded && (
        <div className="flex items-center gap-2 ml-2">
          {/* Progress Bar */}
          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          
          {/* Time Display */}
          <span className="text-white/60 font-mono text-xs min-w-0">
            {formatTime(audio.currentTime)}/{formatTime(audio.duration)}
          </span>
        </div>
      )}

      {/* Volume Control (only if large) */}
      {size === 'large' && (
        <div className="flex items-center gap-1 ml-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audio.volume}
            onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white/60 text-xs min-w-0">
            {Math.round(audio.volume * 100)}%
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Utility function to format time in MM:SS
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}