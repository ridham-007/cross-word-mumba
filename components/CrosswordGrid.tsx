"use client";

import { Cell } from "@/types/crossword";
import { cn } from "@/lib/utils";

interface CrosswordGridProps {
  grid: Cell[][];
  selectedCell: { row: number; col: number } | null;
  selectedDirection: 'across' | 'down';
  checkedCells: boolean[][];
  onCellSelect: (row: number, col: number) => void;
}

export default function CrosswordGrid({ 
  grid, 
  selectedCell, 
  selectedDirection,
  checkedCells,
  onCellSelect 
}: CrosswordGridProps) {
  if (!grid.length) return null;
  
  const getCellStyle = (cell: Cell, isSelected: boolean) => {
    // Base style
    let styles = "border relative flex items-center justify-center text-center transition-all duration-200";
    
    // Cell coloring
    if (cell.isBlack) {
      styles += " bg-gray-900 border-gray-800";
    } else if (isSelected) {
      styles += " bg-blue-500/20 border-blue-500";
    } else if (cell.isHighlighted) {
      styles += " bg-blue-500/10 border-blue-400/50";
    } else {
      styles += " bg-gray-800/50 border-gray-700 hover:bg-gray-800/70";
    }
    
    // Cell validation
    if (checkedCells[cell.row][cell.col]) {
      if (cell.isCorrect) {
        styles += " border-green-500 bg-green-500/10";
      } else if (cell.isCorrect === false) {
        styles += " border-red-500 bg-red-500/10";
      }
    }
    
    return styles;
  };
  
  return (
    <div className="relative overflow-auto">
      <div 
        className="grid"
        style={{ 
          gridTemplateRows: `repeat(${grid.length}, minmax(40px, 1fr))`,
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(40px, 1fr))`,
          maxWidth: `${grid[0].length * 48}px`,
          margin: '0 auto',
          gap: '1px',
          background: 'hsl(var(--border))'
        }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  getCellStyle(cell, isSelected),
                  "aspect-square cursor-pointer"
                )}
                onClick={() => !cell.isBlack && onCellSelect(rowIndex, colIndex)}
              >
                {!cell.isBlack && (
                  <>
                    {cell.number && (
                      <span className="absolute text-[10px] top-0.5 left-0.5 text-gray-400">
                        {cell.number}
                      </span>
                    )}
                    <span className={cn(
                      "text-xl font-medium",
                      cell.isRevealed ? "text-purple-400" : "text-white",
                      isSelected && "animate-pulse"
                    )}>
                      {cell.userInput}
                    </span>
                    
                    {/* Selected direction indicator */}
                    {isSelected && (
                      <div className={cn(
                        "absolute h-1.5 w-1.5 bg-blue-500 rounded-full",
                        selectedDirection === 'across' ? "top-1.5 right-1.5" : "bottom-1.5 right-1.5"
                      )} />
                    )}
                  </>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}