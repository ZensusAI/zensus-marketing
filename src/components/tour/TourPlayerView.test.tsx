import { isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { START_TRIAL_URL, TALK_TO_US_URL } from "@/lib/constants";
import { tourReducer, type TourAction, type TourStep } from "@/lib/tour";
import { TourPlayerView, type ImageState } from "./TourPlayerView";

// The suite runs in node with no DOM, so the player is driven the way React
// would: TourPlayerView is a pure function of its props, its buttons' onClick
// handlers are called directly, and the same reducer TourPlayer uses turns
// each action into the next index.

const steps: TourStep[] = Array.from({ length: 8 }, (_, i) => ({
  id: `step-${i + 1}`,
  title: `Title ${i + 1}`,
  caption: `Caption ${i + 1}.`,
  hotspot: { x: 10, y: 20, w: 30, h: 15 },
  width: 1440,
  height: 900,
}));

type Props = { [key: string]: unknown; children?: ReactNode; onClick?: () => void };

/** Expands plain function components (not forwardRef icons) into host elements. */
function flatten(node: ReactNode, out: ReactElement<Props>[] = []): ReactElement<Props>[] {
  if (Array.isArray(node)) {
    node.forEach((n) => flatten(n, out));
    return out;
  }
  if (!isValidElement<Props>(node)) return out;
  if (typeof node.type === "function") {
    return flatten((node.type as (p: Props) => ReactNode)(node.props), out);
  }
  out.push(node);
  flatten(node.props.children, out);
  return out;
}

function harness(start = 0) {
  const reduce = tourReducer(steps.length);
  let index = start;
  const images: Record<string, ImageState> = Object.fromEntries(
    steps.map((s) => [s.id, { status: "ready", url: `blob:${s.id}` } as ImageState]),
  );
  const onAction = (a: TourAction | { goto: number }) => {
    index = reduce(index, a);
  };
  const tree = () => flatten(TourPlayerView({ name: "Acme Robotics", steps, index, images, onAction }));
  const find = (tag: string) => tree().filter((el) => el.props["data-tour"] === tag);
  const click = (tag: string, n = 0) => {
    const el = find(tag)[n];
    if (!el) throw new Error(`no ${tag}`);
    if (el.props.disabled) return;
    el.props.onClick?.();
  };
  const markup = () => renderToStaticMarkup(TourPlayerView({ name: "Acme Robotics", steps, index, images, onAction }));
  return { get index() { return index; }, find, click, markup };
}

describe("tour player", () => {
  it("shows who it was prepared for, the step, its caption and a hotspot at the manifest's percentages", () => {
    const p = harness();
    const html = p.markup();
    expect(html).toContain("Prepared for <span");
    expect(html).toContain("Acme Robotics");
    expect(html).toContain("Step 1 of 8");
    expect(html).toContain("Title 1");
    expect(html).toContain("Caption 1.");
    expect(html).toMatch(/data-tour="hotspot"[^>]*style="left:10%;top:20%;width:30%;height:15%"/);
    expect(html).toContain('src="blob:step-1"');
  });

  it("advances on a hotspot click, and on a tap anywhere on the image (phones)", () => {
    const p = harness();
    p.click("hotspot");
    expect(p.index).toBe(1);
    p.click("tap-advance");
    expect(p.index).toBe(2);
    expect(p.markup()).toContain("Title 3");
  });

  it("Back, Next and Restart move through the steps; Back is disabled on the first", () => {
    const p = harness();
    expect(p.find("back")[0].props.disabled).toBe(true);
    p.click("next");
    p.click("next");
    expect(p.index).toBe(2);
    p.click("back");
    expect(p.index).toBe(1);
    p.click("restart");
    expect(p.index).toBe(0);
  });

  it("has one dot per step plus the end, and a dot jumps to its step", () => {
    const p = harness();
    expect(p.find("dot")).toHaveLength(steps.length + 1);
    p.click("dot", 5);
    expect(p.index).toBe(5);
  });

  it("keeps Back, Next, dots and Restart visible on every step and on the end screen", () => {
    for (let i = 0; i <= steps.length; i += 1) {
      const p = harness(i);
      for (const tag of ["back", "next", "restart", "dot"]) expect(p.find(tag).length, `${tag} at ${i}`).toBeGreaterThan(0);
    }
  });

  it("ends on a screen whose buttons point at the site's booking and trial links", () => {
    const p = harness(steps.length - 1);
    p.click("hotspot");
    expect(p.index).toBe(steps.length);
    expect(p.find("hotspot")).toHaveLength(0);
    expect(p.find("next")[0].props.disabled).toBe(true);
    const book = p.find("book-demo")[0];
    const trial = p.find("start-trial")[0];
    expect(book.props.href).toBe(TALK_TO_US_URL);
    expect(trial.props.href).toBe(START_TRIAL_URL);
    const html = p.markup();
    expect(html).toContain("Book a live demo");
    expect(html).toContain("Start free trial");
    p.click("restart");
    expect(p.index).toBe(0);
  });

  it("sizes the screenshot to the viewport width, never wider (no sideways scroll on a 360px phone)", () => {
    const html = harness().markup();
    expect(html).toContain("width:min(100%, calc((100svh - 15rem) * 1.6000))");
    expect(html).toContain("aspect-ratio:1440 / 900");
    expect(html).toContain("flex-wrap");
  });
});
