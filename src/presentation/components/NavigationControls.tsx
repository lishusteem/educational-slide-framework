/**
 * Navigation Controls Component
 * Embedded slide navigation with play/pause, next/prev, and progress indicator
 */

import React from 'react';
import { motion } from 'framer-motion';
import { renderIcon } from '../../framework/utils/iconRegistry';

export interface NavigationControlsProps {
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onTimeUpdate?: (time: number) => void;
  embedded?: boolean;
  size?: 'compact' | 'normal' | 'large';
  className?: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onTimeUpdate: _onTimeUpdate,
  embedded = false,
  size = 'normal',
  className = ''
}) => {
  
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
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center bg-black/70 backdrop-blur-md rounded-lg border border-white/20 shadow-lg
        ${sizeClasses[size]} ${className}
      `}
    >
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!onPrevious}
        className="text-white/80 hover:text-white disabled:text-white/30 transition-colors"
        title="Previous Slide"
      >
        {renderIcon('skip-back', { size: iconSizes[size] })}
      </button>
      
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!onPlay && !onPause}
        className="text-white hover:text-blue-300 disabled:text-white/30 transition-colors"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {renderIcon(isPlaying ? 'pause' : 'play', { size: iconSizes[size] })}
      </button>
      
      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!onNext}
        className="text-white/80 hover:text-white disabled:text-white/30 transition-colors"
        title="Next Slide"
      >
        {renderIcon('skip-forward', { size: iconSizes[size] })}
      </button>
      
      {/* Progress Indicator (only if not compact) */}
      {size !== 'compact' && duration > 0 && (
        <div className="flex items-center gap-2 ml-2">
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <span className="text-white/60 font-mono text-xs min-w-0">
            {formatTime(currentTime)}/{formatTime(duration)}
          </span>
        </div>
      )}
      
      {/* Embedded indicator */}
      {embedded && (
        <div className="w-1 h-1 bg-blue-400 rounded-full ml-1" title="Embedded Mode" />
      )}
    </motion.div>
  );
};

// Utility function to format time in MM:SS
function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}