/**
 * Properties Grid Layout Configuration
 * Grid presentation of vocabulary and concepts
 * Quick 5-second display as part of layout cycling
 */

import type { LayoutConfig } from '../../types/layout.types';

export const propertiesGridLayoutConfig: LayoutConfig = {
  id: 'properties-grid',
  name: 'Grid Proprietăți',
  description: 'Prezentare în grilă a vocabularului și conceptelor',
  duration: 5000, // 5 seconds in milliseconds
  component: 'PropertiesGridLayout'
}; 