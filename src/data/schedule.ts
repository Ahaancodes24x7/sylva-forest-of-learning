import { allConcepts, courses } from "@/data/sylva";

export type BlockKind = "assignment" | "reading" | "review" | "deadline";

export type ScheduleBlock = {
  id: string;
  courseId: string;
  title: string;
  kind: BlockKind;
  /** 0 = Monday … 6 = Sunday */
  day: number;
  /** last day this can sit on; hard deadlines can't be dragged past it */
  dueDay: number;
  hardDeadline: boolean;
  /** percentage of the final grade */
  weight: number;
  estHours: number;
  /** historical actual, from calibration */
  actualHours: number | null;
  conceptId?: string;
  detail: string;
};

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const kindLabel: Record<BlockKind, string> = {
  assignment: "Assignment",
  reading: "Reading",
  review: "Review session",
  deadline: "Submission deadline",
};

const seeded: ScheduleBlock[] = [
  {
    id: "b1",
    courseId: "ochem",
    title: "Problem Set 5",
    kind: "assignment",
    day: 1,
    dueDay: 3,
    hardDeadline: false,
    weight: 8,
    estHours: 2.5,
    actualHours: 3.4,
    detail: "Six mechanism problems. You historically run ~35% over on these.",
  },
  {
    id: "b2",
    courseId: "ochem",
    title: "Problem Set 5 due",
    kind: "deadline",
    day: 3,
    dueDay: 3,
    hardDeadline: true,
    weight: 8,
    estHours: 0.25,
    actualHours: null,
    detail: "Upload to the course portal before 23:59.",
  },
  {
    id: "b3",
    courseId: "ochem",
    title: "Review — Stereochemistry",
    kind: "review",
    day: 0,
    dueDay: 6,
    hardDeadline: false,
    weight: 0,
    estHours: 0.4,
    actualHours: 0.5,
    conceptId: "stereochemistry",
    detail: "Auto-slotted: mastery is projected to fall under 40% by Thursday.",
  },
  {
    id: "b4",
    courseId: "ochem",
    title: "Midterm II",
    kind: "deadline",
    day: 4,
    dueDay: 4,
    hardDeadline: true,
    weight: 30,
    estHours: 2,
    actualHours: null,
    detail: "Covers chapters 7–11. The single heaviest item in your semester.",
  },
  {
    id: "b5",
    courseId: "cs101",
    title: "Lab 6 — Recursion",
    kind: "assignment",
    day: 1,
    dueDay: 2,
    hardDeadline: false,
    weight: 10,
    estHours: 3,
    actualHours: 4.1,
    conceptId: "recursion",
    detail: "Tree traversal exercises. Base-case errors are your recurring cost here.",
  },
  {
    id: "b6",
    courseId: "cs101",
    title: "Review — Recursion",
    kind: "review",
    day: 0,
    dueDay: 5,
    hardDeadline: false,
    weight: 0,
    estHours: 0.3,
    actualHours: 0.35,
    conceptId: "recursion",
    detail: "Short warm-up before Lab 6 — placed the day before on purpose.",
  },
  {
    id: "b7",
    courseId: "cs101",
    title: "Lab 6 due",
    kind: "deadline",
    day: 2,
    dueDay: 2,
    hardDeadline: true,
    weight: 10,
    estHours: 0.25,
    actualHours: null,
    detail: "Autograder closes at 18:00.",
  },
  {
    id: "b8",
    courseId: "cs101",
    title: "Reading — Big-O chapter",
    kind: "reading",
    day: 5,
    dueDay: 6,
    hardDeadline: false,
    weight: 0,
    estHours: 1.2,
    actualHours: 1.6,
    conceptId: "big-o",
    detail: "Pairs with next week's quiz. Chunked into two 35-minute passes.",
  },
  {
    id: "b9",
    courseId: "engcomp",
    title: "Essay 2 draft",
    kind: "assignment",
    day: 2,
    dueDay: 5,
    hardDeadline: false,
    weight: 15,
    estHours: 3.5,
    actualHours: 5.2,
    conceptId: "thesis",
    detail: "Front-loaded on purpose: you revise late, and it costs you marks.",
  },
  {
    id: "b10",
    courseId: "engcomp",
    title: "Essay 2 due",
    kind: "deadline",
    day: 5,
    dueDay: 5,
    hardDeadline: true,
    weight: 15,
    estHours: 0.25,
    actualHours: null,
    detail: "Submit with MLA works-cited page.",
  },
  {
    id: "b11",
    courseId: "engcomp",
    title: "Review — MLA Citation",
    kind: "review",
    day: 3,
    dueDay: 5,
    hardDeadline: false,
    weight: 0,
    estHours: 0.25,
    actualHours: 0.2,
    conceptId: "citations",
    detail: "Small, easily forgotten, and worth marks on Friday's essay.",
  },
  {
    id: "b12",
    courseId: "engcomp",
    title: "Reading response",
    kind: "reading",
    day: 6,
    dueDay: 6,
    hardDeadline: false,
    weight: 5,
    estHours: 1,
    actualHours: 1.1,
    detail: "One page, ungraded beyond completion.",
  },
];

/** Blocks the syllabus parse produced, plus auto-slotted spaced-repetition reviews. */
export function initialBlocks(): ScheduleBlock[] {
  const extra: ScheduleBlock[] = allConcepts
    .filter((concept) => concept.state === "mastered-decaying")
    .slice(0, 3)
    .map((concept, i) => ({
      id: `auto-${concept.id}`,
      courseId: concept.courseId,
      title: `Review — ${concept.name}`,
      kind: "review" as const,
      day: [1, 3, 5][i] ?? 4,
      dueDay: 6,
      hardDeadline: false,
      weight: 0,
      estHours: 0.3,
      actualHours: null,
      conceptId: concept.id,
      detail: `Auto-slotted into open time: last reviewed ${concept.lastReviewed}.`,
    }));
  return [...seeded, ...extra];
}

export const courseLanes = courses.map((course) => ({
  id: course.id,
  name: course.name,
  short: course.short,
}));
