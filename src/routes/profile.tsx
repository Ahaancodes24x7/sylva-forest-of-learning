import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import { AppShell, PageHeader } from "@/components/sylva/AppShell";
import { useSylva } from "@/components/sylva/SylvaProvider";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your patterns — SYLVA" },
      {
        name: "description",
        content:
          "Plain-language patterns SYLVA has noticed in how you work, and the adaptations you can switch off at any time.",
      },
      { property: "og:title", content: "Your patterns — SYLVA" },
      { property: "og:description", content: "Helpful patterns, never labels. Every adaptation is optional." },
    ],
  }),
  component: ProfilePage,
});

const patterns = [
  {
    key: "chunkLongTasks" as const,
    pattern: "You tend to start strong on short tasks and lose steam after about 20 minutes.",
    adaptation: "SYLVA now breaks your longer tasks into shorter chunks automatically.",
  },
  {
    key: "warmStarts" as const,
    pattern: "Starting is harder for you than continuing, especially on unfamiliar material.",
    adaptation: "Before hard assignments, SYLVA offers a short primer you can always skip.",
  },
  {
    key: "reEntryCards" as const,
    pattern: "After a few days away, you spend a while rebuilding where you were.",
    adaptation: "SYLVA saves your last place and hands it back when you return.",
  },
  {
    key: "spacedReview" as const,
    pattern: "Concepts you learn in dense weeks fade faster than ones you learn in quiet weeks.",
    adaptation: "SYLVA spaces reviews of dense-week material a little closer together.",
  },
];

function ProfilePage() {
  const reduced = useReducedMotion() ?? false;
  const { adaptations, toggleAdaptation } = useSylva();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Quietly noticed"
        title="How you tend to work."
        sub="These are patterns, not labels. Turn off any adaptation and SYLVA stops using it immediately."
      />

      <div className="space-y-4">
        {patterns.map((p, i) => (
          <motion.article
            key={p.key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.05 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft"
          >
            <p className="text-lg leading-relaxed text-foreground">{p.pattern}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.adaptation}</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                {adaptations[p.key] ? "This adaptation is on" : "This adaptation is off"}
              </span>
              <button
                role="switch"
                aria-checked={adaptations[p.key]}
                aria-label={`Adaptation: ${p.adaptation}`}
                onClick={() => toggleAdaptation(p.key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  adaptations[p.key] ? "bg-moss" : "bg-muted"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="absolute top-1 size-5 rounded-full bg-card shadow-soft"
                  style={{ left: adaptations[p.key] ? 26 : 4 }}
                />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        SYLVA never assigns you a category, score, or diagnosis, and never shares these observations with your
        school or anyone else.
      </p>
    </AppShell>
  );
}
