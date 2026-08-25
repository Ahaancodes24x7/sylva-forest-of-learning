import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/sylva/AppShell";
import { DecayChart } from "@/components/sylva/DecayChart";
import { LeafIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { courses, microLessons, stateMeta } from "@/data/sylva";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge map — SYLVA" },
      {
        name: "description",
        content:
          "Mastery probability over time for every concept, with a two-minute refresh available on anything that's fading.",
      },
      { property: "og:title", content: "Knowledge map — SYLVA" },
      {
        property: "og:description",
        content: "Decay curves per concept, and a short refresh where it counts.",
      },
    ],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const reduced = useReducedMotion() ?? false;
  const { openLesson, sprouted } = useSylva();
  const [courseId, setCourseId] = useState(courses[0]!.id);
  const course = courses.find((c) => c.id === courseId)!;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Knowledge map"
        title="What's holding, what's fading."
        sub="Each curve is one concept's chance of being recallable. Refresh anything drifting downward."
      />

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Courses">
        {courses.map((c) => (
          <motion.button
            key={c.id}
            role="tab"
            aria-selected={c.id === courseId}
            whileHover={reduced ? {} : { scale: 1.03 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            onClick={() => setCourseId(c.id)}
            className={`min-h-11 rounded-full px-4 text-sm ${
              c.id === courseId
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name}
          </motion.button>
        ))}
      </div>

      <div className="space-y-4">
        {course.concepts.map((concept, i) => {
          const fading = concept.state === "at-risk" || concept.state === "mastered-decaying";
          const hasLesson = Boolean(microLessons[concept.id]);
          return (
            <motion.article
              key={concept.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.04 }}
              className="rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl text-foreground">{concept.name}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`size-2 rounded-full ${stateMeta[concept.state].dot}`} />
                    {stateMeta[concept.state].label} · {Math.round(concept.mastery * 100)}% · last reviewed{" "}
                    {concept.lastReviewed}
                  </p>
                </div>
                {fading && (
                  <motion.button
                    whileHover={reduced ? {} : { scale: 1.03 }}
                    whileTap={reduced ? {} : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    onClick={() => { if (hasLesson) openLesson(concept.id); }}
                    disabled={!hasLesson}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  >
                    <LeafIcon className="size-4" />
                    {hasLesson ? "Review now" : "Refresher coming"}
                  </motion.button>
                )}
              </div>

              {fading && (
                <p className="mt-3 rounded-2xl bg-accent/60 p-3 text-sm text-accent-foreground">
                  This concept is fading — a 2-minute refresh now saves you 20 minutes before the exam.
                </p>
              )}

              <div className="mt-4">
                <DecayChart concept={concept} height={150} />
              </div>

              {sprouted.includes(concept.id) && (
                <p className="mt-2 text-xs text-moss">Refreshed today · a leaf grew on this tree</p>
              )}
            </motion.article>
          );
        })}
      </div>
    </AppShell>
  );
}
