import { motion, useReducedMotion } from "framer-motion";

import { LeafIcon, SeedIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { conceptById, todaySummary } from "@/data/sylva";

export function TodayCard({ onPick }: { onPick: (conceptId: string) => void }) {
  const reduced = useReducedMotion() ?? false;
  const { openLesson } = useSylva();

  return (
    <motion.section
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.35 }}
      aria-label="Today"
      className="glass-panel pointer-events-auto w-[min(320px,calc(100vw-2rem))] rounded-3xl p-5"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">Today</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        <span className="inline-flex items-center gap-1.5">
          <LeafIcon className="size-4 text-moss animate-breathe" />
          {todaySummary.reviewReady} concepts ready for review
        </span>
        <br />
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <SeedIcon className="size-4 text-canopy" />
          {todaySummary.nextDeadline}
        </span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {todaySummary.reviewConceptIds.map((id) => {
          const concept = conceptById(id);
          if (!concept) return null;
          return (
            <motion.button
              key={id}
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={reduced ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              onClick={() => onPick(id)}
              className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-foreground"
            >
              {concept.name}
            </motion.button>
          );
        })}
      </div>
      <motion.button
        whileHover={reduced ? {} : { scale: 1.03 }}
        whileTap={reduced ? {} : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        onClick={() => openLesson("stereochemistry", { warmStart: true })}
        className="mt-4 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Start today's 4-minute primer
      </motion.button>
    </motion.section>
  );
}
