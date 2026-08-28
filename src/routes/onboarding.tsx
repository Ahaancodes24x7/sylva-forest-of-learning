import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { DocumentImporter } from "@/components/sylva/DocumentImport";
import { LeafIcon, SeedIcon } from "@/components/sylva/icons";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Plant your first course — SYLVA" },
      {
        name: "description",
        content:
          "Import a syllabus and watch SYLVA read it, map its concepts, and plant them as the first grove in your forest.",
      },
      { property: "og:title", content: "Plant your first course — SYLVA" },
      { property: "og:description", content: "One document in. A living map of your semester out." },
    ],
  }),
  component: OnboardingPage,
});

type Step = "name" | "import" | "reveal";

function OnboardingPage() {
  const reduced = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addCourse, importConcepts, completeOnboarding, conceptById, toast } = useSylva();

  const [step, setStep] = useState<Step>("name");
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [planted, setPlanted] = useState<string[]>([]);
  const [docCount, setDocCount] = useState(0);

  const riskConcept = planted[0] ? conceptById(planted[0]) : undefined;

  function beginImport() {
    const name = courseName.trim();
    if (name.length < 2) {
      setError("Give the course a name — anything you'd recognise on a timetable.");
      return;
    }
    setError(null);
    setCourseId(addCourse(name));
    setStep("import");
  }

  return (
    <main className="grain min-h-dvh bg-background px-5 py-14">
      <div className="mx-auto w-full max-w-2xl">
        <p className="type-label text-moss">
          {user?.name ? `Welcome, ${user.name}.` : "Welcome."} Step {step === "name" ? 1 : step === "import" ? 2 : 3} of 3
        </p>

        <AnimatePresence mode="wait">
          {step === "name" && (
            <motion.section
              key="name"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <h1 className="type-display mt-3 text-foreground">What are we planting first?</h1>
              <p className="type-body mt-4 max-w-prose text-muted-foreground">
                Start with a single course. You can add the rest of your semester whenever you like — nothing here has to
                be finished in one sitting.
              </p>
              <label className="sr-only" htmlFor="course-name">
                Course name
              </label>
              <input
                id="course-name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && beginImport()}
                placeholder="Organic Chemistry II"
                className="focus-organic type-h3 mt-8 w-full rounded-2xl border border-border bg-card/70 px-5 py-4 text-foreground placeholder:text-muted-foreground/60"
              />
              {error && (
                <p role="alert" className="type-caption mt-3 text-terracotta">
                  {error}
                </p>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={beginImport}
                  className="focus-organic min-h-12 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-bloom hover:brightness-110"
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    completeOnboarding();
                    navigate({ to: "/forest" });
                  }}
                  className="type-caption underline-offset-4 hover:underline"
                >
                  Skip — show me the sample forest
                </button>
              </div>
            </motion.section>
          )}

          {step === "import" && (
            <motion.section
              key="import"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <h1 className="type-display mt-3 text-foreground">Give it a syllabus.</h1>
              <p className="type-body mt-4 max-w-prose text-muted-foreground">
                SYLVA reads the file here, in your browser. Nothing is uploaded. What it finds becomes the shape of your
                grove.
              </p>
              <div className="mt-8">
                <DocumentImporter
                  courseLabel={courseName}
                  onComplete={({ docs, concepts }) => {
                    if (!courseId) return;
                    const added = importConcepts(courseId, concepts.slice(0, 14));
                    setPlanted(added);
                    setDocCount(docs.length);
                    setStep("reveal");
                    toast(`${added.length} concepts planted in ${courseName}.`);
                  }}
                />
              </div>
              <button
                onClick={() => setStep("name")}
                className="type-caption mt-6 underline-offset-4 hover:underline"
              >
                Back
              </button>
            </motion.section>
          )}

          {step === "reveal" && (
            <motion.section
              key="reveal"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <h1 className="type-display mt-3 text-foreground">Your grove is in the ground.</h1>
              <p className="type-body mt-4 max-w-prose text-muted-foreground">
                {planted.length > 0
                  ? `${planted.length} concept${planted.length === 1 ? "" : "s"} from ${
                      docCount > 0 ? `${docCount} document${docCount === 1 ? "" : "s"}` : "what you typed"
                    } are now seeds in ${courseName}. They'll grow as you study them.`
                  : `${courseName} is planted and empty for now. Import documents any time from your forest.`}
              </p>

              {riskConcept && (
                <motion.div
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.2 }}
                  className="mt-8 rounded-3xl border border-canopy/40 bg-canopy/10 p-6"
                >
                  <p className="type-label text-canopy">Worth your attention first</p>
                  <h2 className="type-h2 mt-2 text-foreground">{riskConcept.name}</h2>
                  <p className="type-body mt-3 text-muted-foreground">
                    It appears earliest in the material and nothing else depends on you knowing it yet — which is exactly
                    why it's the cheapest thing to learn today.
                  </p>
                </motion.div>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <motion.button
                  whileHover={reduced ? {} : { scale: 1.03 }}
                  whileTap={reduced ? {} : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  onClick={() => {
                    completeOnboarding();
                    navigate({ to: "/forest" });
                  }}
                  className="focus-organic inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-bloom"
                >
                  <LeafIcon className="size-4" />
                  Enter your forest
                </motion.button>
                <button
                  onClick={() => setStep("name")}
                  className="type-caption inline-flex items-center gap-2 underline-offset-4 hover:underline"
                >
                  <SeedIcon className="size-4" />
                  Add another course
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
