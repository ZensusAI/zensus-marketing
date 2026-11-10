import { describe, expect, it } from "vitest";
import { actionForKeyEvent, tokenFromHash, tourReducer } from "./tour";

describe("tour link fragment", () => {
  it("reads the token from #t=", () => {
    expect(tokenFromHash("#t=v1.abc.def")).toBe("v1.abc.def");
    expect(tokenFromHash("#t=")).toBeNull();
    expect(tokenFromHash("")).toBeNull();
    expect(tokenFromHash("#features")).toBeNull();
  });
});

describe("tour step reducer", () => {
  const reduce = tourReducer(8);

  it("moves forward to the end screen and stops there", () => {
    expect(reduce(0, "next")).toBe(1);
    expect(reduce(7, "next")).toBe(8);
    expect(reduce(8, "next")).toBe(8);
  });

  it("moves back and stops at the first step", () => {
    expect(reduce(3, "back")).toBe(2);
    expect(reduce(0, "back")).toBe(0);
    expect(reduce(8, "back")).toBe(7);
  });

  it("restarts from anywhere, and jumps within bounds", () => {
    expect(reduce(8, "restart")).toBe(0);
    expect(reduce(5, "restart")).toBe(0);
    expect(reduce(0, { goto: 4 })).toBe(4);
    expect(reduce(0, { goto: 99 })).toBe(8);
    expect(reduce(3, { goto: -1 })).toBe(0);
  });
});

describe("tour keyboard", () => {
  it("advances on the right arrow and Enter, goes back on the left arrow", () => {
    expect(actionForKeyEvent({ key: "ArrowRight" }, "BODY")).toBe("next");
    expect(actionForKeyEvent({ key: "Enter" }, "BODY")).toBe("next");
    expect(actionForKeyEvent({ key: "ArrowLeft" }, "BODY")).toBe("back");
    expect(actionForKeyEvent({ key: "a" }, "BODY")).toBeNull();
  });

  it("leaves Enter on a focused control to that control, so it never counts twice", () => {
    expect(actionForKeyEvent({ key: "Enter" }, "BUTTON")).toBeNull();
    expect(actionForKeyEvent({ key: "Enter" }, "a")).toBeNull();
    expect(actionForKeyEvent({ key: "ArrowRight" }, "BUTTON")).toBe("next");
  });

  it("ignores modified keys (browser shortcuts such as Alt+Left)", () => {
    expect(actionForKeyEvent({ key: "ArrowLeft", altKey: true }, "BODY")).toBeNull();
    expect(actionForKeyEvent({ key: "ArrowRight", metaKey: true }, "BODY")).toBeNull();
  });
});
