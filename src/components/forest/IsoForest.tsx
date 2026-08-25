import { motion, useReducedMotion } from "framer-motion";

import { courses, type Concept } from "@/data/sylva";

/** Lightweight 2D/isometric equivalent of the 3D forest, used on small screens. */
export function IsoForest({
  activeCourseId,
  selectedConceptId,
  onSelectConcept,
}: {
  activeCourseId: string | "all";
  selectedConceptId: string | null;
  onSelectConcept: (id: string) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const visible = activeCourseId === "all" ? courses : courses.filter((c) => c.id === activeCourseId);

  return (
    <div className="h-full w-full overflow-y-auto px-4 pb-40 pt-24">
      <div className="space-y-8">
        {visible.map((course) => (
          <section key={course.id}>
            <h2 className="mb-3 text-lg text-foreground">{course.name}</h2>
            <div className="grid grid-cols-3 gap-3">
              {course.concepts.map((concept, i) => (
                <motion.button
                  key={concept.id}
                  onClick={() => onSelectConcept(concept.id)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 120, damping: 14 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  aria-pressed={selectedConceptId === concept.id}
                  className={`flex flex-col items-center gap-2 rounded-2xl border bg-card/70 p-3 text-center shadow-soft transition-colors ${
                    selectedConceptId === concept.id ? "border-moss" : "border-border"
                  }`}
                >
                  <IsoTree concept={concept} />
                  <span className="text-[11px] leading-tight text-muted-foreground">{concept.name}</span>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function IsoTree({ concept }: { concept: Concept }) {
  const s = concept.state;
  return (
    <span className="relative flex h-16 w-full items-end justify-center">
      {s === "at-risk" && (
        <span className="absolute bottom-1 size-9 rounded-full bg-canopy/50 blur-md animate-soft-glow" />
      )}
      <svg viewBox="0 0 48 48" className="relative h-16 w-12" aria-hidden="true">
        <ellipse cx="24" cy="43" rx="12" ry="3" className="fill-muted" />
        {s === "not-covered" ? (
          <circle cx="24" cy="39" r="4" className="fill-muted-foreground/50" />
        ) : (
          <>
            <rect
              x="22"
              y={s === "in-progress" ? 26 : 20}
              width="4"
              height={s === "in-progress" ? 16 : 22}
              rx="2"
              className="fill-bark"
            />
            <g
              className={
                s === "mastered-decaying"
                  ? "fill-moss/50"
                  : s === "mastered-fresh"
                    ? "fill-primary"
                    : "fill-moss"
              }
            >
              <circle cx="24" cy={s === "in-progress" ? 22 : 16} r={s === "in-progress" ? 6 : 10} />
              {s !== "in-progress" && <circle cx="15" cy="22" r="6" />}
              {s !== "in-progress" && <circle cx="33" cy="22" r="6" />}
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
