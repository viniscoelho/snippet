"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";
import type { PanInfo } from "framer-motion";
import { PreviewHeader } from "./preview-header";
import { DraggableOverlay } from "./draggable-overlay";
import { Stamp } from "./types";

interface CodePreviewProps {
  code: string;
  language: string;
  showLineNumbers: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  handlePreviewClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  stamps: Stamp[];
  draggedStamp: string | null;
  handleDragStart: (stampId: string) => void;
  handleDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    stampId: string
  ) => void;
  onUpdateStamp: (stampId: string, updates: Partial<Stamp>) => void;
  onRemoveStamp: (stampId: string) => void;
}

export function CodePreview({
  code,
  language,
  showLineNumbers,
  previewRef,
  handlePreviewClick,
  stamps,
  draggedStamp,
  handleDragStart,
  handleDragEnd,
  onUpdateStamp,
  onRemoveStamp,
}: CodePreviewProps) {
  return (
    <div className="relative group min-w-0">
      <div ref={previewRef}>
        <div className="relative border border-border/50 rounded-xl overflow-hidden bg-[hsl(var(--code-background))] shadow-lg transition-all duration-300 group-hover:shadow-xl">
          <PreviewHeader />
          <div className="relative" onClick={handlePreviewClick}>
            <SyntaxHighlighter
              language={language}
              style={themes.vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                minHeight: "400px",
                background: "transparent",
                fontSize: "14px",
                color: "hsl(var(--code-foreground))",
                position: "relative",
              }}
              showLineNumbers={showLineNumbers}
              wrapLongLines={false}
              className="scrollbar-thin scrollbar-track-background/20 scrollbar-thumb-border/50 hover:scrollbar-thumb-border/70 syntax-highlighter"
            >
              {code || "// Your code will appear here"}
            </SyntaxHighlighter>
            <DraggableOverlay
              stamps={stamps}
              draggedStamp={draggedStamp}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              previewRef={previewRef}
              onUpdateStamp={onUpdateStamp}
              onRemoveStamp={onRemoveStamp}
            />
          </div>
        </div>
      </div>
      <div className="no-export absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-gradient-x -z-10"></div>
    </div>
  );
}
