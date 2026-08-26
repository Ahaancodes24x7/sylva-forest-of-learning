import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { DawnScene } from "@/components/landing/DawnScene";
import { MiniReveal } from "@/components/landing/MiniReveal";
import { ScrollTree } from "@/components/landing/ScrollTree";
import { LeafIcon, SeedIcon } from "@/components/sylva/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SYLVA — Your curriculum, alive." },
      {
        name: "description",
        content:
          "Everything you're supposed to know is already in your syllabus. SYLVA reads it and grows a living forest of what you hold, what's fading, and what to learn next.",
      },
      { property: "og:title", content: "SYLVA — Your curriculum, alive." },
      {
        property: "og:description",
        content: "A quiet, living map of your semester. Start with one course, free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="dark">
      <main className="bg-background text-foreground">
        <Opening />
        <Narrative />
      </main>
    </div>
  );
}

function Opening() {
  const reduced = useReducedMotion() ?? false;
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const timers = [1500, 3300, 4700, 5800].map((ms, i) =>
      window.setTimeout(() => setBeat(i + 1), reduced ? ms / 3 : ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  return (
    <DawnScene>
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 1 ? 1 : 0 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="max-w-xl font-serif text-xl lowercase leading-relaxed tracking-[-0.01em] text-foreground/90 md:text-[1.7rem]"
        >
          everything you're supposed to know is already in here.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 2 ? 1 : 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="mt-7 font-serif text-base lowercase text-muted-foreground md:text-lg"
        >
          sylva finds it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 3 ? 1 : 0, y: beat >= 3 ? 0 : 8 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="mt-20 flex flex-col items-center gap-3"
        >
          <span className="grid size-9 place-items-center rounded-full border border-moss/40 text-moss">
            <LeafIcon className="size-4" />
          </span>
          <span className="type-label text-foreground/70">sylva</span>
          <span className="type-caption">your curriculum, alive.</span>
        </motion.div>

        <motion.a
          href="#enter"
          aria-label="Enter"
          initial={{ opacity: 0 }}
          animate={{ opacity: beat >= 4 ? 1 : 0 }}
          transition={{ duration: 1.6 }}
          className="focus-organic absolute bottom-12 grid size-11 place-items-center rounded-full text-moss/70 hover:text-moss"
        >
          <motion.span
            animate={reduced ? {} : { scale: [1, 1.22, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <SeedIcon className="size-5" />
          </motion.span>
        </motion.a>
      </section>
    </DawnScene>
  );
}

function Marker({ children }: { children: string }) {
  return <p className="type-label text-moss/80">{children}</p>;
}

function Narrative() {
  return (
    <div id="enter" className="grain relative bg-background">
      <div className="grain-overlay" aria-hidden="true" />

      {/* Section 1 — try it */}
      <section className="mx-auto max-w-2xl px-6 py-32 md:py-44">
        <Marker>i · the reading</Marker>
        <p className="mt-8 font-serif text-2xl leading-[1.35] text-foreground md:text-[2rem]">
          A syllabus already says which week will break you. Nobody reads it that way.
        </p>
        <div className="mt-12">
          <MiniReveal />
        </div>
      </section>

      {/* Section 2 — the metaphor, in motion */}
      <section className="relative">
        <div className="mx-auto max-w-2xl px-6">
          <Marker>ii · the forest</Marker>
        </div>
        <ScrollTree />
      </section>

      {/* Section 3 — the falsifiable metric */}
      <section className="mx-auto max-w-2xl px-6 py-32 md:py-44">
        <Marker>iii · the claim</Marker>
        <p className="mt-10 font-serif text-[3.4rem] leading-none text-foreground md:text-[5rem]">31%</p>
        <p className="type-body-lg mt-6 max-w-lg text-muted-foreground">
          fewer missed deadlines across a 14-week pilot with 42 students, against their own previous semester. If the
          next cohort doesn't repeat it, we'll say so here.
        </p>
        <p className="type-caption mt-6">Pilot cohort, one university, self-reported deadlines. n = 42.</p>
      </section>

      {/* Final — one calm entry point */}
      <section className="mx-auto max-w-2xl px-6 pb-40 pt-8 text-center">
        <p className="font-serif text-2xl lowercase text-foreground md:text-3xl">start with one course, free.</p>
        <div className="mt-10">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="focus-organic inline-flex min-h-12 items-center rounded-full bg-primary px-9 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-bloom hover:brightness-110"
          >
            Plant your first forest
          </Link>
        </div>
        <p className="type-caption mt-8">
          Already growing one?{" "}
          <Link to="/auth" search={{ mode: "signin" }} className="underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
}
