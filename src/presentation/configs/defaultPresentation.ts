import { createDefaultSlide } from '../utils/slideTemplates';
import type { PresentationConfig } from '../types/presentation.types';

export const defaultPresentation: PresentationConfig = {
  id: 'default',
  title: 'Sample Presentation',
  description: 'A quick demo slide',
  version: '1.0.0',
  theme: 'dark-blue',
  aspectRatio: '16:9',
  slides: [createDefaultSlide(0)],
  settings: {
    autoPlay: false,
    loop: false,
    showProgress: true,
    showNavigation: true,
    allowUserControl: true,
    transitionDuration: 500,
  },
}; 