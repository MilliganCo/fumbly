import { createEmptyGrid, placePattern, type Grid } from "../simulation/grid";
import { getPattern } from "../simulation/patterns";
import type { Episode, Stage } from "./types";

const prologueGrid = makePrologueGrid();
const emptyGrid = createEmptyGrid(5, 5);
const coordinateGrid = placePattern(createEmptyGrid(5, 5), [[1]], 2, 3);
const countGrid: Grid = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0]
];

const lifeStages: Stage[] = [
  {
    id: "life-prologue",
    episodeId: "living-grid",
    order: 0,
    title: "Awaken the Grid",
    subtitle: "Write code that performs one step of Conway's Game of Life.",
    estimatedMinutes: 3,
    concepts: ["generation", "cellular automaton", "pattern"],
    narrative: [
      {
        speaker: "oracle",
        kind: "story",
        text: "In the Academy's oldest terminal, a world stirs."
      },
      {
        speaker: "nera",
        kind: "concept",
        text: "Cells live, die, and multiply according to simple laws."
      },
      {
        speaker: "system",
        kind: "task",
        text: "Your code is the spell that guides fate itself."
      }
    ],
    objectives: [
      { id: "initialize_grid", text: "Initialize the grid", required: true },
      { id: "count_neighbors", text: "Count live neighbors", required: true },
      { id: "apply_rules", text: "Apply the rules of life", required: true },
      { id: "advance_world", text: "Advance the world", required: true }
    ],
    starterCode:
      "def step(grid):\n    \"\"\"Return the next generation of the grid.\"\"\"\n    h = len(grid)\n    w = len(grid[0])\n    next_grid = [[0 for _ in range(w)] for _ in range(h)]\n\n    for y in range(h):\n        for x in range(w):\n            neighbors = count_neighbors(grid, x, y)\n            next_grid[y][x] = apply_rules(grid[y][x], neighbors)\n\n    return next_grid",
    answer: "moved",
    validationMessage: "The glider moved diagonally. Local rules created motion.",
    hints: ["Use Step instead of Play so you can see each generation."],
    initialGrid: prologueGrid,
    unlocks: ["life-01-silent-board"]
  },
  {
    id: "life-01-silent-board",
    episodeId: "living-grid",
    order: 1,
    title: "The Silent Board",
    subtitle: "A world starts as rows of data.",
    estimatedMinutes: 5,
    concepts: ["list", "grid", "row"],
    narrative: [
      {
        speaker: "nera",
        kind: "story",
        text: "Before a world can live, it needs a place to exist."
      },
      {
        speaker: "system",
        kind: "concept",
        text: "A 5x5 dead board is a list containing five rows, each with five zeroes."
      },
      {
        speaker: "system",
        kind: "task",
        text: "Create one row of dead cells and append it to the grid."
      }
    ],
    objectives: [
      { id: "create_row", text: "Create one row with WIDTH dead cells", required: true },
      { id: "append_row", text: "Append the row to the grid", required: true }
    ],
    starterCode:
      "WIDTH = 5\nHEIGHT = 5\n\ngrid = []\nfor row in range(HEIGHT):\n    grid.append(____)",
    answer: "[0] * WIDTH",
    validationMessage: "The floor appears. A silent world is still a world.",
    hints: ["A row should be a list, not a single number.", "Try [0] * WIDTH."],
    initialGrid: emptyGrid,
    unlocks: ["life-02-coordinates"]
  },
  {
    id: "life-02-coordinates",
    episodeId: "living-grid",
    order: 2,
    title: "Coordinates of the Hall",
    subtitle: "The board is read by row, then column.",
    estimatedMinutes: 5,
    concepts: ["index", "row", "col"],
    narrative: [
      {
        speaker: "nera",
        kind: "story",
        text: "A single rune flickers under your cursor. Can you name where it is?"
      },
      {
        speaker: "system",
        kind: "concept",
        text: "grid[2][3] means row 2, column 3. Counting starts at 0."
      },
      {
        speaker: "system",
        kind: "task",
        text: "Turn the selected cell alive by writing to grid[row][col]."
      }
    ],
    objectives: [
      { id: "select_cell", text: "Inspect row 2, column 3", required: true },
      { id: "set_alive", text: "Set grid[row][col] to 1", required: true }
    ],
    starterCode:
      "def set_alive(grid, row, col):\n    grid[____][____] = 1\n    return grid",
    answer: "row][col",
    validationMessage: "One rune lights up. You changed the world by changing one value.",
    hints: ["In the data grid, row comes first.", "Use grid[row][col]."],
    initialGrid: coordinateGrid,
    selectedCell: { row: 2, col: 3 },
    unlocks: ["life-03-living-dead"]
  },
  {
    id: "life-03-living-dead",
    episodeId: "living-grid",
    order: 3,
    title: "Living and Dead",
    subtitle: "The Oracle sees values, not symbols.",
    estimatedMinutes: 5,
    concepts: ["state", "comparison", "boolean"],
    narrative: [
      {
        speaker: "nera",
        kind: "story",
        text: "Some runes burn. Some sleep."
      },
      {
        speaker: "system",
        kind: "concept",
        text: "We use 1 for alive and 0 for dead. Two equals signs ask a question."
      },
      {
        speaker: "system",
        kind: "task",
        text: "Return True when the cell value is 1."
      }
    ],
    objectives: [
      { id: "read_value", text: "Read grid[row][col]", required: true },
      { id: "compare_alive", text: "Compare the value with 1", required: true }
    ],
    starterCode:
      "def is_alive(grid, row, col):\n    return grid[row][col] ____ 1",
    answer: "==",
    validationMessage: "The Oracle can now ask whether a rune is alive.",
    hints: ["One equals sign changes a value.", "Use == to compare."],
    initialGrid: coordinateGrid,
    selectedCell: { row: 2, col: 3 },
    unlocks: ["life-04-count-the-eight"]
  },
  {
    id: "life-04-count-the-eight",
    episodeId: "living-grid",
    order: 4,
    title: "Count the Eight",
    subtitle: "A cell listens to nearby spaces.",
    estimatedMinutes: 8,
    concepts: ["nested loops", "bounds", "continue"],
    narrative: [
      {
        speaker: "nera",
        kind: "story",
        text: "No rune lives alone. Each one listens to the eight spaces around it."
      },
      {
        speaker: "system",
        kind: "concept",
        text: "Use dr and dc offsets. Skip the center cell because it is not its own neighbor."
      },
      {
        speaker: "system",
        kind: "task",
        text: "Write the boundary check so the code only counts cells inside the board."
      }
    ],
    objectives: [
      { id: "inspect_neighbors", text: "Inspect the selected cell's neighbors", required: true },
      { id: "write_boundary_check", text: "Write a boundary check", required: true },
      { id: "pass_tests", text: "Pass neighbor-count tests", required: true }
    ],
    starterCode:
      "def count_neighbors(grid, row, col):\n    count = 0\n    height = len(grid)\n    width = len(grid[0])\n\n    for dr in [-1, 0, 1]:\n        for dc in [-1, 0, 1]:\n            if dr == 0 and dc == 0:\n                continue\n\n            nr = row + dr\n            nc = col + dc\n\n            if ____:\n                count += grid[nr][nc]\n\n    return count",
    answer: "0 <= nr < height and 0 <= nc < width",
    validationMessage: "The Oracle can now count whispers around a rune.",
    hints: [
      "The neighbor row and column must both be inside the board.",
      "Check row minimum, row maximum, column minimum, and column maximum.",
      "Use 0 <= nr < height and 0 <= nc < width."
    ],
    initialGrid: countGrid,
    selectedCell: { row: 2, col: 2 },
    unlocks: []
  }
];

