import type { Episode, ProgressState, Stage } from "./types";

export function buildInitialProgress(episodes: Episode[]): ProgressState {
  const firstStage = episodes.flatMap((episode) => episode.stages)[0];

  return {
    completedStageIds: [],
    unlockedStageIds: firstStage ? [firstStage.id] : [],
    difficultyMode: "standard"
  };
}

export function isStageUnlocked(progress: ProgressState, stageId: string): boolean {
  return progress.unlockedStageIds.includes(stageId);
}

export function getAllStages(episodes: Episode[]): Stage[] {
  return episodes.flatMap((episode) =>
    episode.stages
      .slice()
      .sort((left, right) => left.order - right.order)
  );
}

export function getStage(episodes: Episode[], stageId: string): Stage | undefined {
  return getAllStages(episodes).find((stage) => stage.id === stageId);
}

export function getCurrentStage(
  episodes: Episode[],
  progress: ProgressState
): Stage | undefined {
  const stages = getAllStages(episodes);
  return (
    stages.find(
      (stage) =>
        progress.unlockedStageIds.includes(stage.id) &&
        !progress.completedStageIds.includes(stage.id)
    ) ?? stages[0]
  );
}

export function getNextStage(
  episodes: Episode[],
  stageId: string
): Stage | undefined {
  const stages = getAllStages(episodes);
  const index = stages.findIndex((stage) => stage.id === stageId);

  if (index < 0) {
    return undefined;
  }

  return stages[index + 1];
}

export function completeStage(
  progress: ProgressState,
  episodes: Episode[],
  stageId: string
): ProgressState {
  const stage = getStage(episodes, stageId);
  const unlocks = stage?.unlocks ?? [];

  return {
    ...progress,
    completedStageIds: unique([...progress.completedStageIds, stageId]),
    unlockedStageIds: unique([...progress.unlockedStageIds, ...unlocks])
  };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
