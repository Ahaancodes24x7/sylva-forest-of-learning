import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { initialBlocks, type ScheduleBlock } from "@/data/schedule";
import {
  accentOptions,
  createCourse,
  makeConcepts,
  seedCourses,
  type Concept,
  type StoredCourse,
} from "@/data/sylva";

type Adaptations = {
  chunkLongTasks: boolean;
  warmStarts: boolean;
  reEntryCards: boolean;
  spacedReview: boolean;
};

export type Toast = { id: string; message: string; tone: "growth" | "gentle" };

type SylvaState = {
  /** false until localStorage has been read — routes wait on this */
  hydrated: boolean;

  onboarded: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  /** live course registry (archived ones filtered out) */
  courses: StoredCourse[];
  allCourses: StoredCourse[];
  courseById: (id: string) => StoredCourse | undefined;
  conceptById: (id: string) => Concept | undefined;
  addCourse: (name: string, accent?: string) => string;
  renameCourse: (id: string, name: string) => void;
  archiveCourse: (id: string) => void;
  restoreCourse: (id: string) => void;
  importConcepts: (courseId: string, names: string[]) => string[];

  blocks: ScheduleBlock[];
  moveBlock: (id: string, day: number) => boolean;

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

  importVersion: number;
  noteImport: () => void;

  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;
  dismissToast: (id: string) => void;

  resetDemoData: () => void;
};

const SylvaContext = createContext<SylvaState | null>(null);

const STORAGE_KEY = "sylva.state.v1";

type Persisted = {
  onboarded: boolean;
  courses: StoredCourse[];
  blocks: ScheduleBlock[];
  sprouted: string[];
  adaptations: Adaptations;
};

const defaultAdaptations: Adaptations = {
  chunkLongTasks: true,
  warmStarts: true,
  reEntryCards: true,
  spacedReview: true,
};

export function SylvaProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [courses, setCourses] = useState<StoredCourse[]>(seedCourses);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(() => initialBlocks());
  const [sprouted, setSprouted] = useState<string[]>([]);
  const [lessonConceptId, setLessonConceptId] = useState<string | null>(null);
  const [warmStart, setWarmStart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [importVersion, setImportVersion] = useState(0);
  const [adaptations, setAdaptations] = useState<Adaptations>(defaultAdaptations);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<number[]>([]);

  /* ---------------- hydrate ---------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        if (Array.isArray(parsed.courses)) setCourses(parsed.courses);
        if (Array.isArray(parsed.blocks)) setBlocks(parsed.blocks);
        if (Array.isArray(parsed.sprouted)) setSprouted(parsed.sprouted);
        if (parsed.adaptations) setAdaptations({ ...defaultAdaptations, ...parsed.adaptations });
        setOnboarded(Boolean(parsed.onboarded));
      }
    } catch {
      /* corrupted state — fall back to seeds */
    }
    setHydrated(true);

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
      timers.current.forEach(window.clearTimeout);
    };
  }, []);

  /* ---------------- persist ---------------- */
  useEffect(() => {
    if (!hydrated) return;
    const payload: Persisted = { onboarded, courses, blocks, sprouted, adaptations };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* quota — the demo still works in memory */
    }
  }, [hydrated, onboarded, courses, blocks, sprouted, adaptations]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "growth") => {
    const id = `t-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    timers.current.push(
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200),
    );
  }, []);

  const completeOnboarding = useCallback(() => setOnboarded(true), []);
  const resetOnboarding = useCallback(() => setOnboarded(false), []);

  const value = useMemo<SylvaState>(() => {
    const active = courses.filter((course) => !course.archived);
    const findCourse = (id: string) => courses.find((course) => course.id === id);
    const findConcept = (id: string) =>
      courses.flatMap((course) => course.concepts).find((concept) => concept.id === id);

    return {
      hydrated,
      onboarded,
      completeOnboarding,
      resetOnboarding,

      courses: active,
      allCourses: courses,
      courseById: findCourse,
      conceptById: findConcept,

      addCourse: (name, accent) => {
        const chosen = accent ?? accentOptions[courses.length % accentOptions.length]!.value;
        const course = createCourse(name, chosen, courses.length);
        setCourses((prev) => [...prev, course]);
        return course.id;
      },
      renameCourse: (id, name) =>
        setCourses((prev) =>
          prev.map((course) =>
            course.id === id
              ? { ...course, name, short: name.length > 12 ? `${name.slice(0, 11)}…` : name }
              : course,
          ),
        ),
      archiveCourse: (id) =>
        setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, archived: true } : course))),
      restoreCourse: (id) =>
        setCourses((prev) => prev.map((course) => (course.id === id ? { ...course, archived: false } : course))),

      importConcepts: (courseId, names) => {
        const course = findCourse(courseId);
        if (!course) return [];
        const existing = new Set(course.concepts.map((concept) => concept.id));
        const fresh = makeConcepts(courseId, names, course.concepts.length).filter(
          (concept) => !existing.has(concept.id),
        );
        if (fresh.length === 0) return [];
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, concepts: [...c.concepts, ...fresh] } : c)),
        );
        setImportVersion((v) => v + 1);
        return fresh.map((concept) => concept.id);
      },

      blocks,
      moveBlock: (id, day) => {
        const block = blocks.find((b) => b.id === id);
        if (!block) return false;
        if (block.hardDeadline && day !== block.dueDay) return false;
        if (day > block.dueDay) return false;
        setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, day } : b)));
        return true;
      },

      sprouted,
      sprout: (conceptId) =>
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

      importVersion,
      noteImport: () => setImportVersion((v) => v + 1),

      toasts,
      toast,
      dismissToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),

      resetDemoData: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setCourses([]);
        setBlocks([]);
        setSprouted([]);
        setAdaptations(defaultAdaptations);
        setOnboarded(false);
        setImportVersion((v) => v + 1);
      },
    };
  }, [
    hydrated,
    onboarded,
    completeOnboarding,
    resetOnboarding,
    courses,
    blocks,
    sprouted,
    lessonConceptId,
    warmStart,
    adaptations,
    isMobile,
    isDark,
    importVersion,
    toasts,
    toast,
  ]);

  return <SylvaContext.Provider value={value}>{children}</SylvaContext.Provider>;
}

export function useSylva() {
  const ctx = useContext(SylvaContext);
  if (!ctx) throw new Error("useSylva must be used inside SylvaProvider");
  return ctx;
}
