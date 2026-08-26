import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { DawnScene } from "@/components/landing/DawnScene";
import { LeafIcon } from "@/components/sylva/icons";
import { useAuth, validateEmail, validatePassword } from "@/lib/auth";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => {
    const mode = search["mode"];
    return { mode: mode === "signup" || mode === "forgot" ? mode : "signin" };
  },
  head: () => ({
    meta: [
      { title: "Sign in — SYLVA" },
      {
        name: "description",
        content: "Sign in or start a SYLVA forest with email or Google. One course is free.",
      },
      { property: "og:title", content: "Sign in — SYLVA" },
      { property: "og:description", content: "Step into the light of your own forest." },
    ],
  }),
  component: AuthPage,
});

const copy: Record<Mode, { title: string; sub: string; cta: string }> = {
  signin: { title: "welcome back.", sub: "Your forest kept growing without you.", cta: "Sign in" },
  signup: { title: "plant your first forest.", sub: "One course, free. No card.", cta: "Create account" },
  forgot: { title: "we'll send a way back in.", sub: "Enter the address you signed up with.", cta: "Send reset link" },
};

function AuthPage() {
  const reduced = useReducedMotion() ?? false;
  const navigate = useNavigate();
  const { mode: initialMode } = Route.useSearch();
  const { user, signIn, signUp, signInWithGoogle, requestPasswordReset, setDisplayName } = useAuth();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [askName, setAskName] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => setMode(initialMode), [initialMode]);

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = mode !== "forgot" && touched.password ? validatePassword(password) : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError(null);
    setNotice(null);
    setBusy(true);

    if (mode === "forgot") {
      const { error } = await requestPasswordReset(email);
      setBusy(false);
      if (error) return setFormError(error);
      return setNotice("If that address has a forest, a reset link is on its way.");
    }

    const { error } = mode === "signup" ? await signUp(email, password) : await signIn(email, password);
    setBusy(false);
    if (error) return setFormError(error);
    if (mode === "signup") setAskName(true);
    else navigate({ to: "/forest" });
  }

  async function google() {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
    setAskName(true);
  }

  return (
    <div className="dark">
      <DawnScene>
        {/* dim & blur the atmosphere rather than replacing it */}
        <div className="absolute inset-0 backdrop-blur-[3px]" style={{ background: "oklch(0.12 0.015 160 / 0.55)" }} aria-hidden="true" />

        <div className="relative flex min-h-dvh items-center justify-center px-6 py-20">
          <div className="w-full max-w-sm">
            <Link to="/" className="focus-organic mb-12 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground">
              <LeafIcon className="size-4" />
              <span className="type-label">sylva</span>
            </Link>

            <AnimatePresence mode="wait">
              {askName ? (
                <motion.div
                  key="name"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 16 }}
                >
                  <h1 className="font-serif text-3xl lowercase text-foreground">what should we call you?</h1>
                  <p className="type-caption mt-3">That's the only question. Your syllabus does the rest.</p>
                  <form
                    className="mt-8"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setDisplayName(name || (user?.email.split("@")[0] ?? "Student"));
                      navigate({ to: "/onboarding" });
                    }}
                  >
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex"
                      className="focus-organic w-full rounded-2xl border border-border bg-background/50 px-4 py-3.5 text-foreground"
                    />
                    <button
                      type="submit"
                      className="focus-organic mt-5 min-h-12 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:brightness-110"
                    >
                      Continue
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 16 }}
                >
                  <h1 className="font-serif text-3xl lowercase leading-tight text-foreground">{copy[mode].title}</h1>
                  <p className="type-caption mt-3">{copy[mode].sub}</p>

                  <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      error={emailError}
                      autoComplete="email"
                    />
                    {mode !== "forgot" && (
                      <Field
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        error={passwordError}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                    )}

                    {formError && (
                      <p role="alert" className="type-caption rounded-2xl bg-terracotta/15 px-4 py-3 text-terracotta">
                        {formError}
                      </p>
                    )}
                    {notice && (
                      <p role="status" className="type-caption rounded-2xl bg-canopy/15 px-4 py-3 text-canopy">
                        {notice}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="focus-organic min-h-12 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60"
                    >
                      {busy ? "One moment…" : copy[mode].cta}
                    </button>
                  </form>

                  {mode !== "forgot" && (
                    <>
                      <div className="my-7 flex items-center gap-4">
                        <span className="h-px flex-1 bg-border" />
                        <span className="type-caption">or</span>
                        <span className="h-px flex-1 bg-border" />
                      </div>
                      <button
                        onClick={() => void google()}
                        disabled={busy}
                        className="focus-organic min-h-12 w-full rounded-full border border-border text-sm text-foreground hover:border-moss hover:bg-secondary/30"
                      >
                        Continue with Google
                      </button>
                    </>
                  )}

                  <div className="type-caption mt-8 space-y-2 text-center">
                    {mode === "signin" && (
                      <>
                        <p>
                          <button onClick={() => setMode("forgot")} className="underline-offset-4 hover:underline">
                            Forgot your password?
                          </button>
                        </p>
                        <p>
                          New here?{" "}
                          <button onClick={() => setMode("signup")} className="underline-offset-4 hover:underline">
                            Start a forest
                          </button>
                        </p>
                      </>
                    )}
                    {mode === "signup" && (
                      <p>
                        Already growing one?{" "}
                        <button onClick={() => setMode("signin")} className="underline-offset-4 hover:underline">
                          Sign in
                        </button>
                      </p>
                    )}
                    {mode === "forgot" && (
                      <p>
                        <button onClick={() => setMode("signin")} className="underline-offset-4 hover:underline">
                          Back to sign in
                        </button>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DawnScene>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error: string | null;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`focus-organic mt-2 w-full rounded-2xl border bg-background/50 px-4 py-3.5 text-foreground ${
          error ? "border-canopy/60" : "border-border hover:border-moss/50"
        }`}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="type-caption mt-2 text-canopy"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
