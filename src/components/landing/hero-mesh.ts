import heroMesh960 from "@/assets/hero-mesh-960.webp";
import heroMesh1440 from "@/assets/hero-mesh-1440.webp";

// The hero's mesh-wave background (handoff 02-hero). Shared by Hero.tsx, which
// paints it, and Index.tsx, which preloads the same file the CSS picks at each
// width (960px wide below the 820px switch, 1440px above), so the browser
// fetches only one. The handoff's PNG was 2880x1440 and 3.4MB; these WebPs
// are 92KB and 215KB, the size the hero actually paints at.
export const HERO_MESH = { narrow: heroMesh960, wide: heroMesh1440, switchPx: 820 } as const;
