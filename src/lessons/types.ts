import type { Grid } from "../simulation/grid";

export type DifficultyMode = "guided" | "standard" | "silent";
export type EpisodeStatus = "open" | "planned" | "locked" | "experimental";
export type StageStatus = "open" | "locked";

export type NarrativeBlock = {
  speaker: "nera" | "system" | "oracle";
  kind: "story" | "concept" | "task" | "fact";
  text: string;
};

export type Objective = {
  id: string;
  text: string;
  required: boolean;
};

export type Stage = {
  id: string;
  episodeId: string;
  order: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  concepts: string[];
  narrative: NarrativeBlock[];
  objectives: Objective[];
  starterCode: string;
  answer: string;
  validationMessage: string;
  hints: string[];
  initialGrid: Grid;
  selectedCell?: { row: number; col: number };
  unlocks: string[];
};

export type Episode = {
  id: string;
  roman: string;
  title: string;
  project: string;
  status: EpisodeStatus;
  description: string;
  teaches: string[];
  stages: Stage[];
};

export type ProgressState = {
  completedStageIds: string[];
  unlockedStageIds: string[];
  difficultyMode: DifficultyMode;
};

export type StageCheckResult = {
  ok: boolean;
  title: string;
  message: string;
  objectiveIds: string[];
};