function makePrologueGrid(): Grid {
  let grid = createEmptyGrid(20, 20);
  grid = placePattern(grid, getPattern("block").grid, 1, 4);
  grid = placePattern(grid, getPattern("beacon").grid, 3, 15);
  grid = placePattern(grid, getPattern("glider").grid, 7, 8);
  grid = placePattern(grid, getPattern("blinker").grid, 11, 4);
  grid = placePattern(grid, getPattern("glider").grid, 12, 14);
  grid = placePattern(grid, getPattern("block").grid, 15, 2);
  grid = placePattern(grid, getPattern("beacon").grid, 14, 16);
  return grid;
}

export const episodeCatalog: Episode[] = [
  {
    id: "living-grid",
    roman: "I",
    title: "The Living Grid",
    project: "Game of Life",
    status: "open",
    description: "Repair a cellular automaton and learn data, state, rules, and time.",
    teaches: ["lists", "conditions", "loops", "state updates"],
    stages: lifeStages
  },
  {
    id: "bouncing-duel",
    roman: "II",
    title: "The Bouncing Duel",
    project: "Pong",
    status: "planned",
    description: "Build motion, input, collisions, and a small arena loop.",
    teaches: ["velocity", "input", "collision", "game loop"],
    stages: []
  },
  {
    id: "tavern-door",
    roman: "III",
    title: "The Door Beneath the Tavern",
    project: "Tiny Text RPG",
    status: "planned",
    description: "Turn rooms, choices, inventory, and dialogue into data.",
    teaches: ["strings", "dictionaries", "state", "choices"],
    stages: []
  },
  {
    id: "one-room-dungeon",
    roman: "IV",
    title: "The One-Room Dungeon",
    project: "Simple Roguelike",
    status: "locked",
    description: "Mix grid maps, entities, collision, and turns.",
    teaches: ["tile maps", "movement", "collision", "turn order"],
    stages: []
  }
];
