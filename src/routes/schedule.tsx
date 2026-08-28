import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { AppShell, PageHeader } from "@/components/sylva/AppShell";
import { LeafIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { days, kindLabel, type ScheduleBlock } from "@/data/schedule";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "This week's schedule — SYLVA" },
      {
        name: "description",
        content:
          "Your week laid out by course or by what it's worth to your grade, with reviews auto-slotted and deadlines that won't budge.",
      },
      { property: "og:title", content: "This week's schedule — SYLVA" },
      {
        property: "og:description",
        content: "Course lanes, grade weight, and honest estimates of how long things actually take you.",
      },
    ],
  }),
  component: SchedulePage,
});

type View = "course" | "grade";

function SchedulePage() {
  const reduced = useReducedMotion() ?? false;
  const { blocks, courses, courseById, moveBlock, toast, openLesson } = useSylva();
  const [view, setView] = useState<View>("course");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  const perDayHours = useMemo(() => {
    const totals = days.map(() => 0);
    blocks.forEach((b) => {
      totals[b.day] = (totals[b.day] ?? 0) + b.estHours;
    });
    return totals;
  }, [blocks]);

  const heaviest = Math.max(1, ...perDayHours);
  const gradeAtStake = blocks.reduce((sum, b) => (b.kind === "deadline" ? sum + b.weight : sum), 0);

  function drop(blockId: string, day: number) {
    const ok = moveBlock(blockId, day);
    if (!ok) {
      setShakeId(blockId);
      window.setTimeout(() => setShakeId(null), 500);
      toast("That one has a hard deadline — it can't move later.", "gentle");
    } else {
      toast("Moved. Your week rebalanced around it.");
    }
  }

  if (blocks.length === 0) {
    return (
      <AppShell>
        <PageHeader eyebrow="Schedule" title="Nothing scheduled yet." sub="Import a syllabus and its dates land here as a week you can rearrange." />
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <p className="type-body text-muted-foreground">Your week is empty. That's allowed.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="This week"
        title="What's due, and what it's worth."
        sub="Drag anything to a lighter day. Hard deadlines stay where they are — they'll tell you so."
      />

      {/* view toggle */}
      <div className="mb-6 inline-flex rounded-full border border-border bg-card/70 p-1">
        {(["course", "grade"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-pressed={view === v}
            className={`focus-organic min-h-10 rounded-full px-5 text-sm transition-colors ${
              view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {v === "course" ? "By course" : "By grade weight"}
          </button>
        ))}
      </div>

      {/* workload strip */}
      <section aria-label="Workload this week" className="mb-8 rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-baseline justify-between">
          <p className="type-label text-moss">Workload</p>
          <p className="type-caption">{gradeAtStake}% of your final grade lands this week</p>
        </div>
        <div className="mt-4 flex items-end gap-2">
          {days.map((label, i) => {
            const hours = perDayHours[i] ?? 0;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(6, (hours / heaviest) * 64)}px` }}
                  transition={{ type: "spring", stiffness: 110, damping: 18, delay: i * 0.03 }}
                  className={`w-full rounded-t-lg ${hours > heaviest * 0.75 ? "bg-canopy/70" : "bg-moss/50"}`}
                />
                <span className="type-caption">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {view === "course" ? (
        <div className="space-y-8">
          {courses
            .filter((course) => blocks.some((b) => b.courseId === course.id))
            .map((course) => (
              <section key={course.id}>
                <h2 className="type-h3 mb-3 flex items-center gap-2 text-foreground">
                  <span className="size-2.5 rounded-full" style={{ background: course.accent }} />
                  {course.name}
                </h2>
                <div className="grid grid-cols-7 gap-1.5">
                  {days.map((label, day) => (
                    <div
                      key={label}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragId) drop(dragId, day);
                        setDragId(null);
                      }}
                      className={`min-h-24 rounded-2xl border p-1.5 transition-colors ${
                        dragId ? "border-moss/50 bg-secondary/40" : "border-border bg-card/50"
                      }`}
                    >
                      <p className="type-caption mb-1 text-center">{label}</p>
                      {blocks
                        .filter((b) => b.courseId === course.id && b.day === day)
                        .map((b) => (
                          <BlockChip
                            key={b.id}
                            block={b}
                            accent={course.accent}
                            shake={shakeId === b.id}
                            reduced={reduced}
                            onDragStart={() => setDragId(b.id)}
                            onClick={() => setSelectedId(b.id)}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      ) : (
        <div className="space-y-6">
          {[
            { label: "Heavy — 15% or more", test: (b: ScheduleBlock) => b.weight >= 15 },
            { label: "Moderate — 5% to 14%", test: (b: ScheduleBlock) => b.weight >= 5 && b.weight < 15 },
            { label: "Light or ungraded", test: (b: ScheduleBlock) => b.weight < 5 },
          ].map((band) => {
            const items = blocks.filter(band.test).sort((a, b) => b.weight - a.weight);
            if (items.length === 0) return null;
            return (
              <section key={band.label}>
                <h2 className="type-h3 mb-3 text-foreground">{band.label}</h2>
                <ul className="space-y-2">
                  {items.map((b) => (
                    <li key={b.id}>
                      <button
                        onClick={() => setSelectedId(b.id)}
                        className="focus-organic flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-colors hover:border-moss/50"
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ background: courseById(b.courseId)?.accent ?? "var(--course-1)" }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="type-body block truncate text-foreground">{b.title}</span>
                          <span className="type-caption">
                            {kindLabel[b.kind]} · {days[b.day]} · {b.estHours}h estimated
                          </span>
                        </span>
                        <span className="type-h3 shrink-0 text-foreground">{b.weight}%</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {/* detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            aria-label={`${selected.title} detail`}
            className="glass-panel fixed inset-x-4 bottom-24 z-40 rounded-3xl p-6 md:bottom-6 md:left-auto md:right-6 md:w-[360px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="type-label text-moss">{kindLabel[selected.kind]}</p>
                <h3 className="type-h2 mt-1 text-foreground">{selected.title}</h3>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Close detail"
                className="focus-organic type-caption rounded-full px-3 py-1 hover:text-foreground"
              >
                Close
              </button>
            </div>
            <p className="type-body mt-4 text-muted-foreground">{selected.detail}</p>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-muted/60 p-3">
                <dt className="type-caption">Worth</dt>
                <dd className="type-h3 text-foreground">{selected.weight}%</dd>
              </div>
              <div className="rounded-2xl bg-muted/60 p-3">
                <dt className="type-caption">Estimated</dt>
                <dd className="type-h3 text-foreground">{selected.estHours}h</dd>
              </div>
              <div className="rounded-2xl bg-muted/60 p-3">
                <dt className="type-caption">You usually</dt>
                <dd className="type-h3 text-foreground">{selected.actualHours ? `${selected.actualHours}h` : "—"}</dd>
              </div>
            </dl>
            {selected.conceptId && (
              <button
                onClick={() => openLesson(selected.conceptId!, { warmStart: true })}
                className="focus-organic mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft"
              >
                <LeafIcon className="size-4" />
                Warm up this concept
              </button>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function BlockChip({
  block,
  accent,
  shake,
  reduced,
  onDragStart,
  onClick,
}: {
  block: ScheduleBlock;
  accent: string;
  shake: boolean;
  reduced: boolean;
  onDragStart: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      animate={shake && !reduced ? { x: [0, -5, 5, -3, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      title={block.title}
      className={`focus-organic mb-1 w-full truncate rounded-xl px-1.5 py-1 text-left text-[10px] leading-tight ${
        block.hardDeadline ? "bg-canopy/25 text-foreground" : "bg-secondary text-secondary-foreground"
      }`}
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      {block.title}
    </motion.button>
  );
}
