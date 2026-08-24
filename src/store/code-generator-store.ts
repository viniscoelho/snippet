import { create } from 'zustand';
import type { UploadedImage, ExportOptions } from '@/components/tools/code-snippet-generator/types';

interface CodeGeneratorStore {
  code: string;
  language: string;
  showLineNumbers: boolean;
  title: string;
  isExporting: boolean;
  uploadedImages: UploadedImage[];
  exportOptions: ExportOptions;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setShowLineNumbers: (show: boolean) => void;
  setTitle: (title: string) => void;
  setIsExporting: (isExporting: boolean) => void;
  addImage: (image: UploadedImage) => void;
  updateImage: (id: string, updates: Partial<UploadedImage>) => void;
  removeImage: (id: string) => void;
  setExportOptions: (options: Partial<ExportOptions>) => void;
}

export const useCodeGeneratorStore = create<CodeGeneratorStore>((set) => ({
  code: '',
  language: 'typescript',
  showLineNumbers: true,
  title: '',
  isExporting: false,
  uploadedImages: [],
  exportOptions: {
    format: 'portrait',
    fitContent: true,
    includeWatermark: false,
  },
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setShowLineNumbers: (show) => set({ showLineNumbers: show }),
  setTitle: (title) => set({ title }),
  setIsExporting: (isExporting) => set({ isExporting }),
  addImage: (image) =>
    set((state) => ({
      uploadedImages: [...state.uploadedImages, image],
    })),
  updateImage: (id, updates) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
    })),
  removeImage: (id) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
    })),
  setExportOptions: (options) =>
    set((state) => ({
      exportOptions: { ...state.exportOptions, ...options },
    })),
})); 