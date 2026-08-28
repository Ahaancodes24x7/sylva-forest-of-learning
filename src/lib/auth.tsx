import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * SYLVA auth.
 *
 * This is a local-session implementation so the prototype is fully usable with
 * no backend. Every method below is async and returns the same shape a real
 * provider would, so swapping to Lovable Cloud (Supabase) auth is a one-step
 * change: replace the bodies of signUp / signIn / signInWithGoogle /
 * requestPasswordReset / signOut with supabase.auth.* calls and keep the rest.
 */

export type SylvaUser = {
  id: string;
  email: string;
  name: string;
  provider: "password" | "google";
  createdAt: string;
};

type AuthResult = { error: string | null };

type AuthState = {
  user: SylvaUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  setDisplayName: (name: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "sylva.session";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "We'll need an email to keep your forest.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return "That address looks incomplete.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Choose a password — anything you'll remember.";
  if (password.length < 8) return "A little longer, please — eight characters or more.";
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SylvaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SylvaUser);
    } catch {
      /* ignore malformed session */
    }
    setLoading(false);
  }, []);

  const persist = useCallback((next: SylvaUser | null) => {
    setUser(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      async signUp(email, password) {
        const err = validateEmail(email) ?? validatePassword(password);
        if (err) return { error: err };
        await wait(600);
        persist({
          id: crypto.randomUUID(),
          email: email.trim().toLowerCase(),
          name: "",
          provider: "password",
        });
        return { error: null };
      },
      async signIn(email, password) {
        const err = validateEmail(email) ?? (password ? null : "Enter your password to continue.");
        if (err) return { error: err };
        await wait(600);
        const handle = email.trim().split("@")[0] ?? "student";
        persist({
          id: crypto.randomUUID(),
          email: email.trim().toLowerCase(),
          name: handle.charAt(0).toUpperCase() + handle.slice(1),
          provider: "password",
        });
        return { error: null };
      },
      async signInWithGoogle() {
        await wait(750);
        persist({
          id: crypto.randomUUID(),
          email: "you@gmail.com",
          name: "",
          provider: "google",
        });
        return { error: null };
      },
      async requestPasswordReset(email) {
        const err = validateEmail(email);
        if (err) return { error: err };
        await wait(600);
        return { error: null };
      },
      setDisplayName(name: string) {
        if (!user) return;
        persist({ ...user, name: name.trim() });
      },
      signOut() {
        persist(null);
      },
    }),
    [user, loading, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
