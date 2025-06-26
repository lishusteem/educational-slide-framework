/**
 * Audio Controls Component
 * Provides play/pause/stop controls for slide audio narration
 * Positioned in top-left corner, persistent across all layouts
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renderIcon } from '../../utils/iconRegistry';
import { useAudioSystem } from '../../utils/audioSystem';
import type { SlideAudio } from '../../types/slide.types';

interface AudioControlsProps {
  audioConfig?: SlideAudio;
  isSlideActive?: boolean;
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  audioConfig,
  isSlideActive = true,
  className = ''
}) => {
  const audioSystem = useAudioSystem({
    audioConfig,
    isSlideActive
  });

  // Don't render if no audio config
  if (!audioConfig?.src) {
    return null;
  }

  const { state, play, pause, stop, error } = audioSystem;

  const getPlayButtonState = () => {
    switch (state) {
      case 'playing':
        return { icon: 'pause', action: pause, disabled: false };
      case 'paused':
      case 'stopped':
      case 'ready':
        return { icon: 'play', action: play, disabled: false };
      case 'loading':
        return { icon: 'loader-2', action: () => {}, disabled: true };
      case 'error':
        return { icon: 'alert-circle', action: () => {}, disabled: true };
      default:
        return { icon: 'play', action: play, disabled: false };
    }
  };

  const playButtonState = getPlayButtonState();

  return (
    <motion.div 
      className={`fixed top-4 left-4 z-50 flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
    >
      {/* Main Controls Container */}
      <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl p-1">
        
        {/* Play/Pause Button */}
        <motion.button
          onClick={playButtonState.action}
          disabled={playButtonState.disabled}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            playButtonState.disabled
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              : state === 'playing'
              ? 'bg-orange-500/90 hover:bg-orange-400 text-white'
              : 'bg-green-500/90 hover:bg-green-400 text-white'
          }`}
          whileHover={!playButtonState.disabled ? { scale: 1.05 } : {}}
          whileTap={!playButtonState.disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            animate={state === 'loading' ? { rotate: 360 } : {}}
            transition={state === 'loading' ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            {renderIcon(playButtonState.icon as any, { size: 14 })}
          </motion.div>
        </motion.button>

        {/* Stop Button */}
        <motion.button
          onClick={stop}
          disabled={state === 'loading' || state === 'error' || state === 'stopped'}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            state === 'loading' || state === 'error' || state === 'stopped'
              ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
              : 'bg-red-500/90 hover:bg-red-400 text-white'
          }`}
          whileHover={state !== 'loading' && state !== 'error' && state !== 'stopped' ? { scale: 1.05 } : {}}
          whileTap={state !== 'loading' && state !== 'error' && state !== 'stopped' ? { scale: 0.95 } : {}}
        >
          {renderIcon('square', { size: 14 })}
        </motion.button>

        {/* Audio Status Indicator */}
        <div className="w-2 h-6 flex flex-col justify-center ml-1">
          <AnimatePresence>
            {state === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-0.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-green-400 rounded-full"
                    animate={{ 
                      height: [2, 6, 2],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-red-500/90 backdrop-blur-lg rounded-lg border border-red-400/20 shadow-lg px-3 py-2 max-w-64"
          >
            <div className="flex items-center gap-2">
              {renderIcon('alert-circle', { size: 14, className: 'text-white flex-shrink-0' })}
              <span className="text-white text-xs font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 