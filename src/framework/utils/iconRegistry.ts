/**
 * Icon Registry for the Educational Slide Framework
 * Manages Lucide React icons with consistent naming and fallbacks
 */

import React from 'react';
import {
  // Common icons
  Hash,
  Server,
  Users,
  Network,
  Lock,
  Eye,
  Shield,
  Wallet,
  Pickaxe,
  ArrowLeftRight,
  Calculator,
  Book,
  BarChart3,
  Globe,
  Star,
  Heart,
  Zap,
  Diamond,
  Code,
  Database,
  Link,
  Box,
  // UI icons
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
  Maximize,
  Minimize,
  X,
  Settings,
  Edit3,
  Plus,
  RefreshCcw,
  Type,
  List,
  LayoutGrid,
  Loader2,
  // Content icons
  FileText,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Layers
} from 'lucide-react';

// Icon name mapping
export const ICON_REGISTRY = {
  // Blockchain & Crypto
  'hash': Hash,
  'server': Server,
  'users': Users,
  'network': Network,
  'lock': Lock,
  'eye': Eye,
  'shield': Shield,
  'wallet': Wallet,
  'pickaxe': Pickaxe,
  'arrows-exchange': ArrowLeftRight,
  'calculator': Calculator,
  'chain': Link,
  'box': Box,
  
  // General
  'book': Book,
  'chart': BarChart3,
  'globe': Globe,
  'star': Star,
  'heart': Heart,
  'lightning': Zap,
  'diamond': Diamond,
  'code': Code,
  'database': Database,
  
  // UI Controls
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'play': Play,
  'pause': Pause,
  'square': Square,
  'maximize': Maximize,
  'minimize': Minimize,
  'close': X,
  'x': X,
  'settings': Settings,
  'edit-3': Edit3,
  'plus': Plus,
  'refresh-ccw': RefreshCcw,
  'type': Type,
  'list': List,
  'layout-grid': LayoutGrid,
  'loader-2': Loader2,
  
  // Content
  'file-text': FileText,
  'info': Info,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'help-circle': HelpCircle,
  'lightbulb': Lightbulb,
  'target': Target,
  'trending-up': TrendingUp,
  'layers': Layers
} as const;

export type IconName = keyof typeof ICON_REGISTRY;

/**
 * Get icon component by name
 */
export function getIcon(name: IconName | string): React.ComponentType<any> | null {
  if (name in ICON_REGISTRY) {
    return ICON_REGISTRY[name as IconName];
  }
  
  console.warn(`Icon "${name}" not found in registry. Available icons:`, Object.keys(ICON_REGISTRY));
  return null;
}

/**
 * Check if icon exists in registry
 */
export function hasIcon(name: string): name is IconName {
  return name in ICON_REGISTRY;
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(ICON_REGISTRY) as IconName[];
}

/**
 * Render icon with fallback
 */
export function renderIcon(
  name: IconName | string, 
  props: { 
    size?: number | string; 
    className?: string; 
    color?: string;
  } = {}
): React.ReactElement | null {
  const IconComponent = getIcon(name);
  
  if (!IconComponent) {
    // Fallback to a generic icon or placeholder
    return React.createElement('div', {
      className: `w-4 h-4 bg-gray-400 rounded ${props.className || ''}`,
      style: { 
        width: props.size || '1rem', 
        height: props.size || '1rem',
        backgroundColor: props.color || '#9ca3af'
      }
    });
  }
  
  return React.createElement(IconComponent, {
    size: props.size || 16,
    className: props.className || '',
    color: props.color
  });
}

/**
 * Icon categories for easier organization
 */
export const ICON_CATEGORIES = {
  blockchain: ['hash', 'server', 'network', 'lock', 'shield', 'wallet', 'pickaxe', 'arrows-exchange', 'box', 'chain'] as IconName[],
  general: ['book', 'chart', 'globe', 'star', 'heart', 'lightning', 'diamond', 'code', 'database'] as IconName[],
  ui: ['chevron-left', 'chevron-right', 'play', 'pause', 'square', 'maximize', 'minimize', 'close', 'x', 'settings', 'edit-3', 'plus', 'refresh-ccw', 'type', 'list', 'layout-grid', 'loader-2'] as IconName[],
  content: ['file-text', 'info', 'check-circle', 'alert-circle', 'help-circle', 'lightbulb', 'target', 'trending-up', 'layers'] as IconName[]
};

/**
 * Get icons by category
 */
export function getIconsByCategory(category: keyof typeof ICON_CATEGORIES): IconName[] {
  return ICON_CATEGORIES[category] || [];
} 