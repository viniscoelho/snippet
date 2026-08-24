export type ExportFormat = 
  | "portrait"
  | "landscape" 
  | "x-post"
  | "x-card"
  | "x-small"
  | "linkedin-post"
  | "linkedin-article";

export interface ExportOptions {
  format: ExportFormat;
  fitContent: boolean;
  includeWatermark: boolean;
}

export interface Language {
  id: string;
  name: string;
}

export interface Stamp {
  id: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  isDragging?: boolean;
  rotation: number;
  scale: number;
  opacity: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  exposure?: number;
  hue?: number;
}

export interface StampIcon {
  id: string;
  emoji: string;
  label: string;
}

export interface FormatOption {
  id: ExportFormat;
  label: string;
  dimensions: string;
  description?: string;
}

export interface UploadedImage {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging?: boolean;
  rotation: number;
  scale: number;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  hue: number;
} 