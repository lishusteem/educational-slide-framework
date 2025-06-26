/**
 * Comparison Layout Configuration
 * Side-by-side comparison presentation
 * Quick 5-second display as part of layout cycling
 */

import type { LayoutConfig } from '../../types/layout.types';

export const comparisonLayoutConfig: LayoutConfig = {
  id: 'comparison',
  name: 'Comparație',
  description: 'Comparație între sisteme tradiționale și blockchain',
  duration: 5000, // 5 seconds in milliseconds
  component: 'ComparisonLayout'
}; 