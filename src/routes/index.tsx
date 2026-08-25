import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { LeafIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SYLVA — Drop in your syllabus" },
      {
        name: "description",
        content:
          "Upload a syllabus and SYLVA maps every concept into a living forest, then tells you what will challenge you first.",
      },
      { property: "og:title", content: "SYLVA — Drop in your syllabus" },
      {
        property: "og:description",
        content: "Turn a syllabus into a living map of what you know and what's fading.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = [
  "Reading course structure…",
  "Mapping concepts…",
  "Modelling how each one fades…",
  "Finding what matters most…",
];

type Phase = "drop" | "parsing" | "insight";

function Onboarding() {
  const reduced = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const { completeOnboarding } = useSylva();
  const [phase, setPhase] = useState<Phase>("drop");
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (phase !== "parsing") return;
    if (step >= steps.length) {
      const t = window.setTimeout(() => setPhase("insight"), 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 900);
    return () => window.clearTimeout(t);
  }, [phase, step]);

  const start = () => {
    setStep(0);
    setPhase("parsing");
  };

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-secondary-foreground">
            <LeafIcon className="size-4" /> SYLVA
          </span>
          <p className="mt-4 text-sm text-muted-foreground">Your curriculum, alive.</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === "drop" && (
            <motion.section
              key="drop"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="rounded-[2rem] bg-card/80 p-8 backdrop-blur-xl shadow-soft"
            >
              <h1 className="text-center text-3xl text-foreground md:text-4xl">Drop in your syllabus.</h1>
              <p className="mx-auto mt-3 max-w-sm text-center text-muted-foreground">
                One PDF is enough. Nothing is shared with your school.
              </p>

              <motion.div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  start();
                }}
                animate={dragging && !reduced ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className={`mt-8 rounded-[2.5rem] border-2 border-dashed p-10 text-center transition-colors ${
                  dragging ? "border-moss bg-secondary/60" : "border-moss/45 bg-background/40"
                }`}
              >
                <motion.span
                  className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground"
                  animate={reduced ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LeafIcon className="size-6" />
                </motion.span>
                <p className="mt-4 text-sm text-muted-foreground">Drag a file here, or</p>
                <motion.button
                  whileHover={reduced ? {} : { scale: 1.03 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  onClick={start}
                  className="mt-4 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft"
                >
                  Choose a syllabus
                </motion.button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Demo: uses a sample semester with three courses.
                </p>
              </motion.div>
            </motion.section>
          )}

          {phase === "parsing" && (
            <motion.section
              key="parsing"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="rounded-[2rem] bg-card/80 p-8 backdrop-blur-xl shadow-soft"
              aria-live="polite"
            >
              <h1 className="text-center text-2xl text-foreground">Reading your semester.</h1>
              <ul className="mx-auto mt-8 max-w-sm space-y-4">
                {steps.map((label, i) => {
                  const active = i === step;
                  const done = i < step;
                  return (
                    <motion.li
                      key={label}
                      animate={{ opacity: done || active ? 1 : 0.35 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <span className="relative grid size-9 shrink-0 place-items-center rounded-2xl bg-secondary">
                        <Seedling leaves={done ? i + 1 : active ? i : 0} />
                      </span>
                      <span className={`text-sm ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
                        {label}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.section>
          )}

          {phase === "insight" && (
            <motion.section
              key="insight"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 26 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 15 }}
              className="rounded-[2rem] bg-card/85 p-8 text-center backdrop-blur-xl shadow-bloom"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-moss">One thing to know</p>
              <h1 className="mt-4 text-3xl leading-snug text-foreground md:text-[2.6rem]">
                Stereochemistry is the concept most likely to challenge you this semester — here's why.
              </h1>
              <p className="mx-auto mt-6 max-w-md text-muted-foreground">
                Three deadlines land in the same week it's assessed, and it's the concept students at your stage
                most often re-learn twice. SYLVA has already begun spreading its prep 18 days early.
              </p>
              <motion.button
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                onClick={() => {
                  completeOnboarding();
                  navigate({ to: "/forest" });
                }}
                className="mt-9 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft"
              >
                See my forest
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Seedling({ leaves }: { leaves: number }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-moss" fill="none" aria-hidden="true">
      <path d="M12 21v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {leaves >= 1 && (
        <motion.path
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12 }}
          style={{ originX: "50%", originY: "100%" }}
          d="M12 14c-4 0-6-2-6-5 3.5 0 6 2 6 5Z"
          fill="currentColor"
        />
      )}
      {leaves >= 2 && (
        <motion.path
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 12 }}
          style={{ originX: "50%", originY: "100%" }}
          d="M12 11c4 0 6-2 6-5-3.5 0-6 2-6 5Z"
          fill="currentColor"
          opacity="0.7"
        />
      )}
    </svg>
  );
}
