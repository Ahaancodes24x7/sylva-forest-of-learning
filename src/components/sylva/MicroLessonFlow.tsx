import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { glyphMap, LeafIcon } from "@/components/sylva/icons";
import { LeafBurst } from "@/components/sylva/LeafBurst";
import { useSylva } from "@/components/sylva/SylvaProvider";
import { conceptById, microLessons, type LessonCheck, type LessonScreen } from "@/data/sylva";

export function MicroLessonFlow() {
  const { lessonConceptId, closeLesson, sprout, warmStart, adaptations } = useSylva();
  const reduced = useReducedMotion() ?? false;
  const concept = lessonConceptId ? conceptById(lessonConceptId) : undefined;
  const lesson = lessonConceptId ? microLessons[lessonConceptId] : undefined;

  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [burst, setBurst] = useState(false);
  const [primed, setPrimed] = useState(!warmStart || !adaptations.warmStarts);

  if (!concept || !lesson) return null;

  const screens = lesson.screens;
  const current = screens[Math.min(step, screens.length - 1)]!;
  const done = step >= screens.length;
  const progress = Math.min(1, step / screens.length);

  const finish = () => {
    sprout(concept.id);
    closeLesson();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-label={`Micro-lesson: ${lesson.title}`}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <LeafIcon className="size-4 text-moss" />
          {concept.name}
        </span>
        <button
          onClick={closeLesson}
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6">
        <LeafBurst active={burst} />
        <AnimatePresence mode="wait">
          {!primed ? (
            <WarmStart
              key="warm"
              minutes={lesson.minutes}
              conceptName={concept.name}
              onStart={() => setPrimed(true)}
              onSkip={closeLesson}
            />
          ) : done ? (
            <motion.div
              key="done"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 14 }}
              className="max-w-xl text-center"
            >
              <h2 className="text-3xl text-foreground md:text-4xl">A leaf just grew.</h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                {concept.name} is refreshed in your forest. SYLVA will bring it back in about{" "}
                {concept.decayHalfLife} days — sooner if it starts to fade.
              </p>
              <motion.button
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                onClick={finish}
                className="mt-8 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft"
              >
                Back to the forest
              </motion.button>
            </motion.div>
          ) : current.kind === "idea" ? (
            <IdeaScreen key={step} screen={current} onNext={() => setStep(step + 1)} />
          ) : (
            <CheckScreen
              key={step}
              check={current as LessonCheck}
              choice={choice}
              onChoose={(id) => {
                setChoice(id);
                if (id === (current as LessonCheck).correct) {
                  setBurst(true);
                  window.setTimeout(() => setBurst(false), 1600);
                }
              }}
              onNext={() => setStep(step + 1)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* vine progress */}
      <div className="px-6 pb-8 pt-4">
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-moss"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(6, progress * 100)}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
          <motion.span
            className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-tl-full rounded-br-full bg-primary"
            initial={{ left: 0 }}
            animate={{ left: `calc(${Math.max(6, progress * 100)}% - 7px)` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {Math.min(step + 1, screens.length)} of {screens.length} · {lesson.minutes} min
        </p>
      </div>
    </motion.div>
  );
}

function WarmStart({
  minutes,
  conceptName,
  onStart,
  onSkip,
}: {
  minutes: number;
  conceptName: string;
  onStart: () => void;
  onSkip: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="max-w-xl text-center"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">Warm start</p>
      <h2 className="mt-3 text-3xl text-foreground md:text-4xl">
        Before you start, a {minutes}-minute primer on {conceptName}.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        It's the concept most likely to slow you down on this assignment. Entirely optional.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <motion.button
          whileHover={reduced ? {} : { scale: 1.03 }}
          whileTap={reduced ? {} : { scale: 0.97 }}
          onClick={onStart}
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft"
        >
          Take the primer
        </motion.button>
        <button
          onClick={onSkip}
          className="rounded-full px-5 py-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Skip, go straight to the work
        </button>
      </div>
    </motion.div>
  );
}

function IdeaScreen({ screen, onNext }: { screen: LessonScreen; onNext: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const Glyph = glyphMap[screen.glyph];
  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="max-w-2xl text-center"
    >
      <motion.span
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.08 }}
        className="mx-auto grid size-16 place-items-center rounded-3xl bg-secondary text-secondary-foreground"
      >
        <Glyph className="size-8" />
      </motion.span>
      <h2 className="mt-8 text-3xl leading-snug text-foreground md:text-[2.6rem]">{screen.title}</h2>
      <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{screen.body}</p>
      <motion.button
        whileHover={reduced ? {} : { scale: 1.03 }}
        whileTap={reduced ? {} : { scale: 0.97 }}
        onClick={onNext}
        className="mt-10 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-soft"
      >
        Got it
      </motion.button>
    </motion.div>
  );
}

function CheckScreen({
  check,
  choice,
  onChoose,
  onNext,
}: {
  check: LessonCheck;
  choice: string | null;
  onChoose: (id: string) => void;
  onNext: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const correct = choice === check.correct;

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="w-full max-w-2xl"
    >
      <h2 className="text-center text-2xl text-foreground md:text-3xl">{check.question}</h2>
      <div className="mt-8 grid gap-3">
        {check.options.map((option) => {
          const chosen = choice === option.id;
          const isRight = option.id === check.correct;
          const showState = choice !== null && (chosen || isRight);
          return (
            <motion.button
              key={option.id}
              onClick={() => choice === null && onChoose(option.id)}
              whileHover={reduced || choice ? {} : { scale: 1.02 }}
              whileTap={reduced || choice ? {} : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              aria-pressed={chosen}
              className={`min-h-14 rounded-2xl border bg-card px-5 py-4 text-left text-base transition-colors ${
                showState && isRight
                  ? "border-moss bg-secondary text-secondary-foreground"
                  : showState && chosen
                    ? "border-canopy"
                    : "border-border hover:border-moss/60"
              }`}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {choice && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="mt-6 rounded-2xl bg-muted p-4"
          >
            <p className="flex items-start gap-2 text-sm text-foreground">
              <LeafIcon className="mt-0.5 size-4 shrink-0 text-moss" />
              <span>
                {correct ? "That's it. " : "Not quite — here's the shape of it. "}
                {check.because}
              </span>
            </p>
            <motion.button
              whileHover={reduced ? {} : { scale: 1.03 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              onClick={onNext}
              className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Finish
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
