import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import { analyzeText, extractDocument } from "@/lib/document-import";

const SAMPLE = `CHEM 240 — Organic Chemistry II
Fall Semester Syllabus

Week 1 — Review of bonding and hybridisation
Week 2 — Nucleophilic substitution: SN1 and SN2
Week 3 — Elimination reactions
Week 4 — Stereochemistry and chirality
Week 5 — Problem Set 3 due Oct 6
Week 6 — Midterm I, Oct 14 (30% of final grade)
Week 7 — Aromaticity
Week 8 — Electrophilic aromatic substitution
Week 9 — NMR interpretation
Week 10 — Carbonyl additions
Final exam Dec 12`;

export function MiniReveal() {
  const reduced = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<"idle" | "reading" | "result">("idle");
  const [found, setFound] = useState<string[]>([]);
  const [source, setSource] = useState("sample syllabus");

  async function run(text: string, label: string) {
    setSource(label);
    setPhase("reading");
    const { headings } = analyzeText(text);
    const shown = headings.slice(0, 9);
    setFound([]);
    for (const h of shown) {
      setFound((prev) => [...prev, h]);
      await new Promise((r) => setTimeout(r, reduced ? 40 : 170));
    }
    await new Promise((r) => setTimeout(r, 500));
    setPhase("result");
  }

  return (
    <div className="rounded-[2rem] border border-border/60 bg-card/40 p-6 backdrop-blur-xl md:p-8">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            const doc = await extractDocument(file);
            await run(doc.text || SAMPLE, doc.fileName);
          } catch {
            await run(SAMPLE, "sample syllabus");
          }
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="type-caption">A real syllabus, read here in your browser. No account.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => void run(SAMPLE, "sample syllabus")}
                className="focus-organic min-h-11 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Read the sample
              </button>
              <button
                onClick={() => inputRef.current?.click()}
                className="focus-organic min-h-11 rounded-full border border-border px-6 text-sm text-muted-foreground hover:border-moss hover:text-foreground"
              >
                Use my own file
              </button>
            </div>
          </motion.div>
        )}

        {phase !== "idle" && (
          <motion.div key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="type-label text-moss">reading {source}</p>
            <ul className="type-caption mt-4 min-h-[9rem] space-y-1.5 font-mono">
              {found.slice(-6).map((line, i) => (
                <motion.li key={`${line}-${i}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  {line}
                </motion.li>
              ))}
            </ul>

            {phase === "result" && (
              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
                className="mt-6 rounded-3xl border border-canopy/35 bg-canopy/10 p-6"
              >
                <p className="type-label text-canopy">the one that will cost you</p>
                <h3 className="type-h2 mt-3 text-foreground">
                  {found.find((f) => /stereo|chiral/i.test(f)) ?? found[3] ?? "Stereochemistry"}
                </h3>
                <p className="type-body mt-3 text-muted-foreground">
                  It sits three weeks before the heaviest graded item, and everything after it assumes you already
                  hold it. SYLVA plants it first.
                </p>
                <button
                  onClick={() => setPhase("idle")}
                  className="focus-organic type-caption mt-4 underline-offset-4 hover:underline"
                >
                  run it again
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
