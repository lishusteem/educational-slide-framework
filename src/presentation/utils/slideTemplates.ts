import type { SlideConfig } from '../../framework/types/slide.types';

export function createDefaultSlide(order: number): SlideConfig {
  return {
    id: `slide-${Date.now()}`,
    template: 'educational',
    content: {
      title: `Slide ${order + 1}`,
    } as any,
    theme: 'dark-blue' as any,
    audio: { src: '', duration: 30000 },
  } as SlideConfig;
} 