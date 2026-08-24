import html2canvas from "html2canvas";
import { ExportFormat, ExportOptions } from "./types";
import { SITE_URL } from "./constants";
import { ImageProcessor } from "./image-processor";
import { StampProcessor } from "./stamp-processor";
import type { Stamp, UploadedImage } from "./types";

interface ExportDimensions {
  width: number;
  height: number;
}

function getDimensions(format: ExportFormat): ExportDimensions {
  const dimensions: Record<ExportFormat, ExportDimensions> = {
    portrait: { width: 1080, height: 1350 },
    landscape: { width: 1920, height: 1080 },
    "x-post": { width: 1200, height: 675 },
    "x-card": { width: 1200, height: 628 },
    "x-small": { width: 800, height: 628 },
    "linkedin-post": { width: 1200, height: 1200 },
    "linkedin-article": { width: 1200, height: 644 },
  };

  return dimensions[format] || dimensions.portrait;
}

function createExportContainer(
  dimensions: ExportDimensions,
  exportOptions: ExportOptions,
  includePadding: boolean,
  title?: string
): HTMLDivElement {
  const container = document.createElement("div");
  if (includePadding) {
    container.style.padding = "48px";
    container.style.borderRadius = "16px";
  }
  container.style.background = "transparent";
  container.style.position = "relative";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.width = `${dimensions.width}px`;

  if (!exportOptions.fitContent) {
    container.style.height = `${dimensions.height}px`;
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
  }

  // Hide no-export elements
  const style = document.createElement("style");
  style.textContent = ".no-export { display: none !important; }";
  container.appendChild(style);

  if (title) {
    container.appendChild(createTitleElement(title));
  }

  return container;
}

function createTitleElement(title: string): HTMLDivElement {
  const titleElement = document.createElement("div");
  titleElement.style.position = "absolute";
  titleElement.style.left = "0";
  titleElement.style.width = "100%";
  titleElement.style.top = "0";
  titleElement.style.textAlign = "center";
  titleElement.style.fontSize = "24px";
  titleElement.style.fontWeight = "bold";
  titleElement.style.color = "rgb(148 163 184)";
  titleElement.textContent = title;
  return titleElement;
}

function createWatermark(): HTMLDivElement {
  const watermark = document.createElement("div");
  watermark.style.position = "absolute";
  watermark.style.bottom = "16px";
  watermark.style.left = "0";
  watermark.style.width = "100%";
  watermark.style.textAlign = "center";
  watermark.style.color = "rgb(148 163 184)";
  watermark.style.fontSize = "8px";
  watermark.style.fontFamily = "monospace";
  watermark.style.opacity = "0.7";
  watermark.textContent = `Powered by ${SITE_URL}`;
  return watermark;
}

async function processContentForExport(
  content: HTMLElement,
  uploadedImages: UploadedImage[],
  stamps: Stamp[],
  exportOptions: ExportOptions
): Promise<HTMLElement> {
  const clonedContent = content.cloneNode(true) as HTMLElement;
  clonedContent.style.width = "100%";
  
  if (!exportOptions.fitContent) {
    clonedContent.style.maxHeight =
      exportOptions.format === "portrait" ? "1200px" : "900px";
  } else {
    clonedContent.style.height = "auto";
  }
  
  clonedContent.style.display = "flex";
  clonedContent.style.flexDirection = "column";

  // Process images
  await processImages(clonedContent, uploadedImages);
  
  // Process stamps
  await processStamps(clonedContent, stamps);

  // Adjust syntax highlighter
  const syntaxHighlighter = clonedContent.querySelector(
    ".syntax-highlighter"
  ) as HTMLElement;
  if (syntaxHighlighter) {
    syntaxHighlighter.style.minHeight = "unset";
    syntaxHighlighter.style.height = "auto";
  }

  return clonedContent;
}

async function processImages(
  content: HTMLElement,
  uploadedImages: UploadedImage[]
): Promise<void> {
  const clonedImages = content.querySelectorAll(
    "[data-image-id]"
  ) as NodeListOf<HTMLImageElement>;

  for (const imageElement of clonedImages) {
    const imageId = imageElement.getAttribute("data-image-id");
    if (!imageId) continue;

    const image = uploadedImages.find((img) => img.id === imageId);
    if (!image) continue;

    const processedImageUrl = await ImageProcessor.processImage(image);

    await new Promise<void>((resolve) => {
      imageElement.onload = () => resolve();
      imageElement.onerror = () => resolve();
      imageElement.src = processedImageUrl;
      imageElement.style.filter = "none";
      imageElement.style.transform = "none";
    });
  }
}

async function processStamps(
  content: HTMLElement,
  stamps: Stamp[]
): Promise<void> {
  const stampElements = content.querySelectorAll("[data-stamp-id]");

  for (const stampElement of stampElements) {
    const stampId = stampElement.getAttribute("data-stamp-id");
    const stamp = stamps.find((s) => s.id === stampId);
    if (stamp && stampId) {
      try {
        const processedStamp = await StampProcessor.processStamp(stamp);
        stampElement.innerHTML = "";
        stampElement.appendChild(processedStamp);
      } catch (error) {
        console.error("Error processing stamp:", error);
      }
    }
  }
}

export async function exportToPng(
  content: HTMLElement,
  exportOptions: ExportOptions,
  stamps: Stamp[],
  uploadedImages: UploadedImage[],
  title?: string,
  includePadding = true
): Promise<string> {
  const dimensions = getDimensions(exportOptions.format);
  const exportContainer = createExportContainer(dimensions, exportOptions, includePadding, title);
  
  const processedContent = await processContentForExport(
    content,
    uploadedImages,
    stamps,
    exportOptions
  );
  
  exportContainer.appendChild(processedContent);

  if (exportOptions.includeWatermark) {
    exportContainer.appendChild(createWatermark());
  }

  document.body.appendChild(exportContainer);

  try {
    const contentRect = exportContainer.getBoundingClientRect();
    const canvas = await html2canvas(exportContainer, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      width: dimensions.width,
      height: exportOptions.fitContent
        ? Math.ceil(contentRect.height)
        : dimensions.height,
    });

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob as Blob);
        },
        "image/png",
        1.0
      );
    });

    return URL.createObjectURL(blob);
  } finally {
    document.body.removeChild(exportContainer);
  }
} 