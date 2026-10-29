import type { Grid } from "./grid";
import { parsePattern } from "./grid";

export type PatternDefinition = {
  id: string;
  name: string;
  kind: "still-life" | "oscillator" | "spaceship";
  description: string;
  grid: Grid;
};

export const patterns: PatternDefinition[] = [
  {
    id: "block",
    name: "Block",
    kind: "still-life",
    description: "A quiet square that keeps its shape.",
    grid: parsePattern("OO\nOO")
  },
  {
    id: "blinker",
    name: "Blinker",
    kind: "oscillator",
    description: "Three cells that return every two generations.",
    grid: parsePattern("OOO")
  },
  {
    id: "glider",
    name: "Glider",
    kind: "spaceship",
    description: "A small messenger that walks diagonally.",
    grid: parsePattern(".O.\n..O\nOOO")
  },
  {
    id: "beacon",
    name: "Beacon",
    kind: "oscillator",
    description: "Two blocks that flash at the corners.",
    grid: parsePattern("OO..\nOO..\n..OO\n..OO")
  }
];

export function getPattern(id: string): PatternDefinition {
  const pattern = patterns.find((item) => item.id === id);

  if (!pattern) {
    throw new Error(`Unknown pattern: ${id}`);
  }

  return pattern;
}
