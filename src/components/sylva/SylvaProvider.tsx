import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Adaptations = {
  chunkLongTasks: boolean;
  warmStarts: boolean;
  reEntryCards: boolean;
  spacedReview: boolean;
};

type SylvaState = {
  onboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  sprouted: string[];
  sprout: (conceptId: string) => void;
  lessonConceptId: string | null;
  openLesson: (conceptId: string, opts?: { warmStart?: boolean }) => void;
  closeLesson: () => void;
  warmStart: boolean;
  adaptations: Adaptations;
  toggleAdaptation: (key: keyof Adaptations) => void;
  isMobile: boolean;
  isDark: boolean;
};

const SylvaContext = createContext<SylvaState | null>(null);

export function SylvaProvider({ children }: { children: ReactNode }) {
  const [onboarded, setOnboarded] = useState(false);
  const [sprouted, setSprouted] = useState<string[]>([]);
  const [lessonConceptId, setLessonConceptId] = useState<string | null>(null);
  const [warmStart, setWarmStart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [adaptations, setAdaptations] = useState<Adaptations>({
    chunkLongTasks: true,
    warmStarts: true,
    reEntryCards: true,
    spacedReview: true,
  });

  useEffect(() => {
    setOnboarded(window.localStorage.getItem("sylva.onboarded") === "1");

    const mqMobile = window.matchMedia("(max-width: 899px)");
    const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
    const syncMobile = () => setIsMobile(mqMobile.matches);
    const syncDark = () => {
      setIsDark(mqDark.matches);
      document.documentElement.classList.toggle("dark", mqDark.matches);
    };
    syncMobile();
    syncDark();
    mqMobile.addEventListener("change", syncMobile);
    mqDark.addEventListener("change", syncDark);
    return () => {
      mqMobile.removeEventListener("change", syncMobile);
      mqDark.removeEventListener("change", syncDark);
    };
  }, []);

  const completeOnboarding = useCallback(() => {
    window.localStorage.setItem("sylva.onboarded", "1");
    setOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    window.localStorage.removeItem("sylva.onboarded");
    setOnboarded(false);
  }, []);

  const value = useMemo<SylvaState>(
    () => ({
      onboarded,
      completeOnboarding,
      resetOnboarding,
      sprouted,
      sprout: (conceptId: string) =>
        setSprouted((prev) => (prev.includes(conceptId) ? prev : [...prev, conceptId])),
      lessonConceptId,
      openLesson: (conceptId, opts) => {
        setWarmStart(Boolean(opts?.warmStart));
        setLessonConceptId(conceptId);
      },
      closeLesson: () => setLessonConceptId(null),
      warmStart,
      adaptations,
      toggleAdaptation: (key) => setAdaptations((prev) => ({ ...prev, [key]: !prev[key] })),
      isMobile,
      isDark,
    }),
    [onboarded, completeOnboarding, resetOnboarding, sprouted, lessonConceptId, warmStart, adaptations, isMobile, isDark],
  );

  return <SylvaContext.Provider value={value}>{children}</SylvaContext.Provider>;
}

export function useSylva() {
  const ctx = useContext(SylvaContext);
  if (!ctx) throw new Error("useSylva must be used inside SylvaProvider");
  return ctx;
}
