import { lazy, Suspense, useEffect, useState } from "react";

import { SproutLoader } from "@/components/sylva/SproutLoader";

const ForestScene = lazy(() => import("./ForestScene"));

type Props = {
  activeCourseId: string | "all";
  selectedConceptId: string | null;
  onSelectConcept: (id: string) => void;
  isDark: boolean;
  reducedMotion: boolean;
  sproutedConceptIds: string[];
};

/** Client-only wrapper: three.js must never be imported during SSR. */
export function ForestCanvas(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid h-full w-full place-items-center">
        <SproutLoader label="Growing your forest…" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="grid h-full w-full place-items-center">
          <SproutLoader label="Growing your forest…" />
        </div>
      }
    >
      <ForestScene {...props} />
    </Suspense>
  );
}
