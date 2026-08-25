import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { DecayChart } from "@/components/sylva/DecayChart";
import { LeafIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { conceptById, courseById, microLessons, stateMeta } from "@/data/sylva";

export function ConceptPanel({
  conceptId,
  onClose,
}: {
  conceptId: string | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const { openLesson, sprouted } = useSylva();
  const concept = conceptId ? conceptById(conceptId) : undefined;

  return (
    <AnimatePresence>
      {concept && (
        <motion.aside
          key={concept.id}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          aria-label={`${concept.name} detail`}
          className="fixed bottom-16 right-0 top-auto z-30 max-h-[70dvh] w-full overflow-y-auto rounded-t-3xl border-t border-border bg-card/90 p-6 backdrop-blur-xl shadow-soft md:bottom-0 md:top-0 md:max-h-none md:w-[380px] md:rounded-none md:border-l md:border-t-0"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-moss">
                {courseById(concept.courseId)?.name}
              </p>
              <h2 className="mt-1 text-2xl text-foreground">{concept.name}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close concept detail"
              className="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              <span className={`size-2 rounded-full ${stateMeta[concept.state].dot}`} />
              {stateMeta[concept.state].label}
            </span>
            <span className="text-muted-foreground">Last reviewed {concept.lastReviewed}</span>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">Mastery today</p>
              <p className="text-2xl text-foreground">{Math.round(concept.mastery * 100)}%</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-moss"
                initial={{ width: 0 }}
                animate={{ width: `${concept.mastery * 100}%` }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              />
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{concept.note}</p>

          <div className="mt-6">
            <p className="mb-1 text-sm font-medium text-foreground">Next 30 days</p>
            <p className="mb-2 text-xs text-muted-foreground">
              Solid line: if left alone. Dashed: if you refresh it today.
            </p>
            <DecayChart concept={concept} />
          </div>

          {microLessons[concept.id] ? (
            <motion.button
              whileHover={reduced ? {} : { scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={() => openLesson(concept.id)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground shadow-soft"
            >
              <LeafIcon className="size-4" />
              Review this concept
            </motion.button>
          ) : (
            <p className="mt-6 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
              No refresher needed right now — SYLVA will surface one when this starts to fade.
            </p>
          )}

          {sprouted.includes(concept.id) && (
            <p className="mt-3 text-center text-xs text-moss">Refreshed today · a leaf grew on this tree</p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
