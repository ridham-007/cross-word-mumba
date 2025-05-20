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
      styles += " bg-background border-border/50";
    } else if (isSelected) {
      styles += " bg-[#00e5e5]/10 border-[#00e5e5]";
    } else if (cell.isHighlighted) {
      styles += " bg-[#00e5e5]/5 border-[#00e5e5]/50";
    } else {
      styles += " bg-card/50 border-border hover:bg-[#00e5e5]/5";
    }
    
    // Cell validation
    if (checkedCells[cell.row][cell.col]) {
      if (cell.isCorrect) {
        styles += " border-emerald-500 bg-emerald-500/10";
      } else if (cell.isCorrect === false) {
        styles += " border-red-500 bg-red-500/10";
      }
    }
    
    return styles;
  };
  
  return (
    <div className="relative overflow-auto">
      <div 
        className="grid gap-px bg-border/10 rounded-lg p-2 backdrop-blur-sm"
        style={{ 
          gridTemplateRows: `repeat(${grid.length}, minmax(40px, 1fr))`,
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(40px, 1fr))`,
          maxWidth: `${grid[0].length * 48}px`,
          margin: '0 auto'
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
                  "aspect-square cursor-pointer rounded-sm"
                )}
                onClick={() => !cell.isBlack && onCellSelect(rowIndex, colIndex)}
              >
                {!cell.isBlack && (
                  <>
                    {cell.number && (
                      <span className="absolute text-[10px] top-0.5 left-0.5 text-muted-foreground">
                        {cell.number}
                      </span>
                    )}
                    <span className={cn(
                      "text-xl font-medium",
                      cell.isRevealed ? "text-purple-400" : "text-foreground",
                      isSelected && "animate-pulse"
                    )}>
                      {cell.userInput}
                    </span>
                    
                    {/* Selected direction indicator */}
                    {isSelected && (
                      <div className={cn(
                        "absolute h-1.5 w-1.5 bg-[#00e5e5] rounded-full",
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