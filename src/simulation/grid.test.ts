import { describe, expect, it } from "vitest";
import {
  cloneGrid,
  countNeighbors,
  createEmptyGrid,
  nextGeneration,
  parsePattern,
  placePattern
} from "./grid";

describe("Game of Life grid helpers", () => {
  it("creates an empty grid with stable dimensions", () => {
    expect(createEmptyGrid(3, 2)).toEqual([
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });

  it("counts neighbors without reading outside board boundaries", () => {
    const grid = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ];

    expect(countNeighbors(grid, 0, 0)).toBe(1);
    expect(countNeighbors(grid, 1, 1)).toBe(1);
  });

  it("keeps a block stable", () => {
    const block = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ];

    expect(nextGeneration(block)).toEqual(block);
  });

  it("returns a blinker to its starting shape after two generations", () => {
    const blinker = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];

    const first = nextGeneration(blinker);
    const second = nextGeneration(first);

    expect(first).not.toEqual(blinker);
    expect(second).toEqual(blinker);
  });

  it("does not mutate the input grid when stepping", () => {
    const grid = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ];
    const before = cloneGrid(grid);

    nextGeneration(grid);

    expect(grid).toEqual(before);
  });

  it("parses and places text patterns without changing the source grid", () => {
    const pattern = parsePattern(".O.\n..O\nOOO");
    const grid = createEmptyGrid(6, 6);
    const placed = placePattern(grid, pattern, 1, 2);

    expect(grid).toEqual(createEmptyGrid(6, 6));
    expect(placed[1][3]).toBe(1);
    expect(placed[2][4]).toBe(1);
    expect(placed[3][2]).toBe(1);
    expect(placed[3][3]).toBe(1);
    expect(placed[3][4]).toBe(1);
  });
});
