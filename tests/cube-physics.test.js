import { describe, expect, it } from "vitest";
import {
  advanceCubeBodies,
  bounceCubeFromPointer,
  createCubeBodies,
} from "../src/blocks/cube-physics.js";

describe("interactive cube physics", () => {
  it("distributes a large field across the available viewport", () => {
    const bodies = createCubeBodies(120, 20, 7);
    const xPositions = bodies.map((body) => body.position[0]);
    const yPositions = bodies.map((body) => body.position[1]);
    const colorVariants = new Set(bodies.map((body) => body.colorVariant));

    expect(bodies).toHaveLength(120);
    expect(colorVariants).toEqual(new Set([0, 1]));
    expect(Math.min(...xPositions)).toBeLessThan(-8);
    expect(Math.max(...xPositions)).toBeGreaterThan(8);
    expect(Math.min(...yPositions)).toBeLessThan(-2);
    expect(Math.max(...yPositions)).toBeGreaterThan(2);
  });

  it("transfers momentum when moving cubes collide", () => {
    const bodies = createCubeBodies(2);
    bodies[0].position = [-0.1, 0, 0];
    bodies[1].position = [0.1, 0, 0];
    bodies[0].velocity = [1, 0, 0];
    bodies[1].velocity = [-1, 0, 0];

    advanceCubeBodies(bodies, 1 / 60);

    expect(bodies[0].velocity[0]).toBeLessThan(0);
    expect(bodies[1].velocity[0]).toBeGreaterThan(0);
  });

  it("pushes a hovered cube away from the pointer", () => {
    const [body] = createCubeBodies(1);
    body.position = [0, 0, 0];
    body.hovered = true;
    body.pointer = [-1, 0, 0];

    advanceCubeBodies([body], 1 / 60);

    expect(body.velocity[0]).toBeGreaterThan(0);
  });

  it("bounces a cube outward on pointer contact", () => {
    const [body] = createCubeBodies(1);
    body.position = [0, 0, 0];
    body.velocity = [-1, 0, 0];

    bounceCubeFromPointer(body, [-0.23, 0, 0]);

    expect(body.velocity[0]).toBeGreaterThan(0);
  });
});
