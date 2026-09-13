import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "path";

import { LEGACY_SITE_HOST, SITE_HOST, SITE_URL } from "./scripts/site.mjs";

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
      name: "stamp-index-html",
      // index.html is static, so unlike the app bundle it cannot import the
      // site constants. That made it the one file a domain change silently
      // missed, and it is the worst file to miss: it carries the schema.org
      // @id values that search and AI engines treat as this site's entity
      // identity, so a stale origin here declares the site to be a different
      // entity from the one it serves canonicals for.
      //
      // __SITE_MODIFIED__ is the same idea applied to freshness: a hardcoded
      // dateModified goes stale without anyone noticing. Both run at build and
      // in the dev server.
      transformIndexHtml(html: string) {
        return html
          .replaceAll("__SITE_URL__", SITE_URL)
          .replaceAll("__SITE_HOST__", SITE_HOST)
          .replaceAll("__LEGACY_SITE_HOST__", LEGACY_SITE_HOST)
          .replace("__SITE_MODIFIED__", new Date().toISOString().slice(0, 10));
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
