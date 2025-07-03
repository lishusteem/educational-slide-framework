export interface ExportOptions {
  format: 'html-bundle' | 'video' | 'pdf';
  quality: 'low' | 'medium' | 'high';
  includeAssets: boolean;
  embedAudio: boolean;
  embedFonts: boolean;
  minify: boolean;
  offlineSupport: boolean;
}

export interface ExportBundle {
  files: ExportFile[];
  manifest: ExportManifest;
  size: number;
}

export interface ExportFile {
  path: string;
  content: string | Uint8Array;
  type: 'html' | 'css' | 'js' | 'audio' | 'asset';
}

export interface ExportManifest {
  version: string;
  created: string;
  presentation: string;
  totalSlides: number;
  duration: number;
  files: string[];
} 