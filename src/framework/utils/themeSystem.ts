/**
 * Theme System Utility for the Educational Slide Framework
 * Provides theme configurations and utility functions
 */

import type { ThemeConfig, ThemeName, ThemeVariant, ThemeOrVariant } from '../types/theme.types';

// Core theme configurations
export const THEMES: Record<ThemeName, ThemeConfig> = {
  'dark-blue': {
    name: 'dark-blue',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#f59e0b',
      background: '#0f172a',
      vocabulary: 'text-amber-300',
      concepts: 'text-orange-300',
      text: {
        primary: '#ffffff',
        secondary: '#e2e8f0',
        muted: '#94a3b8'
      },
      border: 'border-blue-600/30',
      shadow: 'shadow-blue-900/50'
    },
    gradients: {
      background: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
      card: 'bg-gradient-to-br from-slate-700/80 to-blue-800/70',
      accent: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600'
    },
    animation: {
      duration: '0.8s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },

  'purple-cosmic': {
    name: 'purple-cosmic',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#06b6d4',
      background: '#1e1b4b',
      vocabulary: 'text-cyan-300',
      concepts: 'text-purple-300',
      text: {
        primary: '#ffffff',
        secondary: '#e0e7ff',
        muted: '#a5b4fc'
      },
      border: 'border-purple-600/30',
      shadow: 'shadow-purple-900/50'
    },
    gradients: {
      background: 'bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900',
      card: 'bg-gradient-to-br from-slate-700/80 to-purple-800/70',
      accent: 'bg-gradient-to-r from-purple-400 via-violet-500 to-cyan-500'
    },
    animation: {
      duration: '0.7s',
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    }
  },

  'green-nature': {
    name: 'green-nature',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#064e3b',
      vocabulary: 'text-yellow-300',
      concepts: 'text-green-300',
      text: {
        primary: '#ffffff',
        secondary: '#d1fae5',
        muted: '#6ee7b7'
      },
      border: 'border-green-600/30',
      shadow: 'shadow-green-900/50'
    },
    gradients: {
      background: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
      card: 'bg-gradient-to-br from-slate-700/80 to-green-800/70',
      accent: 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500'
    },
    animation: {
      duration: '0.9s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },

  'orange-energy': {
    name: 'orange-energy',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#eab308',
      background: '#7c2d12',
      vocabulary: 'text-yellow-300',
      concepts: 'text-orange-300',
      text: {
        primary: '#ffffff',
        secondary: '#fed7aa',
        muted: '#fdba74'
      },
      border: 'border-orange-600/30',
      shadow: 'shadow-orange-900/50'
    },
    gradients: {
      background: 'bg-gradient-to-br from-orange-900 via-red-800 to-yellow-900',
      card: 'bg-gradient-to-br from-slate-700/80 to-orange-800/70',
      accent: 'bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500'
    },
    animation: {
      duration: '0.6s',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  'minimal-light': {
    name: 'minimal-light',
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#f9fafb',
      vocabulary: 'text-blue-600',
      concepts: 'text-gray-700',
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6b7280'
      },
      border: 'border-gray-300',
      shadow: 'shadow-gray-200'
    },
    gradients: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
      card: 'bg-gradient-to-br from-white/80 to-gray-100/70',
      accent: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
    },
    animation: {
      duration: '0.5s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  }
};

/**
 * Get theme configuration by name
 */
export function getTheme(themeName: ThemeName): ThemeConfig {
  return THEMES[themeName];
}

/**
 * Create a theme variant with overrides
 */
export function createThemeVariant(base: ThemeName, overrides: Partial<ThemeConfig['colors']>): ThemeVariant {
  return {
    base,
    overrides
  };
}

/**
 * Apply theme variant to get final theme config
 */
export function applyThemeVariant(variant: ThemeVariant): ThemeConfig {
  const baseTheme = getTheme(variant.base);
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...variant.overrides
    }
  };
}

/**
 * Resolve theme from ThemeOrVariant type
 */
export function resolveTheme(theme: ThemeOrVariant): ThemeConfig {
  if (typeof theme === 'string') {
    return getTheme(theme);
  }
  
  if ('base' in theme) {
    return applyThemeVariant(theme);
  }
  
  return theme;
}

/**
 * Get CSS classes for a specific theme
 */
export function getThemeClasses(theme: ThemeOrVariant) {
  const resolved = resolveTheme(theme);
  
  return {
    background: resolved.gradients.background,
    card: resolved.gradients.card,
    accent: resolved.gradients.accent,
    border: resolved.colors.border,
    shadow: resolved.colors.shadow,
    vocabulary: resolved.colors.vocabulary,
    concepts: resolved.colors.concepts,
    textPrimary: resolved.colors.text.primary,
    textSecondary: resolved.colors.text.secondary,
    textMuted: resolved.colors.text.muted
  };
}

/**
 * Validate if theme name exists
 */
export function isValidTheme(themeName: string): themeName is ThemeName {
  return themeName in THEMES;
}

/**
 * Get all available theme names
 */
export function getAvailableThemes(): ThemeName[] {
  return Object.keys(THEMES) as ThemeName[];
} 