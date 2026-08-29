type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

export function reportRuntimeError(
  error: unknown,
  context: Record<string, unknown> = {},
  options?: ErrorOptions,
) {
  if (typeof window === "undefined") return;
  console.error("[Runtime Error]", error, { context, options });
}
