import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const particles = Array.from({ length: 8 }, (_, i) => i);

export function LeafBurst({ active }: { active: boolean }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {particles.map((i) => {
            const drift = (i - particles.length / 2) * 16;
            return (
              <motion.span
                key={i}
                className="absolute size-2.5 rounded-tl-full rounded-br-full bg-moss"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                animate={
                  reduced
                    ? { opacity: [0, 0.8, 0] }
                    : {
                        opacity: [0, 1, 0],
                        x: drift,
                        y: -70 - i * 6,
                        scale: [0.4, 1, 0.7],
                        rotate: drift,
                      }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.06, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
