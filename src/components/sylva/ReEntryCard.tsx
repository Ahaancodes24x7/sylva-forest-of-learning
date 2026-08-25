import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { RootIcon } from "@/components/sylva/icons";
import { reEntry } from "@/data/sylva";

export function ReEntryCard({ onResume }: { onResume?: () => void }) {
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          className="fixed bottom-20 left-1/2 z-30 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl bg-card/85 p-5 backdrop-blur-xl shadow-soft md:bottom-6"
          aria-label="Welcome back"
        >
          <div className="flex items-start gap-4">
            <motion.span
              initial={reduced ? {} : { pathLength: 0, opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground"
            >
              <RootIcon className="size-5" />
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Welcome back.</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                You were on <span className="text-foreground">{reEntry.wasOn}</span> in {reEntry.assignment}. Next
                planned step: <span className="text-foreground">{reEntry.nextStep}</span>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <motion.button
                  whileHover={reduced ? {} : { scale: 1.03 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  onClick={() => {
                    setOpen(false);
                    onResume?.();
                  }}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Pick up where I left off
                </motion.button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
