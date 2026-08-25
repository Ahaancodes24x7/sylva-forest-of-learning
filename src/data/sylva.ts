export type ConceptState =
  | "mastered-fresh"
  | "mastered-decaying"
  | "in-progress"
  | "not-covered"
  | "at-risk";

export type Concept = {
  id: string;
  courseId: string;
  name: string;
  state: ConceptState;
  mastery: number; // 0-1 current mastery probability
  lastReviewed: string; // human readable
  decayHalfLife: number; // days
  note: string;
  /** position within the grove, in local units */
  pos: [number, number];
};

export type Course = {
  id: string;
  name: string;
  short: string;
  color: string; // token name
  grovePosition: [number, number];
  concepts: Concept[];
};

export type SemesterWeek = {
  week: number;
  label: string;
  load: number; // 0-100
  collision: boolean;
  items: { course: string; title: string; weight: number }[];
  plan: string;
};

const c = (
  courseId: string,
  id: string,
  name: string,
  state: ConceptState,
  mastery: number,
  lastReviewed: string,
  decayHalfLife: number,
  note: string,
  pos: [number, number],
): Concept => ({ id, courseId, name, state, mastery, lastReviewed, decayHalfLife, note, pos });

export const courses: Course[] = [
  {
    id: "ochem",
    name: "Organic Chemistry II",
    short: "O-Chem",
    color: "primary",
    grovePosition: [-7.5, -1],
    concepts: [
      c("ochem", "stereochemistry", "Stereochemistry", "at-risk", 0.41, "9 days ago", 6,
        "Deadline density around week 6 plus a historically steep difficulty curve.", [0, 0]),
      c("ochem", "chirality", "Chirality & R/S", "in-progress", 0.55, "2 days ago", 9,
        "You've seen the definition; you haven't applied it under time pressure yet.", [2.1, 0.9]),
      c("ochem", "sn1-sn2", "SN1 vs SN2", "mastered-decaying", 0.62, "16 days ago", 11,
        "Strong two weeks ago — the mechanism details are starting to blur.", [-2.2, 1.1]),
      c("ochem", "resonance", "Resonance", "mastered-fresh", 0.91, "yesterday", 21,
        "Solid and recent. No action needed.", [1.4, -1.8]),
      c("ochem", "acidity", "Acidity & pKa", "mastered-fresh", 0.86, "3 days ago", 18,
        "Holding well across recent checks.", [-1.6, -1.9]),
      c("ochem", "nmr", "NMR Interpretation", "not-covered", 0.05, "not started", 5,
        "Scheduled for week 9. A seed, waiting.", [3.4, -0.7]),
      c("ochem", "carbonyl", "Carbonyl Additions", "not-covered", 0.02, "not started", 5,
        "Scheduled for week 11.", [-3.6, -0.4]),
      c("ochem", "aromaticity", "Aromaticity", "mastered-decaying", 0.58, "13 days ago", 12,
        "Fading slowly — a short refresh will restore it.", [0.4, 2.3]),
    ],
  },
  {
    id: "cs101",
    name: "Intro to Computer Science",
    short: "Intro CS",
    color: "moss",
    grovePosition: [0.5, 1.5],
    concepts: [
      c("cs101", "recursion", "Recursion", "at-risk", 0.38, "11 days ago", 7,
        "Two assessments land in the same week and your base-case errors repeat.", [0, 0]),
      c("cs101", "big-o", "Big-O Analysis", "in-progress", 0.49, "4 days ago", 8,
        "Growing steadily. Two more passes should stabilise it.", [2.2, 1]),
      c("cs101", "arrays", "Arrays & Lists", "mastered-fresh", 0.94, "yesterday", 26,
        "Deeply held. Fresh canopy.", [-2, 1.3]),
      c("cs101", "loops", "Loops & Iteration", "mastered-fresh", 0.9, "2 days ago", 24,
        "Consistently accurate.", [1.6, -1.7]),
      c("cs101", "hash-maps", "Hash Maps", "mastered-decaying", 0.6, "15 days ago", 10,
        "Collision handling is the part slipping.", [-1.8, -1.6]),
      c("cs101", "sorting", "Sorting Algorithms", "in-progress", 0.44, "5 days ago", 9,
        "Merge sort is landing; quicksort partitioning is not.", [3.2, -0.5]),
      c("cs101", "trees", "Trees & Traversal", "not-covered", 0.03, "not started", 6,
        "Scheduled for week 10.", [-3.3, 0.2]),
    ],
  },
  {
    id: "engcomp",
    name: "English Composition",
    short: "Composition",
    color: "canopy",
    grovePosition: [7.5, -1.5],
    concepts: [
      c("engcomp", "thesis", "Thesis Construction", "mastered-fresh", 0.88, "3 days ago", 22,
        "Your strongest area in this course.", [0, 0]),
      c("engcomp", "evidence", "Integrating Evidence", "in-progress", 0.52, "6 days ago", 10,
        "Quotes land; the analysis after them is thin.", [2.1, 0.8]),
      c("engcomp", "rhetoric", "Rhetorical Analysis", "mastered-decaying", 0.57, "18 days ago", 12,
        "Untouched since the first essay.", [-2.1, 1]),
      c("engcomp", "citations", "MLA Citation", "at-risk", 0.36, "12 days ago", 8,
        "It's small, easily forgotten, and worth marks on the week 8 essay.", [1.5, -1.7]),
      c("engcomp", "revision", "Revision Strategy", "in-progress", 0.47, "5 days ago", 9,
        "You revise late; the plan now front-loads it.", [-1.7, -1.6]),
      c("engcomp", "counterargument", "Counterargument", "not-covered", 0.04, "not started", 6,
        "Scheduled for week 9.", [3.2, -0.4]),
    ],
  },
];

