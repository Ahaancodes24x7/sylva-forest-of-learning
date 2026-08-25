import { useReducedMotion } from "framer-motion";

export const spring = { type: "spring" as const, stiffness: 120, damping: 14 };
export const softSpring = { type: "spring" as const, stiffness: 90, damping: 18 };

export function useSylvaMotion() {
  const reduced = useReducedMotion() ?? false;

  const rise = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.22 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: spring,
      };

  const reveal = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.25 } }
    : {
        initial: { opacity: 0, scale: 0.94, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { ...spring, stiffness: 110 },
      };

  const press = reduced ? {} : { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, transition: spring };

  return { reduced, rise, reveal, press, spring, softSpring };
}

export function useIsMobile(breakpoint = 900) {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
}
