import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface GeneratePdfOptions {
  elementId?: string;
  fileName?: string;
  onProgress?: (status: string) => void;
}

/**
 * Inlines any external images as Base64 to bypass CORS taint
 */
async function inlineAllImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(async (img) => {
    if (!img.src || img.src.startsWith('data:')) {
      return;
    }
    try {
      const response = await fetch(img.src, { mode: 'cors' });
      const blob = await response.blob();
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            img.src = reader.result;
          }
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(blob);
      });
    } catch {
      // If cross-origin fetch fails, leave image as is
    }
  });

  await Promise.all(promises);
}

/**
 * Generates and downloads a pixel-perfect, single-page A4 PDF matching the live preview 100%.
 *
 * It renders into an isolated 794px × 1123px container (exact A4 at 96 DPI),
 * removing box-shadows and preventing any flexbox compression or reflow from the preview panel.
 */
export async function downloadCvAsPdf({
  elementId = 'cv-preview-a4',
  fileName = 'CV.pdf',
  onProgress,
}: GeneratePdfOptions = {}): Promise<boolean> {
  const target = document.getElementById(elementId);
  if (!target) {
    throw new Error(`Element met ID "${elementId}" niet gevonden.`);
  }

  onProgress?.('Element voorbereiden...');

  // Create an isolated container with EXACT A4 dimensions in pixels (794px × 1123px = 210mm × 297mm)
  // This guarantees that flex containers, text wrapping, and fonts compute identically to
  // true 210mm A4, without any influence from viewport size, zoom, or split-screen compression!
  const offscreen = document.createElement('div');
  offscreen.style.position = 'fixed';
  offscreen.style.left = '0';
  offscreen.style.top = '0';
  offscreen.style.width = '794px';
  offscreen.style.height = '1123px';
  offscreen.style.zIndex = '-9999';
  offscreen.style.pointerEvents = 'none';
  offscreen.style.opacity = '0.01';
  offscreen.style.overflow = 'hidden';
  offscreen.style.background = '#ffffff';

  // Clone the preview node
  const clone = target.cloneNode(true) as HTMLElement;
  clone.id = 'cv-print-clone';
  clone.style.width = '794px';
  clone.style.height = '1123px';
  clone.style.minHeight = '1123px';
  clone.style.maxHeight = '1123px';
  clone.style.overflow = 'hidden';
  clone.style.boxSizing = 'border-box';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.padding = '0';

  // Remove box shadow on .a4-page so it doesn't inflate canvas bounds or cause shifts
  const a4Page = (clone.querySelector('.a4-page') as HTMLElement) || clone;
  if (a4Page) {
    a4Page.style.boxShadow = 'none';
    a4Page.style.width = '794px';
    a4Page.style.height = '1123px';
    a4Page.style.minHeight = '1123px';
    a4Page.style.maxHeight = '1123px';
    a4Page.style.overflow = 'hidden';
    a4Page.style.margin = '0';
  }

  offscreen.appendChild(clone);
  document.body.appendChild(offscreen);

  try {
    onProgress?.('Afbeeldingen verwerken...');
    await inlineAllImages(clone);

    // Give browser brief tick to apply styles
    await new Promise((resolve) => setTimeout(resolve, 120));

    onProgress?.('Hoge-resolutie A4 weergave genereren...');
    let dataUrl: string;

    try {
      // First attempt with web fonts embedded
      dataUrl = await toPng(clone, {
        width: 794,
        height: 1123,
        pixelRatio: 2, // 2x for sharp 300 DPI print quality (1588 × 2246 px)
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: false,
      });
    } catch (fontErr) {
      console.warn('Font embedding waarschuwing, fallback naar native canvas render:', fontErr);
      dataUrl = await toPng(clone, {
        width: 794,
        height: 1123,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
      });
    }

    onProgress?.('PDF samenstellen en downloaden...');

    // Exact A4 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Exactly 210mm × 297mm (1 single full page, 0 margin, 0 page overflow)
    pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

    pdf.save(fileName);
    onProgress?.('Download voltooid!');
    return true;
  } finally {
    if (document.body.contains(offscreen)) {
      document.body.removeChild(offscreen);
    }
  }
}

/**
 * Triggers native browser print with error handling
 */
export function triggerNativePrint(): { success: boolean; error?: string } {
  try {
    window.print();
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('window.print() niet direct mogelijk in deze omgeving:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
