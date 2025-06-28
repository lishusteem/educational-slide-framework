/**
 * Icon Registry
 * Centralized icon management system using Lucide icons
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  Square,
  Settings,
  Palette,
  Type,
  Hash,
  FileText,
  List,
  Grid3X3,
  BarChart3,
  BookOpen,
  Quote,
  CheckCircle,
  Circle,
  ArrowRight,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Clock,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Star,
  Bookmark,
  Share2,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Link,
  ExternalLink,
  Home,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Save,
  Copy,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  Film,
  Music,
  Video,
  Camera,
  Mic,
  MicOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Database,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Zap,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Key,
  Tag,
  Tags,
  Flag,
  Bell,
  BellOff,
  MessageSquare,
  MessageCircle,
  Send,
  Inbox,
  Archive,
  Folder,
  FolderOpen,
  File,
  FilePlus,
  FileCheck,
  FileX,
  Cloud,
  CloudDownload,
  CloudUpload,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Umbrella,
  Wind,
  Thermometer,
  Droplets,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  LineChart,
  DollarSign,
  CreditCard,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Package,
  Truck,
  Navigation,
  Compass,
  Map,
  Globe,
  Anchor,
  Plane,
  Car,
  Bus,
  Train,
  Bike,
  Layers,
  Box,
  Maximize,
  RotateCw,
  type LucideIcon
} from 'lucide-react';

// Icon registry mapping
const iconRegistry: Record<string, LucideIcon> = {
  // Media controls
  'play': Play,
  'pause': Pause,
  'square': Square,
  'skip-forward': SkipForward,
  'skip-back': SkipBack,
  'rotate-ccw': RotateCcw,
  'fast-forward': FastForward,
  'volume-2': Volume2,
  'volume-x': VolumeX,
  
  // UI controls
  'settings': Settings,
  'palette': Palette,
  'type': Type,
  'hash': Hash,
  'file-text': FileText,
  'list': List,
  'grid-3x3': Grid3X3,
  'bar-chart-3': BarChart3,
  'book-open': BookOpen,
  'quote': Quote,
  'check-circle': CheckCircle,
  'circle': Circle,
  'arrow-right': ArrowRight,
  
  // Time and date
  'clock': Clock,
  'calendar': Calendar,
  
  // People and communication
  'user': User,
  'users': Users,
  'mail': Mail,
  'phone': Phone,
  'message-square': MessageSquare,
  'message-circle': MessageCircle,
  'send': Send,
  'inbox': Inbox,
  
  // Actions
  'heart': Heart,
  'star': Star,
  'bookmark': Bookmark,
  'share-2': Share2,
  'download': Download,
  'upload': Upload,
  'search': Search,
  'filter': Filter,
  'sort-asc': SortAsc,
  'sort-desc': SortDesc,
  'eye': Eye,
  'eye-off': EyeOff,
  'edit': Edit,
  'trash-2': Trash2,
  'plus': Plus,
  'minus': Minus,
  'x': X,
  
  // Navigation
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'home': Home,
  'menu': Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  
  // Status
  'check': Check,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'help-circle': HelpCircle,
  
  // Links
  'link': Link,
  'external-link': ExternalLink,
  
  // File operations
  'save': Save,
  'copy': Copy,
  'undo': Undo,
  'redo': Redo,
  'folder': Folder,
  'folder-open': FolderOpen,
  'file': File,
  'file-plus': FilePlus,
  'file-check': FileCheck,
  'file-x': FileX,
  'archive': Archive,
  
  // Text editing
  'bold': Bold,
  'italic': Italic,
  'underline': Underline,
  'align-left': AlignLeft,
  'align-center': AlignCenter,
  'align-right': AlignRight,
  'align-justify': AlignJustify,
  
  // Media
  'image': Image,
  'film': Film,
  'music': Music,
  'video': Video,
  'camera': Camera,
  'mic': Mic,
  'mic-off': MicOff,
  
  // Devices
  'monitor': Monitor,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'laptop': Laptop,
  'server': Server,
  'database': Database,
  
  // Connectivity
  'wifi': Wifi,
  'wifi-off': WifiOff,
  'bluetooth': Bluetooth,
  
  // Power
  'battery': Battery,
  'battery-low': BatteryLow,
  'power': Power,
  'power-off': PowerOff,
  'zap': Zap,
  
  // Security
  'lock': Lock,
  'unlock': Unlock,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'key': Key,
  
  // Organization
  'tag': Tag,
  'tags': Tags,
  'flag': Flag,
  
  // Notifications
  'bell': Bell,
  'bell-off': BellOff,
  
  // Cloud and storage
  'cloud': Cloud,
  'cloud-download': CloudDownload,
  'cloud-upload': CloudUpload,
  
  // Weather
  'sun': Sun,
  'moon': Moon,
  'sunrise': Sunrise,
  'sunset': Sunset,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'umbrella': Umbrella,
  'wind': Wind,
  'thermometer': Thermometer,
  'droplets': Droplets,
  
  // Analytics
  'activity': Activity,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'bar-chart': BarChart,
  'pie-chart': PieChart,
  'line-chart': LineChart,
  
  // Commerce
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  'wallet': Wallet,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'gift': Gift,
  'package': Package,
  'truck': Truck,
  
  // Location
  'map-pin': MapPin,
  'navigation': Navigation,
  'compass': Compass,
  'map': Map,
  'globe': Globe,
  'anchor': Anchor,
  
  // Transport
  'plane': Plane,
  'car': Car,
  'bus': Bus,
  'train': Train,
  'bike': Bike,
  
  // Layout Control specific icons
  'layers': Layers,
  'box': Box,
  'maximize': Maximize,
  'rotate-cw': RotateCw
};

export interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const renderIcon = (
  iconName: string,
  props: IconProps = {}
): React.ReactElement | null => {
  const IconComponent = iconRegistry[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in registry`);
    return null;
  }

  const { size = 16, className = '', style = {} } = props;

  return React.createElement(IconComponent, {
    size,
    className,
    style
  });
};

export const getAvailableIcons = (): string[] => {
  return Object.keys(iconRegistry);
};

export const isIconAvailable = (iconName: string): boolean => {
  return iconName in iconRegistry;
}; 