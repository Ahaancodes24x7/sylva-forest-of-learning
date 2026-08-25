import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/sylva/AppShell";
import { useSylva } from "@/components/sylva/SylvaProvider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & privacy — SYLVA" },
      {
        name: "description",
        content:
          "Every data-collecting feature has its own toggle, a plain-English explanation, and a clear note on what it does not do.",
      },
      { property: "og:title", content: "Settings & privacy — SYLVA" },
      { property: "og:description", content: "Plain toggles, plain language, no dark patterns." },
    ],
  }),
  component: SettingsPage,
});

const dataSettings = [
  {
    id: "study-timing",
    title: "Study session timing",
    does: "Records how long your sessions run so tasks can be chunked to fit you.",
    doesNot: "Does not record what you type, which windows you open, or your screen.",
  },
  {
    id: "recall-checks",
    title: "Recall checks",
    does: "Stores your answers to concept checks to estimate what's fading.",
    doesNot: "Does not grade you, and is never shared with your instructors.",
  },
  {
    id: "deadline-import",
    title: "Deadline import",
    does: "Reads dates from syllabi you upload to build your semester trail.",
    doesNot: "Does not connect to your school accounts or email.",
  },
  {
    id: "reentry-memory",
    title: "Re-entry memory",
    does: "Remembers the last line you were working on so you can resume.",
    doesNot: "Does not keep your document contents after you finish the assignment.",
  },
];

function SettingsPage() {
  const reduced = useReducedMotion() ?? false;
  const { resetOnboarding } = useSylva();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(dataSettings.map((s) => [s.id, true])),
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Settings & privacy"
        title="You decide what SYLVA sees."
        sub="Each feature explains what it does and what it will never do. Turning something off takes effect right away."
      />

      <ul className="space-y-3">
        {dataSettings.map((setting, i) => (
          <motion.li
            key={setting.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.04 }}
            className="rounded-3xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg text-foreground">{setting.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{setting.does}</p>
                <p className="mt-2 inline-flex rounded-xl bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                  What this does not do: {setting.doesNot}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={enabled[setting.id]}
                aria-label={setting.title}
                onClick={() => setEnabled((prev) => ({ ...prev, [setting.id]: !prev[setting.id] }))}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  enabled[setting.id] ? "bg-moss" : "bg-muted"
                }`}
              >
                <motion.span
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="absolute top-1 size-5 rounded-full bg-card shadow-soft"
                  style={{ left: enabled[setting.id] ? 26 : 4 }}
                />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg text-foreground">Your data</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Export gives you a plain JSON file of everything SYLVA holds. Delete removes it all, permanently, with no
          waiting period.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <motion.button
            whileHover={reduced ? {} : { scale: 1.03 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            onClick={() => setMessage("Your export is ready — check your downloads.")}
            className="min-h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Export my data
          </motion.button>
          <motion.button
            whileHover={reduced ? {} : { scale: 1.03 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            onClick={() => setConfirmDelete(true)}
            className="min-h-11 rounded-full border border-terracotta/50 px-5 text-sm font-medium text-terracotta"
          >
            Delete everything
          </motion.button>
          <button
            onClick={() => {
              resetOnboarding();
              setMessage("Onboarding reset — visit the home screen to run it again.");
            }}
            className="min-h-11 rounded-full px-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Replay onboarding (demo)
          </button>
        </div>

        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="mt-5 rounded-2xl bg-muted p-4"
            >
              <p className="text-sm text-foreground">
                This deletes your forest, your history, and every pattern SYLVA has noticed. It can't be undone.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    setMessage("Everything has been deleted.");
                  }}
                  className="min-h-11 rounded-full bg-terracotta px-5 text-sm font-medium text-destructive-foreground"
                >
                  Yes, delete everything
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="min-h-11 rounded-full px-4 text-sm text-muted-foreground"
                >
                  Keep my data
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {message && (
          <p className="mt-4 text-sm text-moss" role="status">
            {message}
          </p>
        )}
      </section>
    </AppShell>
  );
}
