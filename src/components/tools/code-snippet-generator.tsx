"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import type { PanInfo } from "framer-motion";
import { STAMP_ICONS } from "./code-snippet-generator/constants";
import { Toolbar } from "./code-snippet-generator/toolbar";
import { CodePreview } from "./code-snippet-generator/code-preview";
import { CaptureOverlay } from "./code-snippet-generator/capture-overlay";
import type { Stamp } from "./code-snippet-generator/types";
import { useCodeGeneratorStore } from "@/store/code-generator-store";
import { exportToPng } from "./code-snippet-generator/export-processor";

export function CodeSnippetGenerator() {
  const {
    code,
    language,
    isExporting,
    showLineNumbers,
    exportOptions,
    title,
    includePadding,
    setCode,
    setIsExporting,
    uploadedImages,
  } = useCodeGeneratorStore();
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [draggedStamp, setDraggedStamp] = useState<string | null>(null);

  const addStamp = useCallback((stampId: string, x: number, y: number) => {
    const selectedIcon = STAMP_ICONS.find((icon) => icon.id === stampId);
    if (!selectedIcon) return;

    const stampUniqueId = `${stampId}-${Date.now()}`;
    const newStamp: Stamp = {
      id: stampUniqueId,
      x,
      y,
      icon: (
        <div
          className="text-2xl select-none"
          data-stamp-id={stampUniqueId}
          style={{
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedIcon.emoji}
        </div>
      ),
      isDragging: false,
      rotation: 0,
      scale: 1,
      opacity: 1,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      exposure: 1,
      hue: 0,
    };

    setStamps((prev) => [...prev, newStamp]);
  }, []);

  const updateStamp = useCallback(
    (stampId: string, updates: Partial<Stamp>) => {
      setStamps((prev) =>
        prev.map((stamp) =>
          stamp.id === stampId
            ? {
                ...stamp,
                ...updates,
              }
            : stamp
        )
      );
    },
    []
  );

  const removeStamp = useCallback((stampId: string) => {
    setStamps((prev) => prev.filter((stamp) => stamp.id !== stampId));
  }, []);

  const handleStampClick = useCallback(
    (stampId: string) => {
      if (!previewRef.current) return;

      const container = previewRef.current.querySelector(".syntax-highlighter");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = rect.width / 2;
      const y = rect.height / 2;

      addStamp(stampId, x, y);
    },
    [addStamp]
  );

  const handlePreviewClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!selectedStamp || !previewRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const selectedIcon = STAMP_ICONS.find(
        (icon) => icon.id === selectedStamp
      );
      if (!selectedIcon) return;

      const newStamp: Stamp = {
        id: `${selectedStamp}-${Date.now()}`,
        x,
        y,
        icon: <div className="text-2xl select-none">{selectedIcon.emoji}</div>,
        isDragging: false,
        rotation: 0,
        scale: 1,
        opacity: 1,
      };

      setStamps((prev) => [...prev, newStamp]);
      setSelectedStamp(null);
    },
    [selectedStamp]
  );

  const handleDragStart = (stampId: string) => {
    setDraggedStamp(stampId);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    stampId: string
  ) => {
    const stamp = stamps.find((s) => s.id === stampId);
    if (!stamp || !previewRef.current) return;

    const container = previewRef.current.querySelector(".syntax-highlighter");
    if (!container) return;

    const rect = container.getBoundingClientRect();

    let newX = stamp.x + info.offset.x;
    let newY = stamp.y + info.offset.y;

    newX = Math.max(0, Math.min(newX, rect.width));
    newY = Math.max(0, Math.min(newY, rect.height));

    setStamps((prev) =>
      prev.map((s) =>
        s.id === stampId
          ? {
              ...s,
              x: newX,
              y: newY,
            }
          : s
      )
    );
    setDraggedStamp(null);
  };

  const handleExport = async () => {
    if (!previewRef.current || isExporting) return;

    try {
      setIsExporting(true);
      setIsCapturing(true);

      // Attendre un peu pour que l'animation de flash soit visible
      await new Promise((resolve) => setTimeout(resolve, 300));

      const imageUrl = await exportToPng(
        previewRef.current,
        exportOptions,
        stamps,
        uploadedImages,
        title,
        includePadding
      );

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `code-snippet-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
      setIsCapturing(false);
    }
  };

  const containerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      variants={containerAnimation}
      initial="initial"
      animate="animate"
      className="w-full max-w-4xl mx-auto py-8"
    >
      <div className="space-y-4">
        <motion.div
          variants={itemAnimation}
          className="relative flex flex-col gap-8 p-6 sm:p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-border/50 shadow-2xl"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-gradient-x"></div>
            <Textarea
              placeholder="Paste your code here..."
              className="relative w-full min-h-[300px] font-mono bg-[hsl(var(--code-background))] text-[hsl(var(--code-foreground))] placeholder:text-[hsl(var(--code-foreground)/50)] 
                border-border/50 focus:border-primary/50 resize-none rounded-xl shadow-lg
                transition-all duration-300 focus:shadow-xl"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <Toolbar
            handleExport={handleExport}
            handleStampClick={handleStampClick}
          />

          <CodePreview
            code={code}
            language={language}
            showLineNumbers={showLineNumbers}
            previewRef={previewRef}
            handlePreviewClick={handlePreviewClick}
            stamps={stamps}
            draggedStamp={draggedStamp}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            onUpdateStamp={updateStamp}
            onRemoveStamp={removeStamp}
          />
          <CaptureOverlay isCapturing={isCapturing} />
        </motion.div>
      </div>
    </motion.section>
  );
}
