"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCodeGeneratorStore } from "@/store/code-generator-store";
import type { ExportFormat } from "./types";
import { cn } from "@/lib/utils";

const EXPORT_FORMATS = {
  standard: [
    { id: "portrait" as const, label: "Portrait", dimensions: "1080×1350" },
    { id: "landscape" as const, label: "Landscape", dimensions: "1920×1080" },
  ],
  social: [
    { id: "x-post" as const, label: "X Post", dimensions: "1200×675" },
    { id: "x-card" as const, label: "X Card", dimensions: "1200×628" },
    { id: "x-small" as const, label: "X Small", dimensions: "800×628" },
    {
      id: "linkedin-post" as const,
      label: "LinkedIn Post",
      dimensions: "1200×1200",
    },
    {
      id: "linkedin-article" as const,
      label: "LinkedIn Article",
      dimensions: "1200×644",
    },
  ],
} as const;

export function ExportFormatToggle() {
  const { exportOptions, setExportOptions } = useCodeGeneratorStore();

  const handleFormatChange = (format: ExportFormat) => {
    setExportOptions({ format });
  };

  const handleFitContentChange = (fitContent: boolean) => {
    setExportOptions({ fitContent });
  };

  const handleWatermarkChange = (includeWatermark: boolean) => {
    setExportOptions({ includeWatermark });
  };

  const FormatButton = ({
    id,
    label,
    dimensions,
  }: {
    id: ExportFormat;
    label: string;
    dimensions: string;
  }) => (
    <Button
      size="sm"
      variant={exportOptions.format === id ? "default" : "outline"}
      onClick={() => handleFormatChange(id)}
      className={cn(
        "flex-1 flex flex-col items-center gap-1 h-auto py-2",
        exportOptions.format === id
          ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
          : ""
      )}
    >
      <span>{label}</span>
      <span className="text-xs opacity-80">{dimensions}</span>
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/50 text-foreground border-border/50 hover:bg-background/70 transition-all duration-300"
          aria-label="Export settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] p-4 border-border/50 bg-background/95 backdrop-blur-sm"
        align="start"
      >
        <div className="grid gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium leading-none mb-3">
                Standard Formats
              </h4>
              <div className="flex gap-2">
                {EXPORT_FORMATS.standard.map((format) => (
                  <FormatButton key={format.id} {...format} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium leading-none mb-3">Social Media</h4>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_FORMATS.social.map((format) => (
                  <FormatButton key={format.id} {...format} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="fit-content" className="flex flex-col space-y-1">
                <span>Fit Content</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Adjust image size to content
                </span>
              </Label>
              <Switch
                id="fit-content"
                checked={exportOptions.fitContent}
                onCheckedChange={handleFitContentChange}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="watermark" className="flex flex-col space-y-1">
                <span>Watermark</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Include watermark in export
                </span>
              </Label>
              <Switch
                id="watermark"
                checked={exportOptions.includeWatermark}
                onCheckedChange={handleWatermarkChange}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
