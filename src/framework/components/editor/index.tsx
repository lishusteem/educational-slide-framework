import React from 'react';
import { ContentEditor } from '../../../presentation/components/ContentEditor';
import { usePresentation } from '../../../presentation/hooks/usePresentation';

export const SidebarEditorPanel: React.FC = () => {
  const { presentation, currentSlideIndex, updateSlide } = usePresentation();

  if (!presentation) return null;

  const slide = presentation.slides[currentSlideIndex];

  return (
    <ContentEditor
      slide={slide as any}
      onSlideUpdate={(updated) => updateSlide(slide.id, updated as any)}
    />
  );
}; 