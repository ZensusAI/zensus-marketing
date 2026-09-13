import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    {
      enforce: "pre" as const,
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm],
      }),
    },
    react(),
    {
      name: "stamp-site-modified",
      // Replace the SoftwareApplication dateModified placeholder in index.html
      // with the build date, so the freshness signal reflects the latest deploy
      // instead of a hardcoded value that silently goes stale. Runs at build
      // and in the dev server.
      transformIndexHtml(html: string) {
        return html.replace(
          "__SITE_MODIFIED__",
          new Date().toISOString().slice(0, 10),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // posthog-js is only ever dynamically imported (analytics loads at
        // runtime in lib/analytics/events.ts). Pin it to its own named chunk so
        // it is a clean, lazy, on-demand bundle instead of being folded into an
        // unrelated route chunk (rollup otherwise merged posthog into /privacy).
        //
        // Be sparing about adding entries here. Forcing a CommonJS dependency
        // into a manual chunk makes rollup hoist the shared interop helper into
        // that chunk, which gives the entry a *static* import edge to the whole
        // bundle for the sake of a ~140-byte helper. That is what happened when
        // Supabase was listed here (223KB paid by every visitor on every route,
        // since removed with Google One Tap). After changing this, check that
        // the built entry has no static chunk imports it did not have before.
        manualChunks: {
          posthog: ["posthog-js"],
        },
      },
    },
    // Vite eagerly emits a <link rel="modulepreload"> for a dynamically-imported
    // chunk reachable from the entry, which would pull posthog-js on every
    // homepage load and defeat the deferral. Drop the preload hint so it
    // downloads only when analytics actually initialises; route chunks keep
    // their normal preloads.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/\/posthog-[\w-]+\.js$/.test(dep)),
    },
  },
  test: {
    environment: "node",
    include: ["api/**/*.test.ts", "src/**/*.test.{ts,tsx}"],
  },
}));
