import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { LeafIcon, SeedIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";

/** Calm, non-alarming feedback. Gold for gentle blocks, moss for growth. */
export function Toaster() {
  const reduced = useReducedMotion() ?? false;
  const { toasts, dismissToast } = useSylva();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 left-1/2 z-[80] flex w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 md:bottom-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            onClick={() => dismissToast(t.id)}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className={`glass-panel focus-organic pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-left ${
              t.tone === "gentle" ? "border border-canopy/40" : "border border-moss/30"
            }`}
          >
            <span className={t.tone === "gentle" ? "text-canopy" : "text-moss"}>
              {t.tone === "gentle" ? <SeedIcon className="size-4" /> : <LeafIcon className="size-4" />}
            </span>
            <span className="type-body text-sm text-foreground">{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
