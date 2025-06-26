/**
 * Animation Presets for the Educational Slide Framework
 * Provides pre-configured animation variants and utility functions
 */

import type { AnimationPreset, SlideAnimationConfig } from '../types/animation.types';

// Standard easing curves
const EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  bouncy: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  linear: [0, 0, 1, 1] as [number, number, number, number]
};

// Animation preset configurations
export const ANIMATION_PRESETS: Record<AnimationPreset, SlideAnimationConfig> = {
  'smooth-3d': {
    container: {
      hidden: { opacity: 0, y: 30, rotateX: -15 },
      visible: { 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.8,
          staggerChildren: 0.15,
          ease: EASING.smooth
        }
      }
    },
    item: {
      hidden: { opacity: 0, x: -30, scale: 0.8 },
      visible: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: { 
          duration: 0.6,
          ease: EASING.smooth
        }
      },
      hover: {
        scale: 1.02, 
        rotateY: 1,
        boxShadow: "0 16px 48px rgba(30, 58, 138, 0.25)",
        transition: { 
          duration: 0.4, 
          ease: EASING.smooth
        }
      }
    },
    stagger: 0.15,
    duration: 0.8,
    easing: EASING.smooth
  },

  'floating': {
    container: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1,
          ease: EASING.smooth
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          ease: EASING.smooth
        }
      },
      hover: {
        y: -4,
        transition: { 
          duration: 0.3, 
          ease: EASING.smooth
        }
      }
    },
    stagger: 0.1,
    duration: 0.6,
    easing: EASING.smooth
  },

  'minimal': {
    container: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.4,
          staggerChildren: 0.05,
          ease: EASING.linear
        }
      }
    },
    item: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.3,
          ease: EASING.linear
        }
      },
      hover: {
        opacity: 0.8,
        transition: { 
          duration: 0.2, 
          ease: EASING.linear
        }
      }
    },
    stagger: 0.05,
    duration: 0.4,
    easing: EASING.linear
  },

  'energetic': {
    container: {
      hidden: { opacity: 0, scale: 0.8, rotate: -5 },
      visible: { 
        opacity: 1, 
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0.7,
          staggerChildren: 0.08,
          ease: EASING.bouncy
        }
      }
    },
    item: {
      hidden: { opacity: 0, scale: 0.5, rotate: 10 },
      visible: { 
        opacity: 1, 
        scale: 1,
        rotate: 0,
        transition: { 
          duration: 0.6,
          ease: EASING.bouncy
        }
      },
      hover: {
        scale: 1.1,
        rotate: 5,
        transition: { 
          duration: 0.3, 
          ease: EASING.bouncy
        }
      }
    },
    stagger: 0.08,
    duration: 0.7,
    easing: EASING.bouncy
  },

  'professional': {
    container: {
      hidden: { opacity: 0, y: 15 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.5,
          staggerChildren: 0.12,
          ease: EASING.smooth
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 15 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.4,
          ease: EASING.smooth
        }
      },
      hover: {
        y: -2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        transition: { 
          duration: 0.3, 
          ease: EASING.smooth
        }
      }
    },
    stagger: 0.12,
    duration: 0.5,
    easing: EASING.smooth
  }
};

// Special animation variants for specific components
export const FLOATING_ICON_ANIMATION = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const BACKGROUND_ANIMATIONS = {
  orb1: {
    scale: [1, 1.2, 1], 
    rotate: [0, 180, 360],
    transition: { 
      duration: 20, 
      repeat: Infinity, 
      ease: "linear" 
    }
  },
  orb2: {
    scale: [1.2, 1, 1.2], 
    rotate: [360, 180, 0],
    transition: { 
      duration: 25, 
      repeat: Infinity, 
      ease: "linear" 
    }
  },
  orb3: {
    scale: [1, 1.3, 1], 
    x: [-50, 50, -50], 
    y: [-50, 50, -50],
    transition: { 
      duration: 15, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

/**
 * Get animation configuration for a specific preset
 */
export function getAnimationPreset(preset: AnimationPreset): SlideAnimationConfig {
  return ANIMATION_PRESETS[preset];
}

/**
 * Create custom animation variants with performance considerations
 */
export function createCustomVariants(
  preset: AnimationPreset,
  overrides: Partial<SlideAnimationConfig>
): SlideAnimationConfig {
  const base = getAnimationPreset(preset);
  return {
    ...base,
    ...overrides,
    container: {
      ...base.container,
      ...overrides.container
    },
    item: {
      ...base.item,
      ...overrides.item
    }
  };
}

/**
 * Get reduced motion variants for accessibility
 */
export function getReducedMotionVariants(_preset: AnimationPreset): SlideAnimationConfig {
  // const base = getAnimationPreset(preset);
  
  return {
    container: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          duration: 0.2,
          staggerChildren: 0.05
        }
      }
    },
    item: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.15 }
      },
      hover: {
        opacity: 0.8,
        transition: { duration: 0.1 }
      }
    },
    stagger: 0.05,
    duration: 0.2,
    easing: EASING.linear
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation config with accessibility considerations
 */
export function getAccessibleAnimation(preset: AnimationPreset): SlideAnimationConfig {
  if (prefersReducedMotion()) {
    return getReducedMotionVariants(preset);
  }
  return getAnimationPreset(preset);
} 