import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { LeafIcon, SettingsLeafIcon, TrailIcon, TreeIcon } from "@/components/sylva/icons";
import { MicroLessonFlow } from "@/components/sylva/MicroLessonFlow";
import { useSylva } from "@/components/sylva/SylvaProvider";

const nav = [
  { to: "/forest", label: "Forest", Icon: TreeIcon },
  { to: "/timeline", label: "Timeline", Icon: TrailIcon },
  { to: "/knowledge", label: "Knowledge", Icon: LeafIcon },
  { to: "/settings", label: "Settings", Icon: SettingsLeafIcon },
] as const;

export function AppShell({ children, bleed = false }: { children: ReactNode; bleed?: boolean }) {
  const { lessonConceptId } = useSylva();

  return (
    <div className="min-h-dvh bg-background md:pl-[84px]">
      {/* Left rail (desktop) */}
      <nav
        aria-label="Main"
        className="fixed left-0 top-0 z-40 hidden h-dvh w-[84px] flex-col items-center gap-2 border-r border-border bg-card/60 py-6 backdrop-blur-xl md:flex"
      >
        <Link to="/forest" className="mb-4 flex flex-col items-center gap-1" aria-label="SYLVA home">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <LeafIcon className="size-5" />
          </span>
          <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">SYLVA</span>
        </Link>
        {nav.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className="group flex w-full flex-col items-center gap-1 py-2 text-muted-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
          >
            <span className="grid size-11 place-items-center rounded-2xl transition-colors group-hover:bg-secondary group-data-[status=active]:bg-secondary">
              <Icon className="size-5" />
            </span>
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <Link
          to="/profile"
          aria-label="Your patterns"
          className="mt-auto flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
        >
          <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
            AL
          </span>
          <span className="text-[10px]">You</span>
        </Link>
      </nav>

      <main className={bleed ? "" : "mx-auto w-full max-w-3xl px-5 pb-32 pt-10 md:pb-16"}>{children}</main>

      {/* Bottom nav (mobile) */}
      <nav
        aria-label="Main"
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-border bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        {[...nav, { to: "/profile", label: "You", Icon: LeafIcon } as const].map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className="flex min-h-14 min-w-14 flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors data-[status=active]:text-primary"
          >
            <Icon className="size-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>

      {lessonConceptId && <MicroLessonFlow />}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="mb-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">{eyebrow}</p>
      <h1 className="mt-2 text-3xl text-foreground md:text-4xl">{title}</h1>
      {sub && <p className="mt-3 max-w-prose text-muted-foreground">{sub}</p>}
    </motion.header>
  );
}
