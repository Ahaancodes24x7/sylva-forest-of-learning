/**
 * Real, client-side document import for SYLVA.
 *
 * PDF text is extracted with pdf.js, DOCX by unzipping word/document.xml,
 * plain text/markdown directly. Nothing leaves the browser.
 */

export type ExtractedDoc = {
  fileName: string;
  kind: "pdf" | "docx" | "text";
  text: string;
  pages: number;
  headings: string[];
  dates: string[];
  words: number;
  /** set when the file yielded no usable text (e.g. a scanned PDF) */
  emptyText: boolean;
};

export class ImportError extends Error {}

async function extractPdf(file: File): Promise<{ text: string; pages: number }> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const chunks: string[] = [];
  const max = Math.min(doc.numPages, 40);
  for (let i = 1; i <= max; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY: number | null = null;
    for (const item of content.items as Array<{ str?: string; transform?: number[] }>) {
      if (typeof item.str !== "string") continue;
      const y = item.transform?.[5] ?? null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) {
        chunks.push(line.trim());
        line = "";
      }
      line += item.str + " ";
      lastY = y;
    }
    if (line.trim()) chunks.push(line.trim());
  }
  return { text: chunks.filter(Boolean).join("\n"), pages: doc.numPages };
}

async function extractDocx(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const entry = zip.file("word/document.xml");
  if (!entry) throw new ImportError("That .docx file couldn't be opened.");
  const xml = await entry.async("string");
  return xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab[^>]*\/>/g, "  ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

const DATE_RE =
  /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:,\s*\d{4})?|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|week\s+\d{1,2})\b/gi;

const STRUCTURE_RE =
  /^(week|unit|module|chapter|lecture|topic|section|part|lab|reading|assignment|exam|midterm|final|quiz|project)\b/i;

const NOISE_RE = /^(page\s+\d+|\d+|table of contents|syllabus)$/i;

export function analyzeText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const headings: string[] = [];
  for (const line of lines) {
    if (line.length < 3 || line.length > 90 || NOISE_RE.test(line)) continue;
    const words = line.split(" ");
    const structural = STRUCTURE_RE.test(line);
    const titleish =
      words.length <= 8 &&
      !/[.!?;]$/.test(line) &&
      words.filter((w) => /^[A-Z]/.test(w)).length >= Math.max(1, Math.ceil(words.length * 0.6));
    const allCaps = line === line.toUpperCase() && /[A-Z]{3}/.test(line) && words.length <= 8;
    if (structural || titleish || allCaps) {
      const clean = line.replace(/^[-•–—\s]+/, "").replace(/[:•]+$/, "").trim();
      if (clean && !headings.some((h) => h.toLowerCase() === clean.toLowerCase())) headings.push(clean);
    }
    if (headings.length >= 60) break;
  }

  const dates = Array.from(new Set((text.match(DATE_RE) ?? []).map((d) => d.trim()))).slice(0, 24);

  return { lines, headings, dates, words: text.split(/\s+/).filter(Boolean).length };
}

export async function extractDocument(file: File): Promise<ExtractedDoc> {
  const name = file.name.toLowerCase();
  let text = "";
  let pages = 1;
  let kind: ExtractedDoc["kind"] = "text";

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    kind = "pdf";
    const out = await extractPdf(file);
    text = out.text;
    pages = out.pages;
  } else if (name.endsWith(".docx")) {
    kind = "docx";
    text = await extractDocx(file);
  } else if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
    kind = "text";
    text = await file.text();
  } else {
    throw new ImportError("SYLVA reads PDF, DOCX, and plain text files.");
  }

  const analysis = analyzeText(text);
  return {
    fileName: file.name,
    kind,
    text,
    pages,
    headings: analysis.headings,
    dates: analysis.dates,
    words: analysis.words,
    emptyText: analysis.words < 25,
  };
}

/** Turn extracted headings into concept-shaped candidates. */
export function conceptCandidatesFrom(docs: ExtractedDoc[]): { name: string; source: string }[] {
  const seen = new Set<string>();
  const out: { name: string; source: string }[] = [];
  for (const doc of docs) {
    for (const heading of doc.headings) {
      const name = heading
        .replace(/^(week|unit|module|chapter|lecture|topic|section|part)\s*\d*\s*[:.\-–]?\s*/i, "")
        .replace(/\s*\(\d+%\)\s*$/, "")
        .trim();
      if (name.length < 4 || name.length > 52) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ name: name.charAt(0).toUpperCase() + name.slice(1), source: doc.fileName });
      if (out.length >= 14) return out;
    }
  }
  return out;
}