export const allConcepts = courses.flatMap((course) => course.concepts);

export const conceptById = (id: string) => allConcepts.find((concept) => concept.id === id);

export const courseById = (id: string) => courses.find((course) => course.id === id);

export const semester: SemesterWeek[] = [
  { week: 1, label: "Sep 1", load: 18, collision: false, items: [{ course: "O-Chem", title: "Syllabus quiz", weight: 5 }], plan: "Light week — used for baseline calibration." },
  { week: 2, label: "Sep 8", load: 26, collision: false, items: [{ course: "Intro CS", title: "Lab 1", weight: 10 }], plan: "Introduced loops with short 12-minute blocks." },
  { week: 3, label: "Sep 15", load: 34, collision: false, items: [{ course: "Composition", title: "Reading response", weight: 8 }, { course: "O-Chem", title: "Problem set 2", weight: 12 }], plan: "Paired reading with recall prompts." },
  { week: 4, label: "Sep 22", load: 42, collision: false, items: [{ course: "Intro CS", title: "Lab 2", weight: 10 }, { course: "O-Chem", title: "Problem set 3", weight: 12 }], plan: "Started spreading Week 6 prep 18 days early." },
  { week: 5, label: "Sep 29", load: 55, collision: false, items: [{ course: "Composition", title: "Essay 1 draft", weight: 15 }, { course: "Intro CS", title: "Quiz 1", weight: 10 }], plan: "Revision moved forward by three days." },
  { week: 6, label: "Oct 6", load: 88, collision: true, items: [{ course: "O-Chem", title: "Midterm I", weight: 25 }, { course: "Intro CS", title: "Project checkpoint", weight: 15 }, { course: "Composition", title: "Essay 1 final", weight: 15 }], plan: "Thicket. Stereochemistry primers began in week 4; essay revision closed before Monday." },
  { week: 7, label: "Oct 13", load: 30, collision: false, items: [{ course: "Intro CS", title: "Lab 3", weight: 10 }], plan: "Clearing — scheduled recovery and light review only." },
  { week: 8, label: "Oct 20", load: 61, collision: false, items: [{ course: "Composition", title: "Essay 2", weight: 18 }, { course: "O-Chem", title: "Problem set 5", weight: 12 }], plan: "MLA refresh inserted two days before submission." },
  { week: 9, label: "Oct 27", load: 47, collision: false, items: [{ course: "O-Chem", title: "NMR lab", weight: 12 }, { course: "Composition", title: "Peer review", weight: 6 }], plan: "New concepts introduced in a low-load week on purpose." },
  { week: 10, label: "Nov 3", load: 68, collision: false, items: [{ course: "Intro CS", title: "Trees assignment", weight: 15 }, { course: "O-Chem", title: "Quiz 3", weight: 10 }], plan: "Recursion primer scheduled before the trees assignment." },
  { week: 11, label: "Nov 10", load: 92, collision: true, items: [{ course: "Intro CS", title: "Final project", weight: 25 }, { course: "O-Chem", title: "Midterm II", weight: 25 }, { course: "Composition", title: "Research proposal", weight: 12 }], plan: "Thicket. Started spreading Week 11 prep 18 days early." },
  { week: 12, label: "Nov 17", load: 39, collision: false, items: [{ course: "Composition", title: "Annotated bibliography", weight: 10 }], plan: "Clearing after the densest week." },
  { week: 13, label: "Nov 24", load: 58, collision: false, items: [{ course: "O-Chem", title: "Problem set 8", weight: 12 }, { course: "Intro CS", title: "Quiz 4", weight: 10 }], plan: "Spaced review of everything flagged as fading." },
  { week: 14, label: "Dec 1", load: 85, collision: true, items: [{ course: "O-Chem", title: "Final exam", weight: 35 }, { course: "Intro CS", title: "Final exam", weight: 30 }, { course: "Composition", title: "Final portfolio", weight: 30 }], plan: "Thicket. Review load distributed backwards from week 10." },
];

