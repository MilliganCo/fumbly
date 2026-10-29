export type Cell = 0 | 1;
export type Grid = Cell[][];

export type RuleSet = {
  birth: Set<number>;
  survival: Set<number>;
  wrap?: boolean;
};

export const LIFE_RULES: RuleSet = {
  birth: new Set([3]),
  survival: new Set([2, 3]),
  wrap: false
};

export function createEmptyGrid(width: number, height: number): Grid {
  return Array.from({ length: height }, () => Array<Cell>(width).fill(0));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.slice() as Cell[]);
}

export function countNeighbors(
  grid: Grid,
  row: number,
  col: number,
  rules: Pick<RuleSet, "wrap"> = LIFE_RULES
): number {
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  let count = 0;

  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) {
        continue;
      }

      let nr = row + dr;
      let nc = col + dc;

      if (rules.wrap && height > 0 && width > 0) {
        nr = (nr + height) % height;
        nc = (nc + width) % width;
        count += grid[nr][nc];
        continue;
      }

      if (0 <= nr && nr < height && 0 <= nc && nc < width) {
        count += grid[nr][nc];
      }
    }
  }

  return count;
}

export function nextCellState(
  current: Cell,
  neighbors: number,
  rules: RuleSet = LIFE_RULES
): Cell {
  if (current === 1) {
    return rules.survival.has(neighbors) ? 1 : 0;
  }

  return rules.birth.has(neighbors) ? 1 : 0;
}

export function nextGeneration(grid: Grid, rules: RuleSet = LIFE_RULES): Grid {
  return grid.map((row, rowIndex) =>
    row.map((current, colIndex) =>
      nextCellState(current, countNeighbors(grid, rowIndex, colIndex, rules), rules)
    )
  );
}

export function placePattern(
  grid: Grid,
  pattern: Grid,
  startRow: number,
  startCol: number
): Grid {
  const next = cloneGrid(grid);

  pattern.forEach((row, rowOffset) => {
    row.forEach((cell, colOffset) => {
      const targetRow = startRow + rowOffset;
      const targetCol = startCol + colOffset;

      if (
        0 <= targetRow &&
        targetRow < next.length &&
        0 <= targetCol &&
        targetCol < (next[0]?.length ?? 0)
      ) {
        next[targetRow][targetCol] = cell;
      }
    });
  });

  return next;
}

export function parsePattern(source: string): Grid {
  return source
    .trim()
    .split(/\r?\n/)
    .map((line) =>
      Array.from(line.trim()).map<Cell>((char) =>
        char === "O" || char === "1" || char === "#" || char === "█" ? 1 : 0
      )
    );
}

export function population(grid: Grid): number {
  return grid.reduce(
    (total, row) =>
      total + row.reduce<number>((rowTotal, cell) => rowTotal + cell, 0),
    0
  );
}

export function diffGeneration(current: Grid, rules: RuleSet = LIFE_RULES): Grid {
  const next = nextGeneration(current, rules);

  return current.map((row, rowIndex) =>
    row.map((cell, colIndex) => (cell === next[rowIndex][colIndex] ? 0 : 1))
  );
}
