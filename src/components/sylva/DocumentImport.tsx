import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import { LeafIcon, SeedIcon } from "@/components/sylva/icons";
import { conceptCandidatesFrom, extractDocument, ImportError, type ExtractedDoc } from "@/lib/document-import";

type Phase = "idle" | "reading" | "empty" | "manual" | "done";

const readSteps = [
  "Reading your document…",
  "Finding course structure…",
  "Mapping concepts…",
  "Modelling how each one fades…",
];

export function DocumentImporter({
  courseLabel,
  onComplete,
  compact = false,
}: {
  courseLabel?: string;
  onComplete: (result: { docs: ExtractedDoc[]; concepts: string[] }) => void;
  compact?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(readSteps[0]!);
  const [lines, setLines] = useState<string[]>([]);
  const [docs, setDocs] = useState<ExtractedDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setLines([]);
    setPhase("reading");
    const collected: ExtractedDoc[] = [];

    try {
      for (const file of Array.from(files)) {
        setStatus(`Reading ${file.name}…`);
        const doc = await extractDocument(file);
        collected.push(doc);
        setLines((prev) =>
          [...prev, ...doc.headings.slice(0, 8), ...doc.dates.slice(0, 4).map((d) => `date · ${d}`)].slice(-14),
        );
      }
    } catch (err) {
      setPhase("idle");
      setError(err instanceof ImportError ? err.message : "That file couldn't be read. Try another format.");
      return;
    }

    const usable = collected.filter((d) => !d.emptyText);
    if (usable.length === 0) {
      setDocs(collected);
      setPhase("empty");
      return;
    }

    for (let i = 1; i < readSteps.length; i++) {
      setStatus(readSteps[i]!);
      await new Promise((r) => setTimeout(r, 620));
    }

    const concepts = conceptCandidatesFrom(usable).map((c) => c.name);
    setDocs(usable);
    setPhase("done");
    onComplete({ docs: usable, concepts });
  }

  return (
    <div className={compact ? "" : "grain"}>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,application/pdf,text/plain"
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFiles(e.dataTransfer.files);
            }}
            className={`rounded-[2rem] border-2 border-dashed p-8 text-center focus-organic md:p-10 ${
              dragging ? "border-moss bg-secondary/50" : "border-moss/40 bg-background/40"
            }`}
          >
            <motion.span
              className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground"
              animate={reduced ? {} : { y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <LeafIcon className="size-6" />
            </motion.span>
            <p className="type-body mt-5 text-muted-foreground">
              Drop {courseLabel ? `documents for ${courseLabel}` : "your syllabus"} here — PDF, DOCX or plain text.
            </p>
            <button
              onClick={() => inputRef.current?.click()}
              className="focus-organic mt-5 min-h-11 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-bloom hover:brightness-110"
            >
              Choose files
            </button>
            <p className="type-caption mt-5">
              Read entirely in your browser. Several files can belong to the same course.
            </p>
            {error && (
              <p className="type-caption mx-auto mt-5 max-w-sm rounded-2xl bg-canopy/15 px-4 py-3 text-canopy-foreground" role="alert">
                {error}
              </p>
            )}
          </motion.div>
        )}

        {phase === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] border border-border bg-card/70 p-8 backdrop-blur-xl"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="grid size-9 place-items-center rounded-2xl bg-secondary text-secondary-foreground"
                animate={reduced ? {} : { scale: [1, 1.08, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <SeedIcon className="size-5" />
              </motion.span>
              <p className="type-h3 text-foreground">{status}</p>
            </div>
            <div className="mt-6 h-40 overflow-hidden rounded-2xl bg-muted/60 p-4">
              <ul className="type-caption space-y-1.5 font-mono">
                <AnimatePresence initial={false}>
                  {lines.slice(-8).map((line, i) => (
                    <motion.li
                      key={`${line}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="truncate"
                    >
                      {line}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <p className="type-caption mt-3">Everything above was read out of your actual file.</p>
          </motion.div>
        )}

        {phase === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] border border-canopy/40 bg-canopy/10 p-8"
          >
            <h3 className="type-h3 text-foreground">This looks like a scanned document.</h3>
            <p className="type-body mt-3 text-muted-foreground">
              There's no readable text inside {docs[0]?.fileName ?? "that file"} — it's likely images of pages. Try a
              text-based PDF, or type the key topics and dates below and SYLVA will plant those instead.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setPhase("manual")}
                className="focus-organic min-h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Enter them manually
              </button>
              <button
                onClick={() => setPhase("idle")}
                className="focus-organic min-h-11 rounded-full border border-border px-6 text-sm text-muted-foreground hover:text-foreground"
              >
                Try another file
              </button>
            </div>
          </motion.div>
        )}

        {phase === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-soft"
          >
            <h3 className="type-h3 text-foreground">One topic or date per line.</h3>
            <textarea
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              rows={7}
              placeholder={"Week 3 — Nucleophilic substitution\nOct 14 — Midterm\nReading: chapter 7"}
              className="focus-organic type-body mt-4 w-full resize-none rounded-2xl border border-border bg-background/70 p-4 text-foreground"
            />
            <button
              onClick={() => {
                const names = manual
                  .split("\n")
                  .map((l) => l.replace(/^[-•\s]+/, "").trim())
                  .filter((l) => l.length > 3)
                  .slice(0, 12);
                if (names.length === 0) return;
                setPhase("done");
                onComplete({ docs: [], concepts: names });
              }}
              className="focus-organic mt-5 min-h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:brightness-110"
            >
              Plant these
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
