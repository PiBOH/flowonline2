import jsPDF from 'jspdf';

export interface ExportResult {
  success: boolean;
  message: string;
}

/**
 * Captures the flowchart SVG, cleans up interactive elements,
 * renders it to an offscreen canvas, and downloads as PNG (HiDPI/Retina).
 * Returns a promise so the caller can show a WinUI dialog instead of alert().
 */
export function exportToPNG(filename: string): Promise<ExportResult> {
  return new Promise((resolve) => {
    const svgEl = document.getElementById('flowchart-svg-export-target');
    if (!svgEl) {
      resolve({ success: false, message: 'Unable to find SVG flowchart elements for export.' });
      return;
    }

    const svgClone = svgEl.cloneNode(true) as SVGElement;
    // Strip inserter buttons, delete buttons, and interactive elements for a clean export
    svgClone.querySelectorAll('.inserter-btn, .delete-btn, .interactive, [data-export-remove]').forEach((el) => el.remove());
    svgClone.style.transform = '';

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const dpr = window.devicePixelRatio || 2;
      canvas.width = img.naturalWidth * dpr;
      canvas.height = img.naturalHeight * dpr;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      // White background for transparent SVGs
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          URL.revokeObjectURL(svgUrl);
          resolve({ success: false, message: 'Failed to generate PNG image.' });
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${sanitizeFilename(filename)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(svgUrl);
        resolve({ success: true, message: 'PNG image exported successfully.' });
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      resolve({ success: false, message: 'Failed to render the flowchart as an image.' });
    };

    img.src = svgUrl;
  });
}

/**
 * Captures the flowchart SVG, renders it to a canvas,
 * then embeds it in a PDF document using jsPDF.
 * Returns a promise so the caller can show a WinUI dialog instead of alert().
 */
export function exportToPDF(filename: string): Promise<ExportResult> {
  return new Promise((resolve) => {
    const svgEl = document.getElementById('flowchart-svg-export-target');
    if (!svgEl) {
      resolve({ success: false, message: 'Unable to find SVG flowchart elements for export.' });
      return;
    }

    const svgClone = svgEl.cloneNode(true) as SVGElement;
    svgClone.querySelectorAll('.inserter-btn, .delete-btn, .interactive, [data-export-remove]').forEach((el) => el.remove());
    svgClone.style.transform = '';

    const svgString = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x for crisp print quality
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight);
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL('image/png');

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const margin = 30; // px margin around the diagram

      const pdf = new jsPDF({
        orientation: imgW > imgH ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgW + margin * 2, imgH + margin * 2],
      });

      // Add white background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, imgW + margin * 2, imgH + margin * 2, 'F');

      pdf.addImage(imgData, 'PNG', margin, margin, imgW, imgH);
      pdf.save(`${sanitizeFilename(filename)}.pdf`);
      URL.revokeObjectURL(svgUrl);
      resolve({ success: true, message: 'PDF document exported successfully.' });
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      resolve({ success: false, message: 'Failed to render the flowchart as an image.' });
    };

    img.src = svgUrl;
  });
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_\-+]/gi, '') || 'diagram';
}
