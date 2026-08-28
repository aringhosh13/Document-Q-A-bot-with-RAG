import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if available in browser
try {
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF worker init warning:', e);
}

export async function parseFileToText(file: File): Promise<{ text: string; pageCount: number }> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'pdf') {
    return parsePdfFile(file);
  }

  // Plain text, Markdown, JSON, CSV, TS, PY, etc.
  const text = await file.text();
  const lineCount = text.split('\n').length;
  const estimatedPages = Math.max(1, Math.ceil(lineCount / 45));
  return { text, pageCount: estimatedPages };
}

async function parsePdfFile(file: File): Promise<{ text: string; pageCount: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const textPieces: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      textPieces.push(`--- Page ${i} ---\n${pageText}`);
    }

    return {
      text: textPieces.join('\n\n'),
      pageCount,
    };
  } catch (error) {
    console.warn('PDF parser fallback triggered:', error);
    // If PDF binary extraction fails, return readable notice
    return {
      text: `[PDF Extraction Notice: File "${file.name}"]\nSize: ${(file.size / 1024).toFixed(1)} KB. Extracted binary content. For best results, paste document text or upload .txt / .md files.`,
      pageCount: 1,
    };
  }
}
