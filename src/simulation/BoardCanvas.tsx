import { useEffect, useRef } from "react";
import type { Grid } from "./grid";

type BoardCanvasProps = {
  grid: Grid;
  selectedCell?: { row: number; col: number };
  hoveredCell?: { row: number; col: number };
  onToggleCell: (row: number, col: number) => void;
  onHoverCell: (cell?: { row: number; col: number }) => void;
};

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 430;

export function BoardCanvas({
  grid,
  selectedCell,
  hoveredCell,
  onToggleCell,
  onHoverCell
}: BoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * ratio;
    canvas.height = CANVAS_HEIGHT * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    drawBoard(context, grid, selectedCell, hoveredCell);
  }, [grid, selectedCell, hoveredCell]);

  function getCellFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const rowCount = grid.length;
    const colCount = grid[0]?.length ?? 0;
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * colCount);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * rowCount);

    if (row < 0 || row >= rowCount || col < 0 || col >= colCount) {
      return undefined;
    }

    return { row, col };
  }

  return (
    <canvas
      ref={canvasRef}
      className="board-canvas"
      aria-label="Game of Life board"
      onPointerDown={(event) => {
        const cell = getCellFromEvent(event);
        if (cell) onToggleCell(cell.row, cell.col);
      }}
      onPointerMove={(event) => onHoverCell(getCellFromEvent(event))}
      onPointerLeave={() => onHoverCell(undefined)}
    />
  );
}

function drawBoard(
  context: CanvasRenderingContext2D,
  grid: Grid,
  selectedCell?: { row: number; col: number },
  hoveredCell?: { row: number; col: number }
) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const cellWidth = CANVAS_WIDTH / cols;
  const cellHeight = CANVAS_HEIGHT / rows;

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#050d0d";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      const centerX = x + cellWidth / 2;
      const centerY = y + cellHeight / 2;
      const isSelected = selectedCell?.row === row && selectedCell.col === col;
      const isHovered = hoveredCell?.row === row && hoveredCell.col === col;
      const isNeighbor =
        selectedCell &&
        Math.abs(selectedCell.row - row) <= 1 &&
        Math.abs(selectedCell.col - col) <= 1 &&
        !(selectedCell.row === row && selectedCell.col === col);

      context.fillStyle = "rgba(217, 174, 88, 0.62)";
      context.fillRect(centerX - 1.2, centerY - 1.2, 2.4, 2.4);

      if (isNeighbor) {
        context.fillStyle = "rgba(217, 174, 88, 0.1)";
        context.fillRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
      }

      if (grid[row][col] === 1) {
        const runeSize = Math.max(10, Math.min(cellWidth, cellHeight) * 0.44);
        const runeX = centerX - runeSize / 2;
        const runeY = centerY - runeSize / 2;
        context.shadowColor = "rgba(168, 217, 90, 0.6)";
        context.shadowBlur = 9;
        context.fillStyle = "#95c84d";
        context.fillRect(runeX, runeY, runeSize, runeSize);
        context.shadowBlur = 0;
        context.fillStyle = "#050d0d";
        context.fillRect(runeX + runeSize * 0.24, runeY + runeSize * 0.24, runeSize * 0.52, runeSize * 0.52);
        context.strokeStyle = "#b9ef62";
        context.lineWidth = 1.4;
        context.strokeRect(runeX + 1, runeY + 1, runeSize - 2, runeSize - 2);
        context.shadowBlur = 0;
      }

      if (isSelected || isHovered) {
        context.strokeStyle = "#f4e6b5";
        context.lineWidth = 2;
        context.strokeRect(x + 4, y + 4, cellWidth - 8, cellHeight - 8);
      }
    }
  }
}
