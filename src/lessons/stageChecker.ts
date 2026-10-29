import type { Stage, StageCheckResult } from "./types";

export type StageCheckContext = {
  stepsTaken?: number;
};

export function checkStageAnswer(
  stage: Stage,
  rawAnswer: string,
  context: StageCheckContext = {}
): StageCheckResult {
  const answer = normalize(rawAnswer);

  if (stage.id === "life-prologue") {
    if ((context.stepsTaken ?? 0) < 5) {
      return fail("Step the Oracle at least five times before answering.");
    }

    return answer.includes("moved") || answer.includes("move")
      ? pass(stage)
      : fail("The glider should move diagonally instead of freezing or disappearing.");
  }

  if (stage.id === "life-01-silent-board") {
    if (answer === "[0]*width" || answer === "list(0for_inrange(width))") {
      return pass(stage);
    }

    return fail("This row must be a list of zeroes, not one number.");
  }

  if (stage.id === "life-02-coordinates") {
    return answer.includes("row][col") || answer.includes("grid[row][col]")
      ? pass(stage)
      : fail("The selected rune is addressed as grid[row][col]. Row comes first.");
  }

  if (stage.id === "life-03-living-dead") {
    return answer === "==" || answer.includes("==1")
      ? pass(stage)
      : fail("Use two equals signs to ask whether the value is 1.");
  }

  if (stage.id === "life-04-count-the-eight") {
    return answer === "0<=nr<heightand0<=nc<width"
      ? pass(stage)
      : fail("Check row and column minimum and maximum before reading the grid.");
  }

  return answer === normalize(stage.answer) ? pass(stage) : fail(stage.hints[0]);
}

function pass(stage: Stage): StageCheckResult {
  return {
    ok: true,
    title: "Rune restored",
    message: stage.validationMessage,
    objectiveIds: stage.objectives.map((objective) => objective.id)
  };
}

function fail(message: string): StageCheckResult {
  return {
    ok: false,
    title: "The world is still distorted",
    message,
    objectiveIds: []
  };
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "");
}
