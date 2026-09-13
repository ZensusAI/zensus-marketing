// Types for scripts/site.mjs, which is plain ESM so the build scripts can load
// it without a TypeScript step. vite.config.ts imports it to stamp the origin
// into index.html, and that import needs declarations.
export const SITE_URL: string;
export const SITE_HOST: string;
export const LEGACY_SITE_URL: string;
export const LEGACY_SITE_HOST: string;
