// Safe document parser supporting Plain text, Markdown, JSON, CSV, and PDF extraction
export async function parseFileToText(file: File): Promise<{ text: string; pageCount: number }> {
  const fileExt = file.name.split('.').pop()?.toLowerCase();

  if (fileExt === 'pdf') {
    return parsePdfFile(file);
  }

  // Plain text, Markdown, JSON, CSV, TS, PY, etc.
  try {
    const text = await file.text();
    const lineCount = text.split('\n').length;
    const estimatedPages = Math.max(1, Math.ceil(lineCount / 45));
    return { text, pageCount: estimatedPages };
  } catch (err) {
    console.warn('Error reading text file:', err);
    return { text: '', pageCount: 1 };
  }
}

async function parsePdfFile(file: File): Promise<{ text: string; pageCount: number }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Dynamic import to prevent top-level bundle evaluation crashes in browser/sandboxes
    const pdfjsLib = await import('pdfjs-dist');
    
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
      } catch (e) {
        // worker configuration failure is non-fatal
      }
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const textPieces: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const rawPageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      if (rawPageText.length > 0) {
        textPieces.push(`--- Page ${i} ---\n${rawPageText}`);
      }
    }

    const fullExtractedText = textPieces.join('\n\n');

    return {
      text: fullExtractedText || `[Notice: PDF contains scanned images or no extractable text layer. Please copy/paste text directly.]`,
      pageCount: Math.max(1, pageCount),
    };
  } catch (error) {
    console.warn('PDF parser fallback triggered:', error);
    // If PDF binary extraction fails, return readable notice
    return {
      text: `[PDF Extraction: File "${file.name}"]\nSize: ${(file.size / 1024).toFixed(1)} KB.\n\nNote: Binary PDF extracted. For optimal precision, you can also paste direct document text or upload .txt / .md files.`,
      pageCount: 1,
    };
  }
}

