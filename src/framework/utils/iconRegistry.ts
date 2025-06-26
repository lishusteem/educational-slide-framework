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
  // UI icons
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize,
  Minimize,
  X,
  Settings,
  // Content icons
  FileText,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Target,
  TrendingUp
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
  'maximize': Maximize,
  'minimize': Minimize,
  'close': X,
  'settings': Settings,
  
  // Content
  'file-text': FileText,
  'info': Info,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  'help-circle': HelpCircle,
  'lightbulb': Lightbulb,
  'target': Target,
  'trending-up': TrendingUp
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
  blockchain: ['hash', 'server', 'network', 'lock', 'shield', 'wallet', 'pickaxe', 'arrows-exchange'] as IconName[],
  general: ['book', 'chart', 'globe', 'star', 'heart', 'lightning', 'diamond', 'code', 'database'] as IconName[],
  ui: ['chevron-left', 'chevron-right', 'play', 'pause', 'maximize', 'minimize', 'close', 'settings'] as IconName[],
  content: ['file-text', 'info', 'check-circle', 'alert-circle', 'help-circle', 'lightbulb', 'target', 'trending-up'] as IconName[]
};

/**
 * Get icons by category
 */
export function getIconsByCategory(category: keyof typeof ICON_CATEGORIES): IconName[] {
  return ICON_CATEGORIES[category] || [];
} 