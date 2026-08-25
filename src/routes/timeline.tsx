import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { AppShell, PageHeader } from "@/components/sylva/AppShell";
import { semester, type SemesterWeek } from "@/data/sylva";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "The collision zone — SYLVA" },
      {
        name: "description",
        content:
          "Your semester as a winding forest trail: dense thickets where deadlines collide, open clearings where you can breathe.",
      },
      { property: "og:title", content: "The collision zone — SYLVA" },
      {
        property: "og:description",
        content: "See which weeks pile up — and how prep was moved earlier to soften them.",
      },
    ],
  }),
  component: TimelinePage,
});

const chartColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)"];

function TimelinePage() {
  const reduced = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef, axis: "x" });
  const backLayer = useTransform(scrollXProgress, [0, 1], ["0%", "-14%"]);
  const midLayer = useTransform(scrollXProgress, [0, 1], ["0%", "-30%"]);
  const [active, setActive] = useState<SemesterWeek>(semester[5]!);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Collision zone"
        title="Your semester, as a trail."
        sub="Thickets are weeks where deadlines cluster. Clearings are weeks with room. Tap any week to see the plan."
      />

      <section
        aria-label="Semester trail"
        className="relative -mx-5 mb-8 overflow-hidden rounded-none border-y border-border bg-card/50 md:mx-0 md:rounded-3xl md:border"
      >
        {/* parallax background layers */}
        <motion.div
          aria-hidden="true"
          style={{ x: reduced ? "0%" : backLayer }}
          className="pointer-events-none absolute inset-0 opacity-30"
        >
          <TreeRow count={26} size={16} yClass="top-6" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ x: reduced ? "0%" : midLayer }}
          className="pointer-events-none absolute inset-0 opacity-55"
        >
          <TreeRow count={18} size={24} yClass="top-14" />
        </motion.div>

        <div ref={scrollRef} className="relative overflow-x-auto pb-6 pt-28">
          <div className="relative flex min-w-[1100px] items-end gap-0 px-6">
            {/* the winding path */}
            <svg
              viewBox="0 0 1100 80"
              preserveAspectRatio="none"
              className="pointer-events-none absolute bottom-16 left-0 h-20 w-full text-moss/40"
              aria-hidden="true"
            >
              <path
                d="M0 60 C 90 20, 170 78, 260 44 S 430 12, 520 52 S 700 76, 800 36 S 980 20, 1100 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="2 14"
              />
            </svg>

            {semester.map((week, i) => {
              const isActive = active.week === week.week;
              return (
                <motion.button
                  key={week.week}
                  onClick={() => setActive(week)}
                  onMouseEnter={() => setActive(week)}
                  whileHover={reduced ? {} : { y: -4 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  aria-pressed={isActive}
                  className="relative z-10 flex min-h-14 flex-1 flex-col items-center gap-2 rounded-2xl px-1 pb-2 pt-0 focus-visible:bg-secondary/60"
                >
                  <span className="relative flex h-24 items-end justify-center gap-0.5">
                    {week.collision && (
                      <span className="absolute bottom-2 size-14 rounded-full bg-canopy/35 blur-lg animate-soft-glow" />
                    )}
                    {Array.from({ length: week.collision ? 5 : week.load > 55 ? 3 : 1 }).map((_, t) => (
                      <motion.svg
                        key={t}
                        viewBox="0 0 24 40"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, scaleY: 0.4 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.02 + t * 0.04 }}
                        style={{ originY: 1 }}
                        className="relative h-16 w-4 text-primary"
                        aria-hidden="true"
                      >
                        <rect x="10.5" y="20" width="3" height="18" rx="1.5" className="fill-bark" />
                        <circle cx="12" cy="16" r="9" className="fill-current" opacity={0.85} />
                      </motion.svg>
                    ))}
                  </span>
                  <span className={`text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    W{week.week}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{week.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <WeekCard week={active} />
    </AppShell>
  );
}

function TreeRow({ count, size, yClass }: { count: number; size: number; yClass: string }) {
  return (
    <div className={`absolute ${yClass} left-0 flex w-[140%] items-end gap-6 px-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 40" style={{ width: size }} className="text-moss" aria-hidden="true">
          <rect x="10.5" y="22" width="3" height="16" rx="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="12" cy="16" r="9" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

function WeekCard({ week }: { week: SemesterWeek }) {
  const data = week.items.map((item) => ({ name: `${item.course}: ${item.title}`, value: item.weight }));

  return (
    <motion.section
      key={week.week}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="rounded-3xl border border-border bg-card p-6 shadow-soft"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl text-foreground">
          Week {week.week} · {week.label}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            week.collision ? "bg-canopy/25 text-canopy-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {week.collision ? "Thicket · deadlines collide" : "Clearing"}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr]">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={44} outerRadius={72} paddingAngle={3} stroke="none">
                {data.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v}% of grade`, "Weight"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <ul className="space-y-2">
            {week.items.map((item, i) => (
              <li key={item.title} className="flex items-start gap-2 text-sm">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ background: chartColors[i % chartColors.length] }}
                />
                <span className="text-foreground">{item.title}</span>
                <span className="text-muted-foreground">· {item.course} · {item.weight}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl bg-muted p-4 text-sm leading-relaxed text-muted-foreground">
            {week.plan}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