/** Decay curve: mastery probability over the next 30 days, with review bump. */
export function decaySeries(concept: Concept) {
  const points: { day: number; mastery: number; withReview: number }[] = [];
  for (let day = 0; day <= 30; day += 2) {
    const natural = concept.mastery * Math.pow(0.5, day / concept.decayHalfLife);
    const reviewed = Math.min(
      0.98,
      (day < 4 ? concept.mastery + (0.95 - concept.mastery) * (day / 4) : 0.95) *
        Math.pow(0.5, Math.max(0, day - 4) / (concept.decayHalfLife * 2.6)),
    );
    points.push({
      day,
      mastery: Math.round(natural * 100),
      withReview: Math.round(reviewed * 100),
    });
  }
  return points;
}

export type LessonScreen = {
  kind: "idea";
  title: string;
  body: string;
  glyph: "leaf" | "root" | "branch" | "seed";
};

export type LessonCheck = {
  kind: "check";
  question: string;
  options: { id: string; label: string }[];
  correct: string;
  because: string;
};

export type MicroLesson = {
  conceptId: string;
  title: string;
  minutes: number;
  screens: (LessonScreen | LessonCheck)[];
};

export const microLessons: Record<string, MicroLesson> = {
  stereochemistry: {
    conceptId: "stereochemistry",
    title: "Chirality, in four minutes",
    minutes: 4,
    screens: [
      {
        kind: "idea",
        glyph: "leaf",
        title: "A chiral molecule cannot be laid over its own mirror image.",
        body: "Your two hands are the same object, mirrored — and they never stack. That is the whole idea.",
      },
      {
        kind: "idea",
        glyph: "branch",
        title: "One carbon with four different groups makes a chiral centre.",
        body: "Four different neighbours, no plane of symmetry. Find that carbon and you have found the centre.",
      },
      {
        kind: "idea",
        glyph: "root",
        title: "R or S is just a ranking, then a direction.",
        body: "Rank the four groups by atomic number, point the lowest away, and read the remaining three: clockwise is R, counter-clockwise is S.",
      },
      {
        kind: "check",
        question: "Which carbon is a chiral centre?",
        options: [
          { id: "a", label: "A carbon bonded to two identical methyl groups" },
          { id: "b", label: "A carbon bonded to four different groups" },
          { id: "c", label: "Any carbon in a ring" },
          { id: "d", label: "A carbon in a double bond" },
        ],
        correct: "b",
        because: "Four different groups means no mirror-plane — that is exactly what makes the centre chiral.",
      },
    ],
  },
  recursion: {
    conceptId: "recursion",
    title: "Recursion, in three minutes",
    minutes: 3,
    screens: [
      {
        kind: "idea",
        glyph: "seed",
        title: "A recursive function solves a smaller version of itself.",
        body: "Not a loop that repeats — a problem that shrinks, one call at a time.",
      },
      {
        kind: "idea",
        glyph: "root",
        title: "The base case is where the shrinking stops.",
        body: "Write it first. Every recursion bug you have had so far started as a missing base case.",
      },
      {
        kind: "idea",
        glyph: "branch",
        title: "Trust the smaller call.",
        body: "Assume the recursive call already works, then only handle the single step in front of you.",
      },
      {
        kind: "check",
        question: "What happens without a base case?",
        options: [
          { id: "a", label: "The function returns null" },
          { id: "b", label: "It runs forever until the call stack overflows" },
          { id: "c", label: "It becomes an iterative loop" },
          { id: "d", label: "It runs exactly once" },
        ],
        correct: "b",
        because: "Nothing stops the shrinking, so calls stack until the stack runs out of room.",
      },
    ],
  },
};

export const todaySummary = {
  reviewReady: 3,
  nextDeadline: "1 assignment due in 2 days",
  reviewConceptIds: ["stereochemistry", "recursion", "citations"],
};

export const reEntry = {
  assignment: "O-Chem Problem Set 5",
  wasOn: "paragraph 2, defining chirality",
  nextStep: "apply it to the synthesis problem",
  awayFor: "3 days",
};

export const stateMeta: Record<
  ConceptState,
  { label: string; description: string; dot: string }
> = {
  "mastered-fresh": { label: "Fresh", description: "Held and recent", dot: "bg-primary" },
  "mastered-decaying": { label: "Fading", description: "Known, but slipping", dot: "bg-moss/60" },
  "in-progress": { label: "Growing", description: "Actively forming", dot: "bg-moss" },
  "not-covered": { label: "Dormant", description: "Not yet covered", dot: "bg-muted-foreground/40" },
  "at-risk": { label: "Needs attention", description: "Worth time this week", dot: "bg-canopy" },
};
