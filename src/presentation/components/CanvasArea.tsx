import React from 'react';
import { usePresentation } from '../hooks/usePresentation';
import { Canvas } from '../../framework/components/Canvas';

export const CanvasArea: React.FC = () => {
  const { presentation, currentSlideIndex } = usePresentation();

  if (!presentation) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        No presentation loaded
      </div>
    );
  }

  const slide = presentation.slides[currentSlideIndex];

  return (
    <Canvas slide={slide as any} isPlaying={false} currentTime={0} />
  );
}; 