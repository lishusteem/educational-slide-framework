/**
 * Definition Layout Configuration
 * Fixed display of blockchain definition (no internal carousel)
 * Quick 5-second display as part of layout cycling
 */

import type { LayoutConfig } from '../../types/layout.types';

export const definitionLayoutConfig: LayoutConfig = {
  id: 'definition',
  name: 'Definiție',
  description: 'Prezentare clasică cu definiția blockchain',
  duration: 5000, // 5 seconds in milliseconds
  component: 'DefinitionLayout'
}; 