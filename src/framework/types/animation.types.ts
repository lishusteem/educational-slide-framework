/**
 * Animation system type definitions for the Educational Slide Framework
 */

export type AnimationPreset = 
  | 'smooth-3d'
  | 'floating'
  | 'minimal'
  | 'energetic'
  | 'professional';

export interface AnimationConfig {
  preset: AnimationPreset;
  duration: number;
  easing: string;
  stagger: number;
  performance: 'low' | 'medium' | 'high';
}

export interface AnimationVariants {
  hidden: Record<string, any>;
  visible: Record<string, any>;
  hover?: Record<string, any>;
  tap?: Record<string, any>;
}

export interface SlideAnimationConfig {
  container: AnimationVariants;
  item: AnimationVariants;
  stagger: number;
  duration: number;
  easing: [number, number, number, number];
}

export interface AnimationSettings {
  reducedMotion: boolean;
  performanceMode: 'low' | 'medium' | 'high';
  customEasing: [number, number, number, number];
} 