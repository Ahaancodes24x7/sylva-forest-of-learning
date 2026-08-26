import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function BareTree({ seed = 1, className = "" }: { seed?: number; className?: string }) {
  const branches = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(seed * 97.3 + n * 31.7) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 7 }, (_, i) => {
      const y = 120 - i * 13 - rand(i) * 6;
      const dir = i % 2 === 0 ? 1 : -1;
      const len = 26 - i * 2.4 + rand(i + 10) * 8;
      return { y, dir, len, lift: 12 + rand(i + 20) * 12 };
    });
  }, [seed]);

  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden="true" fill="none">
      <path d="M60 170 C58 130 62 110 60 40" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {branches.map((b, i) => (
        <path
          key={i}
          d={`M60 ${b.y} q ${(b.dir * b.len) / 2} -${b.lift / 2} ${b.dir * b.len} -${b.lift}`}
          stroke="currentColor"
          strokeWidth={1.5 - i * 0.1}
          strokeLinecap="round"
          opacity={0.85 - i * 0.05}
        />
      ))}
    </svg>
  );
}

export function DawnScene({ children }: { children?: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  const motes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: (i * 37) % 100,
        top: 30 + ((i * 53) % 65),
        delay: (i % 9) * 1.6,
        dur: 16 + (i % 7) * 3,
        size: i % 5 === 0 ? 3 : 2,
      })),
    [],
  );

  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-background">
      {/* dawn gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 105%, oklch(0.30 0.035 150 / 0.85), transparent 62%), radial-gradient(70% 45% at 50% 78%, oklch(0.855 0.12 88 / 0.16), transparent 70%), linear-gradient(180deg, oklch(0.13 0.015 160) 0%, oklch(0.17 0.018 160) 60%, oklch(0.20 0.022 155) 100%)",
        }}
        aria-hidden="true"
      />

      {/* slow ambient drift of the tree layers */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
        animate={reduced ? {} : { x: [0, -14, 6, 0], y: [0, 4, -3, 0], scale: [1, 1.02, 1.01, 1] }}
        transition={{ duration: 64, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        {/* far layer */}
        <div className="flex items-end justify-between px-[4vw] opacity-25 blur-[2px]">
          {[3, 8, 2, 11, 5, 9].map((s, i) => (
            <BareTree key={i} seed={s} className="h-[26vh] w-[9vw] text-primary" />
          ))}
        </div>
        {/* near layer */}
        <div className="-mt-[9vh] flex items-end justify-between px-[1vw] opacity-55">
          {[4, 12, 7, 1, 6].map((s, i) => (
            <BareTree key={i} seed={s} className="h-[38vh] w-[13vw] text-primary/90" />
          ))}
        </div>
        {/* forest floor */}
        <div
          className="h-[14vh] w-full"
          style={{ background: "linear-gradient(180deg, transparent, oklch(0.11 0.015 160) 70%)" }}
        />
      </motion.div>

      {/* mist */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46vh]"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.72 0.03 150 / 0.10) 45%, oklch(0.72 0.03 150 / 0.06))",
        }}
        animate={reduced ? {} : { opacity: [0.55, 0.9, 0.55], x: [0, 22, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* drifting particles */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {motes.map((m, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-canopy/45"
            style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.size, height: m.size }}
            animate={reduced ? {} : { y: [0, -70, -140], opacity: [0, 0.7, 0] }}
            transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="grain-overlay -z-10" aria-hidden="true" />

      {children}
    </div>
  );
}
