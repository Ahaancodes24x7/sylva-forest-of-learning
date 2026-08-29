// The TanStack Start Vite preset bundles the required plugins:
//   - TanStack Start, React plugin, Tailwind CSS v4, tsConfigPaths,
//     Nitro build target, path aliases, and development toolchain.
// Additional Vite configuration can be passed via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
