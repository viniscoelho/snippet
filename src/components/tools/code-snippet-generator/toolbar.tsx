"use client";

import * as React from "react";
import { Hash, Smile, Download, FrameIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LanguageSelect } from "./language-select";
import { ExportFormatToggle } from "./export-format-toggle";
import { StampSection } from "./stamp-section";
import { STAMP_ICONS } from "./constants";
import { Input } from "@/components/ui/input";
import { useCodeGeneratorStore } from "@/store/code-generator-store";
import { ImageUpload } from "./image-upload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  handleExport: () => Promise<void>;
  handleStampClick: (stampId: string) => void;
}

export function Toolbar({ handleExport, handleStampClick }: ToolbarProps) {
  const {
    language,
    showLineNumbers,
    isExporting,
    code,
    title,
    includePadding,
    setLanguage,
    setShowLineNumbers,
    setTitle,
    setIncludePadding,
  } = useCodeGeneratorStore();

  const [isStampPopoverOpen, setIsStampPopoverOpen] = React.useState(false);

  const handleStampSelection = async (stampId: string) => {
    handleStampClick(stampId);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsStampPopoverOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <LanguageSelect value={language} onValueChange={setLanguage} />
        <Input
          placeholder="Enter your title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow bg-background/50 text-foreground border-border/50 hover:bg-background/70 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <ExportFormatToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Toggle
                    pressed={showLineNumbers}
                    onPressedChange={setShowLineNumbers}
                    className="bg-background/50 text-foreground border-border/50 hover:bg-background/70 data-[state=on]:bg-primary/20 transition-all duration-300"
                    aria-label="Toggle line numbers"
                  >
                    <Hash className="h-4 w-4" />
                  </Toggle>
                </span>
              </TooltipTrigger>
              <TooltipContent>Line numbers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Toggle
                    pressed={includePadding}
                    onPressedChange={setIncludePadding}
                    className="bg-background/50 text-foreground border-border/50 hover:bg-background/70 data-[state=on]:bg-primary/20 transition-all duration-300"
                    aria-label="Toggle export padding"
                  >
                    <FrameIcon className="h-4 w-4" />
                  </Toggle>
                </span>
              </TooltipTrigger>
              <TooltipContent>Export padding</TooltipContent>
            </Tooltip>
            <ImageUpload />
            <Popover
              open={isStampPopoverOpen}
              onOpenChange={setIsStampPopoverOpen}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20
                        border-border hover:border-border/80 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
                      aria-label="Add stamps"
                    >
                      <Smile className="w-4 h-4 text-primary" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Add stamps</TooltipContent>
              </Tooltip>
              <PopoverContent
                className="w-[280px] p-0 border-border/50 bg-background/95 backdrop-blur-sm shadow-lg"
                align="end"
                sideOffset={5}
              >
                <div className="p-1.5">
                  <div className="grid gap-1.5">
                    <StampSection
                      title="Validation"
                      stamps={STAMP_ICONS.slice(0, 6)}
                      onStampClick={handleStampSelection}
                    />
                    <StampSection
                      title="Expressions"
                      stamps={STAMP_ICONS.slice(6, 18)}
                      onStampClick={handleStampSelection}
                    />
                    <StampSection
                      title="Reactions"
                      stamps={STAMP_ICONS.slice(18, 26)}
                      onStampClick={handleStampSelection}
                    />
                    <StampSection
                      title="Tech"
                      stamps={STAMP_ICONS.slice(26, 34)}
                      onStampClick={handleStampSelection}
                    />
                    <StampSection
                      title="Communication"
                      stamps={STAMP_ICONS.slice(34, 42)}
                      onStampClick={handleStampSelection}
                    />
                    <StampSection
                      title="Misc"
                      stamps={STAMP_ICONS.slice(42)}
                      onStampClick={handleStampSelection}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleExport}
                disabled={isExporting || !code}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90
                  text-white shadow-lg transition-all duration-300 hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PNG"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download as PNG</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
