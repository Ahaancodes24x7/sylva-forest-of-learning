export function SproutLoader({ label = "Growing…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6" role="status" aria-live="polite">
      <svg viewBox="0 0 40 40" className="size-10 text-moss" fill="none" aria-hidden="true">
        <path
          d="M20 36V18"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="animate-sprout"
        />
        <path
          d="M20 22c-6 0-9-3-9-8 5 0 9 3 9 8Z"
          fill="currentColor"
          opacity="0.75"
          className="animate-breathe"
        />
        <path
          d="M20 18c6-1 9-4 8-9-5 1-8 4-8 9Z"
          fill="currentColor"
          opacity="0.5"
          className="animate-breathe"
        />
      </svg>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function ShimmerBlock({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} aria-hidden="true" />;
}
