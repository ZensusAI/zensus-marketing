// Blog image invariant.
//
// scripts/optimize-blog-images.mjs writes a .webp twin beside every blog PNG,
// and the twin is what a post should ship: each is under half its PNG's size,
// and the 41 together are a fifth (1.4 MB against 7.1 MB). Nothing stopped a
// post from referencing the PNG anyway, and 22 figures and all 13 card
// thumbnails did. On the blog index the largest paint is a card thumbnail, so
// that cost seconds on a phone and nothing in the build said so.
//
// MDX is not typechecked, so BlogFigure's required width and height props are
// not enforced there either. A figure without them reserves no space and shifts
// the text below it when the image arrives.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const blogDir = join(repoRoot, "src", "content", "blog");

const posts = readdirSync(blogDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => ({ file: f, source: readFileSync(join(blogDir, f), "utf-8") }));

interface Figure {
  file: string;
  src: string;
  hasSize: boolean;
}

function figures(): Figure[] {
  return posts.flatMap(({ file, source }) =>
    [...source.matchAll(/<BlogFigure([\s\S]*?)\/>/g)].map((m) => ({
      file,
      src: m[1].match(/src="([^"]+)"/)?.[1] ?? "",
      hasSize: /width=\{\d+\}/.test(m[1]) && /height=\{\d+\}/.test(m[1]),
    })),
  );
}

function thumbnails(): { file: string; src: string }[] {
  return posts.flatMap(({ file, source }) => {
    const src = source.match(/thumbnail:\s*['"]([^'"]+)['"]/)?.[1];
    return src ? [{ file, src }] : [];
  });
}

describe("blog images", () => {
  it("finds the figures and thumbnails it is meant to check", () => {
    expect(figures().length).toBeGreaterThan(30);
    expect(thumbnails().length).toBeGreaterThan(10);
  });

  it("ships every figure and thumbnail as WebP", () => {
    const offenders = [...figures(), ...thumbnails()]
      .filter(({ src }) => !src.endsWith(".webp"))
      .map(({ file, src }) => `${file}: ${src}`);

    expect(offenders).toEqual([]);
  });

  it("gives every figure its pixel dimensions", () => {
    const offenders = figures()
      .filter(({ hasSize }) => !hasSize)
      .map(({ file, src }) => `${file}: ${src}`);

    expect(offenders).toEqual([]);
  });

  it("only references files that exist under public/", () => {
    const offenders = [...figures(), ...thumbnails()]
      .filter(({ src }) => !existsSync(join(repoRoot, "public", src)))
      .map(({ file, src }) => `${file}: ${src}`);

    expect(offenders).toEqual([]);
  });
});
