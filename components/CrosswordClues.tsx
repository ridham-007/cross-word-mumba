"use client";

import { useState, useEffect } from "react";
import { Clue, Cell } from "@/types/crossword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface CrosswordCluesProps {
  clues: {
    across: Clue[];
    down: Clue[];
  };
  selectedCell: { row: number; col: number } | null;
  selectedDirection: 'across' | 'down';
  grid: Cell[][];
  onClueSelect: (clue: Clue) => void;
}

export default function CrosswordClues({
  clues,
  selectedCell,
  selectedDirection,
  grid,
  onClueSelect
}: CrosswordCluesProps) {
  const [activeClue, setActiveClue] = useState<Clue | null>(null);

  // Update active clue when selected cell changes
  useEffect(() => {
  if (!selectedCell || !grid.length) return;

  const { row, col } = selectedCell;

  if (selectedDirection === "across") {
    // Go left to find the start of the word
    let startCol = col;
    while (startCol > 0 && !grid[row][startCol].isBlack && !grid[row][startCol - 1].isBlack) {
      startCol--;
    }

    const clue = clues.across.find(
      (clue) => clue.row === row && clue.col === startCol && clue.direction === "across"
    );
    if (clue) setActiveClue(clue);
  } else {
    // Go up to find the start of the word
    let startRow = row;
    while (startRow > 0 && !grid[startRow][col].isBlack && !grid[startRow - 1][col].isBlack) {
      startRow--;
    }

    const clue = clues.down.find(
      (clue) => clue.row === startRow && clue.col === col && clue.direction === "down"
    );
    if (clue) setActiveClue(clue);
  }
}, [selectedCell, selectedDirection, grid, clues]);


  // Check if a word is complete
  const isClueComplete = (clue: Clue) => {
    if (!grid.length) return false;

    let complete = true;

    if (clue.direction === 'across') {
      let col = clue.col;
      while (col < grid[0].length && !grid[clue.row][col].isBlack) {
        if (!grid[clue.row][col].userInput) {
          complete = false;
          break;
        }
        col++;
      }
    } else {
      let row = clue.row;
      while (row < grid.length && !grid[row][clue.col].isBlack) {
        if (!grid[row][clue.col].userInput) {
          complete = false;
          break;
        }
        row++;
      }
    }

    return complete;
  };

  // Check if a clue has any letters filled
  const isClueStarted = (clue: Clue) => {
    if (!grid.length) return false;

    let started = false;

    if (clue.direction === 'across') {
      let col = clue.col;
      while (col < grid[0].length && !grid[clue.row][col].isBlack) {
        if (grid[clue.row][col].userInput) {
          started = true;
          break;
        }
        col++;
      }
    } else {
      let row = clue.row;
      while (row < grid.length && !grid[row][clue.col].isBlack) {
        if (grid[row][clue.col].userInput) {
          started = true;
          break;
        }
        row++;
      }
    }

    return started;
  };

  const handleClueClick = (clue: Clue) => {
    onClueSelect(clue);
    setActiveClue(clue);
  };

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Tabs defaultValue="across" className="w-full">
        <TabsList className="w-full grid grid-cols-2 p-0 h-12">
          <TabsTrigger
            value="across"
            className={cn(
              "text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-none border-r",
              selectedDirection === 'across' && "font-medium"
            )}
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold">Across</span>
              <span className="text-xs text-muted-foreground">
                {clues.across.length} clues
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="down"
            className={cn(
              "text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 rounded-none",
              selectedDirection === 'down' && "font-medium"
            )}
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold">Down</span>
              <span className="text-xs text-muted-foreground">
                {clues.down.length} clues
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="across" className="p-0 m-0">
          <ScrollArea className="h-[400px] sm:h-[600px]">
            <div className="divide-y divide-border">
              {clues.across.map((clue) => (
                <button
                  key={`across-${clue.number}`}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-muted/50 relative",
                    activeClue?.number === clue.number && activeClue?.direction === 'across'
                      ? "bg-blue-500/10 text-blue-400"
                      : "",
                    isClueComplete(clue)
                      ? "text-green-400"
                      : isClueStarted(clue)
                        ? "text-blue-300"
                        : "text-foreground"
                  )}
                  onClick={() => handleClueClick(clue)}
                >
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={isClueComplete(clue) ? "default" : "outline"}
                      className={cn(
                        "h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                        isClueComplete(clue) ? "bg-green-500" : ""
                      )}
                    >
                      {clue.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{clue.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {clue.answer.length} letters
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="down" className="p-0 m-0">
          <ScrollArea className="h-[400px] sm:h-[600px]">
            <div className="divide-y divide-border">
              {clues.down.map((clue) => (
                <button
                  key={`down-${clue.number}`}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-muted/50 relative",
                     activeClue?.number === clue.number && activeClue?.direction === clue.direction
                      ? "bg-blue-500/10 text-blue-400"
                      : "",
                    isClueComplete(clue)
                      ? "text-green-400"
                      : isClueStarted(clue)
                        ? "text-blue-300"
                        : "text-foreground"
                  )}
                  onClick={() => handleClueClick(clue)}
                >
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={isClueComplete(clue) ? "default" : "outline"}
                      className={cn(
                        "h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                        isClueComplete(clue) ? "bg-green-500" : ""
                      )}
                    >
                      {clue.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{clue.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {clue.answer.length} letters
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}