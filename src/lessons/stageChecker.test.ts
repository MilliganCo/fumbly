import { describe, expect, it } from "vitest";
import { episodeCatalog } from "./lessonData";
import { checkStageAnswer } from "./stageChecker";

const stages = episodeCatalog[0].stages;

describe("stage checker", () => {
  it("accepts the prologue observation after enough steps", () => {
    const result = checkStageAnswer(stages[0], "moved", { stepsTaken: 5 });

    expect(result.ok).toBe(true);
    expect(result.objectiveIds).toEqual([
      "initialize_grid",
      "count_neighbors",
      "apply_rules",
      "advance_world"
    ]);
  });

  it("rejects the prologue before the player has stepped enough", () => {
    const result = checkStageAnswer(stages[0], "moved", { stepsTaken: 2 });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Step");
  });

  it("accepts equivalent silent-board snippets", () => {
    const result = checkStageAnswer(stages[1], " [0] * WIDTH ");

    expect(result.ok).toBe(true);
  });

  it("rejects a number where a row-list is required", () => {
    const result = checkStageAnswer(stages[1], "0 * WIDTH");

    expect(result.ok).toBe(false);
    expect(result.message).toContain("list");
  });

  it("accepts the boundary condition for neighbor counting", () => {
    const result = checkStageAnswer(
      stages[4],
      "0 <= nr < height and 0 <= nc < width"
    );

    expect(result.ok).toBe(true);
  });
});
