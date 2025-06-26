/**
 * Theme system type definitions for the Educational Slide Framework
 */

export type ThemeName = 
  | 'dark-blue'
  | 'purple-cosmic'
  | 'green-nature'
  | 'orange-energy'
  | 'minimal-light';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  vocabulary: string;
  concepts: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  shadow: string;
}

export interface ThemeConfig {
  name: ThemeName;
  colors: ThemeColors;
  gradients: {
    background: string;
    card: string;
    accent: string;
  };
  animation: {
    duration: string;
    easing: string;
  };
}

export interface ThemeVariant {
  base: ThemeName;
  overrides: Partial<ThemeColors>;
}

export type ThemeOrVariant = ThemeName | ThemeConfig | ThemeVariant; 