import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { ForestCanvas } from "@/components/forest/ForestCanvas";
import { IsoForest } from "@/components/forest/IsoForest";
import { AppShell } from "@/components/sylva/AppShell";
import { ConceptPanel } from "@/components/sylva/ConceptPanel";
import { ReEntryCard } from "@/components/sylva/ReEntryCard";
import { TodayCard } from "@/components/sylva/TodayCard";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { courses, stateMeta } from "@/data/sylva";

export const Route = createFileRoute("/forest")({
  head: () => ({
    meta: [
      { title: "Your forest — SYLVA" },
      {
        name: "description",
        content:
          "A living forest of every concept in your semester: fresh canopies, fading leaves, dormant seeds and what needs attention today.",
      },
      { property: "og:title", content: "Your forest — SYLVA" },
      {
        property: "og:description",
        content: "Every concept as a tree: what's held, what's fading, what's next.",
      },
    ],
  }),
  component: ForestPage,
});

function ForestPage() {
  const reduced = useReducedMotion() ?? false;
  const { isMobile, isDark, sprouted, openLesson, adaptations } = useSylva();
  const [activeCourseId, setActiveCourseId] = useState<string | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const matches = query
    ? courses.flatMap((c) => c.concepts).filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AppShell bleed>
      <div className="relative h-dvh w-full overflow-hidden">
        {/* canvas / iso fallback */}
        <div className="absolute inset-0">
          {isMobile ? (
            <IsoForest
              activeCourseId={activeCourseId}
              selectedConceptId={selected}
              onSelectConcept={setSelected}
            />
          ) : (
            <ForestCanvas
              activeCourseId={activeCourseId}
              selectedConceptId={selected}
              onSelectConcept={setSelected}
              isDark={isDark}
              reducedMotion={reduced}
              sproutedConceptIds={sprouted}
            />
          )}
        </div>

        {/* glass header */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 p-4">
          <div className="glass-panel pointer-events-auto mx-auto flex max-w-4xl flex-wrap items-center gap-2 rounded-3xl px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <CoursePill label="All" active={activeCourseId === "all"} onClick={() => setActiveCourseId("all")} />
              {courses.map((course) => (
                <CoursePill
                  key={course.id}
                  label={course.short}
                  active={activeCourseId === course.id}
                  onClick={() => setActiveCourseId(course.id)}
                />
              ))}
            </div>
            <div className="relative ml-auto flex items-center gap-2">
              <label className="sr-only" htmlFor="concept-search">
                Search concepts
              </label>
              <input
                id="concept-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search concepts"
                className="h-10 w-36 rounded-full border border-border bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground sm:w-48"
              />
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                AL
              </span>
              {matches.length > 0 && (
                <ul className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  {matches.slice(0, 5).map((concept) => (
                    <li key={concept.id}>
                      <button
                        onClick={() => {
                          setSelected(concept.id);
                          setQuery("");
                        }}
                        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                      >
                        {concept.name}
                        <span className={`size-2 shrink-0 rounded-full ${stateMeta[concept.state].dot}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>

        {/* legend */}
        <div className="pointer-events-none absolute right-4 top-24 z-10 hidden lg:block">
          <ul className="glass-panel rounded-2xl px-4 py-3 text-xs">
            {Object.values(stateMeta).map((meta) => (
              <li key={meta.label} className="flex items-center gap-2 py-0.5 text-muted-foreground">
                <span className={`size-2 rounded-full ${meta.dot}`} />
                <span className="text-foreground">{meta.label}</span> · {meta.description}
              </li>
            ))}
          </ul>
        </div>

        {/* today card */}
        <div className="pointer-events-none absolute bottom-24 left-4 z-20 md:bottom-6">
          <TodayCard onPick={(id) => setSelected(id)} />
        </div>

        <ConceptPanel conceptId={selected} onClose={() => setSelected(null)} />

        {adaptations.reEntryCards && !selected && (
          <ReEntryCard onResume={() => openLesson("stereochemistry", { warmStart: true })} />
        )}
      </div>
    </AppShell>
  );
}

function CoursePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.button
      whileHover={reduced ? {} : { scale: 1.03 }}
      whileTap={reduced ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-10 rounded-full px-4 text-sm transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-background/60 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </motion.button>
  );
}
