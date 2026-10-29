import { create } from "zustand";
import { persist } from "zustand/middleware";
import { completeStage, getCurrentStage, getStage } from "../lessons/lessonEngine";
import { episodeCatalog } from "../lessons/lessonData";
import { checkStageAnswer } from "../lessons/stageChecker";
import type { ProgressState, StageCheckResult } from "../lessons/types";
import {
  cloneGrid,
  countNeighbors,
  createEmptyGrid,
  nextGeneration,
  placePattern,
  population,
  type Grid,
  type RuleSet
} from "../simulation/grid";
import { getPattern } from "../simulation/patterns";

const firstProgress: ProgressState = {
  completedStageIds: [],
  unlockedStageIds: ["life-prologue"],
  difficultyMode: "standard"
};

const firstStage = getCurrentStage(episodeCatalog, firstProgress)!;

export type SandboxPreset = "classic" | "overbirth" | "weak-survival" | "wrapped";

type FumblyState = {
  progress: ProgressState;
  selectedStageId: string;
  grid: Grid;
  generation: number;
  stepsTaken: number;
  code: string;
  selectedCell?: { row: number; col: number };
  hoveredCell?: { row: number; col: number };
  runResult?: StageCheckResult;
  sandboxOpen: boolean;
  sandboxPreset: SandboxPreset;
  setSelectedStage: (stageId: string) => void;
  setCode: (code: string) => void;
  stepWorld: () => void;
  resetWorld: () => void;
  toggleCell: (row: number, col: number) => void;
  setHoveredCell: (cell?: { row: number; col: number }) => void;
  runStage: () => void;
  openSandbox: () => void;
  closeSandbox: () => void;
  applySandboxPreset: (preset: SandboxPreset) => void;
};

export const useFumblyStore = create<FumblyState>()(
  persist(
    (set, get) => ({
      progress: firstProgress,
      selectedStageId: firstStage.id,
      grid: cloneGrid(firstStage.initialGrid),
      generation: 0,
      stepsTaken: 0,
      code: firstStage.starterCode,
      selectedCell: firstStage.selectedCell,
      sandboxOpen: false,
      sandboxPreset: "classic",
      setSelectedStage: (stageId) => {
        const stage = getStage(episodeCatalog, stageId);
        if (!stage) return;

        set({
          selectedStageId: stage.id,
          grid: cloneGrid(stage.initialGrid),
          generation: 0,
          stepsTaken: 0,
          code: stage.starterCode,
          selectedCell: stage.selectedCell,
          runResult: undefined
        });
      },
      setCode: (code) => set({ code }),
      stepWorld: () => {
        const state = get();
        const rules = presetToRules(state.sandboxPreset);
        set({
          grid: nextGeneration(state.grid, rules),
          generation: state.generation + 1,
          stepsTaken: state.stepsTaken + 1
        });
      },
      resetWorld: () => {
        const stage = getStage(episodeCatalog, get().selectedStageId);
        if (!stage) return;

        set({
          grid: cloneGrid(stage.initialGrid),
          generation: 0,
          stepsTaken: 0,
          code: stage.starterCode,
          selectedCell: stage.selectedCell,
          runResult: undefined
        });
      },
      toggleCell: (row, col) => {
        const grid = cloneGrid(get().grid);
        if (!grid[row] || grid[row][col] === undefined) return;

        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
        set({ grid, selectedCell: { row, col } });
      },
      setHoveredCell: (cell) => set({ hoveredCell: cell }),
      runStage: () => {
        const state = get();
        const stage = getStage(episodeCatalog, state.selectedStageId);
        if (!stage) return;

        const answer = stage.id === "life-prologue" ? "moved" : state.code;
        const result = checkStageAnswer(stage, answer, {
          stepsTaken: state.stepsTaken
        });

        if (!result.ok) {
          set({ runResult: result });
          return;
        }

        const progress = completeStage(state.progress, episodeCatalog, stage.id);
        set({ progress, runResult: result });
      },
      openSandbox: () => set({ sandboxOpen: true }),
      closeSandbox: () => set({ sandboxOpen: false }),
      applySandboxPreset: (preset) => {
        const base = createEmptyGrid(20, 20);
        const pattern = getPattern(preset === "classic" ? "glider" : "blinker");
        set({
          sandboxPreset: preset,
          grid: placePattern(base, pattern.grid, 8, 8),
          generation: 0,
          stepsTaken: 0,
          sandboxOpen: true
        });
      }
    }),
    {
      name: "fumbly-progress",
      partialize: (state) => ({
        progress: state.progress,
        selectedStageId: state.selectedStageId
      })
    }
  )
);

export function presetToRules(preset: SandboxPreset): RuleSet {
  if (preset === "overbirth") {
    return { birth: new Set([3, 4, 5, 6, 7, 8]), survival: new Set([2, 3]) };
  }

  if (preset === "weak-survival") {
    return { birth: new Set([3]), survival: new Set([1, 2, 3]) };
  }

  if (preset === "wrapped") {
    return { birth: new Set([3]), survival: new Set([2, 3]), wrap: true };
  }

  return { birth: new Set([3]), survival: new Set([2, 3]) };
}

export function getBoardMetrics(grid: Grid, selectedCell?: { row: number; col: number }) {
  return {
    population: population(grid),
    selectedNeighbors: selectedCell
      ? countNeighbors(grid, selectedCell.row, selectedCell.col)
      : undefined
  };
}
