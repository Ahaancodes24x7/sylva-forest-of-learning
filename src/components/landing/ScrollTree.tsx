import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LINES = [
  "a bare tree is a concept you have not met yet.",
  "canopy is what you currently hold.",
  "leaves fall on their own — that is the part nobody plans for.",
];

export function ScrollTree() {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const canopy = useTransform(scrollYProgress, [0.15, 0.62], [0, 1]);
  const canopyScale = useTransform(canopy, [0, 1], [0.55, 1]);
  const glow = useTransform(scrollYProgress, [0.2, 0.7], [0, 0.75]);

  return (
    <div ref={ref} className="relative min-h-[190vh] py-24">
      <div className="sticky top-0 flex min-h-dvh flex-col items-center justify-center gap-10 px-6">
        <div className="relative h-[42vh] w-full max-w-md">
          <motion.div
            className="absolute inset-0 -z-10"
            style={{ opacity: reduced ? 0.5 : glow, background: "var(--gradient-glow)" }}
            aria-hidden="true"
          />
          <svg viewBox="0 0 200 240" className="h-full w-full text-primary" fill="none" aria-hidden="true">
            <path
              d="M100 240 C97 190 103 170 100 108"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {[
              "M100 150 q -20 -14 -40 -26",
              "M100 138 q 20 -14 42 -24",
              "M100 122 q -16 -16 -30 -32",
              "M100 114 q 18 -18 34 -32",
            ].map((d, i) => (
              <path key={i} d={d} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity={0.8} />
            ))}
            <motion.g style={{ scale: reduced ? 1 : canopyScale, opacity: reduced ? 1 : canopy, originX: "100px", originY: "90px" }}>
              <circle cx="100" cy="82" r="46" className="fill-moss/45" />
              <circle cx="66" cy="102" r="26" className="fill-moss/35" />
              <circle cx="136" cy="100" r="28" className="fill-moss/30" />
              <circle cx="112" cy="60" r="22" className="fill-canopy/30" />
            </motion.g>
          </svg>
        </div>

        <div className="max-w-md space-y-5 text-center">
          {LINES.map((line, i) => {
            const start = 0.2 + i * 0.16;
            return <ScrollLine key={line} progress={scrollYProgress} start={start} text={line} reduced={reduced} />;
          })}
        </div>
      </div>
    </div>
  );
}

function ScrollLine({
  progress,
  start,
  text,
  reduced,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  text: string;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const y = useTransform(progress, [start, start + 0.1], [12, 0]);
  return (
    <motion.p
      style={reduced ? {} : { opacity, y }}
      className="font-serif text-lg lowercase leading-relaxed text-foreground/85 md:text-xl"
    >
      {text}
    </motion.p>
  );
}
