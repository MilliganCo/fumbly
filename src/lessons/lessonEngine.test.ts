import { describe, expect, it } from "vitest";
import {
  buildInitialProgress,
  completeStage,
  getCurrentStage,
  getNextStage,
  isStageUnlocked
} from "./lessonEngine";
import { episodeCatalog } from "./lessonData";

describe("lesson engine", () => {
  it("unlocks only the first stage at the start", () => {
    const progress = buildInitialProgress(episodeCatalog);

    expect(isStageUnlocked(progress, "life-prologue")).toBe(true);
    expect(isStageUnlocked(progress, "life-01-silent-board")).toBe(false);
  });

  it("completes a stage and unlocks the next one", () => {
    const progress = buildInitialProgress(episodeCatalog);
    const nextProgress = completeStage(progress, episodeCatalog, "life-prologue");

    expect(nextProgress.completedStageIds).toContain("life-prologue");
    expect(isStageUnlocked(nextProgress, "life-01-silent-board")).toBe(true);
  });

  it("returns the first available current stage", () => {
    const progress = buildInitialProgress(episodeCatalog);

    expect(getCurrentStage(episodeCatalog, progress)?.id).toBe("life-prologue");
  });

  it("returns next stage within the same episode", () => {
    expect(getNextStage(episodeCatalog, "life-02-coordinates")?.id).toBe(
      "life-03-living-dead"
    );
  });
});
