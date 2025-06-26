/**
 * Layout Registry
 * Maps layout component identifiers to their actual React components
 */

import type { BaseLayoutProps } from '../types/layout.types';
import { DefinitionLayout } from './definition-layout/DefinitionLayout';
import { PropertiesGridLayout } from './properties-grid-layout/PropertiesGridLayout';
import { ComparisonLayout } from './comparison-layout/ComparisonLayout';

export interface LayoutComponentMap {
  [key: string]: React.FC<BaseLayoutProps>;
}

export const layoutRegistry: LayoutComponentMap = {
  'DefinitionLayout': DefinitionLayout,
  'PropertiesGridLayout': PropertiesGridLayout,
  'ComparisonLayout': ComparisonLayout
};

export const getLayoutComponent = (componentId: string): React.FC<BaseLayoutProps> | null => {
  return layoutRegistry[componentId] || null;
};

// Export layout configurations
export { definitionLayoutConfig } from './definition-layout/definitionLayout.config';
export { propertiesGridLayoutConfig } from './properties-grid-layout/propertiesGridLayout.config';
export { comparisonLayoutConfig } from './comparison-layout/comparisonLayout.config'; 