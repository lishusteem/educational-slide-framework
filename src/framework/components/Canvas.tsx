/**
 * Canvas Component - Exportable Slide Container
 * 16:9 aspect ratio container that holds the complete slide content for export
 * Preserves ALL existing visual functionality while being export-ready
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EducationalTemplate } from './templates/EducationalTemplate';
import { NavigationControls } from '../../presentation/components/NavigationControls';
import type { SlideConfig } from '../types/slide.types';

export interface CanvasProps {
  slide: SlideConfig;
  isPlaying?: boolean;
  currentTime?: number;
  showNavigation?: boolean;
  className?: string;
  onTimeUpdate?: (time: number) => void;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export const Canvas: React.FC<CanvasProps> = ({
  slide,
  isPlaying = false,
  currentTime = 0,
  showNavigation = true,
  className = '',
  onTimeUpdate,
  aspectRatio = '16:9'
}) => {
  
  const aspectRatioClasses = {
    '16:9': 'aspect-video', // 16:9
    '4:3': 'aspect-[4/3]',  // 4:3
    '1:1': 'aspect-square'   // 1:1
  };
  
  return (
    <motion.div 
      className={`relative w-full ${aspectRatioClasses[aspectRatio]} bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-lg overflow-hidden shadow-2xl ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Navigation Controls - Embedded in Canvas for Export */}
      <AnimatePresence>
        {showNavigation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 z-50"
          >
            <NavigationControls 
              isPlaying={isPlaying}
              currentTime={currentTime}
              onTimeUpdate={onTimeUpdate}
              embedded={true}
              size="compact"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Slide Content - Exactly as it works now */}
      <div className="w-full h-full">
        <EducationalTemplate 
          config={slide}
          isSlideActive={isPlaying}
          className="w-full h-full"
        />
      </div>
      
      {/* Canvas Export Metadata (Hidden in normal view) */}
      <div className="sr-only" data-canvas-meta>
        <div data-slide-id={slide.id} />
        <div data-slide-title={slide.content.title} />
        <div data-aspect-ratio={aspectRatio} />
        <div data-current-time={currentTime} />
      </div>
    </motion.div>
  );
};

// Higher-Order Component for easy Canvas wrapping
export function withCanvas<T extends CanvasProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  
  const WithCanvasComponent = (props: T) => {
    return (
      <Canvas {...props}>
        <WrappedComponent {...props} />
      </Canvas>
    );
  };

  WithCanvasComponent.displayName = `withCanvas(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithCanvasComponent;
}