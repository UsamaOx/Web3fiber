import { describe, expect, it } from "vitest";
import { getInteractiveMotionProps } from "../src/blocks/interactive-motion.js";

describe("interactive block animations", () => {
  it("uses configured effect, intensity, duration, and hover colors", () => {
    const motionProps = getInteractiveMotionProps({
      effect: "lift",
      intensity: 1.5,
      duration: 0.4,
      hoverColor: "#123456",
      hoverBackgroundColor: "#abcdef",
    });

    expect(motionProps.whileHover).toEqual({
      y: -6,
      scale: 1.0225,
      color: "#123456",
      backgroundColor: "#abcdef",
    });
    expect(motionProps.whileTap.scale).toBe(0.94);
    expect(motionProps.transition.duration).toBe(0.4);
  });

  it("leaves blocks still when the hover effect is disabled", () => {
    expect(
      getInteractiveMotionProps({
        effect: "none",
        intensity: 1,
        duration: 0.25,
      }),
    ).toEqual({});
  });
});
