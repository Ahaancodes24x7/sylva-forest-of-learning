type IconProps = { className?: string };

const base = "size-6 stroke-[1.6] fill-none stroke-current";

export function LeafIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 4C10 4 4 9 4 16c0 2.5 1.5 4 4 4 7 0 12-6 12-16Z" />
      <path d="M6.5 17.5C10 14 13.5 11 17 9" />
    </svg>
  );
}

export function RootIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v9" />
      <path d="M12 12c-1.5 2-4 2.5-5 5.5" />
      <path d="M12 12c1.5 2 4 2.5 5 5.5" />
      <path d="M12 14c0 3-.5 5-1.5 7" />
    </svg>
  );
}

export function BranchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21V6" />
      <path d="M12 12c-2.5 0-4.5-1.5-5-4 3 0 5 1.5 5 4Z" />
      <path d="M12 9c2.5-.5 4-2 4-4.5-3 .5-4 2-4 4.5Z" />
    </svg>
  );
}

export function SeedIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8c3 0 5 2.5 5 6s-2 5-5 5-5-1.5-5-5 2-6 5-6Z" />
      <path d="M12 8V4" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function TreeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21v-7" />
      <path d="M12 14c-4 0-6.5-2.5-6.5-6C5.5 4.5 8.5 3 12 3s6.5 1.5 6.5 5c0 3.5-2.5 6-6.5 6Z" />
    </svg>
  );
}

export function TrailIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 21c0-4 5-4 5-8s-4-4-4-7" />
      <path d="M17 21c0-3-3-4-3-7" />
    </svg>
  );
}

export function SettingsLeafIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
    </svg>
  );
}

export const glyphMap = {
  leaf: LeafIcon,
  root: RootIcon,
  branch: BranchIcon,
  seed: SeedIcon,
};
