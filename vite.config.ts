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
        // posthog-js and Supabase are only ever dynamically imported (analytics
        // loads at runtime in lib/analytics/events.ts; Supabase loads inside the
        // Google One Tap effect). Pin each to its own named chunk so it is a
        // clean, lazy, on-demand bundle instead of being folded into an unrelated
        // route chunk (rollup otherwise merged posthog into /privacy).
        manualChunks: {
          posthog: ["posthog-js"],
          supabase: ["@supabase/supabase-js", "@supabase/ssr"],
        },
      },
    },
    // Vite eagerly emits a <link rel="modulepreload"> for a dynamically-imported
    // chunk reachable from the entry, which would pull the ~220KB Supabase chunk
    // on every homepage load and defeat the deferral. Drop the preload hints for
    // these heavy lazy chunks so they download only when their feature actually
    // runs; route chunks keep their normal preloads.
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/\/(posthog|supabase)-[\w-]+\.js$/.test(dep)),
    },
  },
  test: {
    environment: "node",
    include: ["api/**/*.test.ts", "src/**/*.test.{ts,tsx}"],
  },
}));
