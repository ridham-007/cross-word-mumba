"use client";

import { useState, useEffect } from "react";
import { Clue, Cell } from "@/types/crossword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight } from "lucide-react";

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

  useEffect(() => {
    if (!selectedCell || !grid.length) return;

    const { row, col } = selectedCell;

    if (selectedDirection === "across") {
      let startCol = col;
      while (startCol > 0 && !grid[row][startCol].isBlack && !grid[row][startCol - 1].isBlack) {
        startCol--;
      }

      const clue = clues.across.find(
        (clue) => clue.row === row && clue.col === startCol && clue.direction === "across"
      );
      if (clue) setActiveClue(clue);
    } else {
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
    <div className="h-full">
      <Tabs defaultValue="across" className="h-full flex flex-col">
        <TabsList className="w-full grid grid-cols-2 p-0 h-14 bg-transparent">
          <TabsTrigger
            value="across"
            className={cn(
              "data-[state=active]:bg-[#00e5e5]/10 data-[state=active]:text-[#00e5e5] rounded-none border-r h-full",
              selectedDirection === 'across' && "font-medium"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span className="font-semibold">Across</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {clues.across.length} clues
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="down"
            className={cn(
              "data-[state=active]:bg-[#00e5e5]/10 data-[state=active]:text-[#00e5e5] rounded-none h-full",
              selectedDirection === 'down' && "font-medium"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 rotate-90" />
                <span className="font-semibold">Down</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {clues.down.length} clues
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="across" className="p-0 m-0 flex-1">
          <ScrollArea className="h-[calc(100vh-20rem)] sm:h-[600px]">
            <div className="divide-y divide-border/50">
              {clues.across.map((clue) => (
                <button
                  key={`across-${clue.number}`}
                  className={cn(
                    "w-full p-4 text-left transition-all hover:bg-[#00e5e5]/5 relative group",
                    activeClue?.number === clue.number && activeClue?.direction === 'across'
                      ? "bg-[#00e5e5]/10 text-[#00e5e5]"
                      : "",
                    isClueComplete(clue)
                      ? "text-emerald-400"
                      : isClueStarted(clue)
                        ? "text-[#00e5e5]"
                        : "text-foreground"
                  )}
                  onClick={() => handleClueClick(clue)}
                >
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={isClueComplete(clue) ? "default" : "outline"}
                      className={cn(
                        "h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold shrink-0",
                        isClueComplete(clue) ? "bg-emerald-500" : "border-current"
                      )}
                    >
                      {clue.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{clue.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Brain className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-muted-foreground">
                          {clue.answer.length} letters
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="down" className="p-0 m-0 flex-1">
          <ScrollArea className="h-[calc(100vh-20rem)] sm:h-[600px]">
            <div className="divide-y divide-border/50">
              {clues.down.map((clue) => (
                <button
                  key={`down-${clue.number}`}
                  className={cn(
                    "w-full p-4 text-left transition-all hover:bg-[#00e5e5]/5 relative group",
                    activeClue?.number === clue.number && activeClue?.direction === clue.direction
                      ? "bg-[#00e5e5]/10 text-[#00e5e5]"
                      : "",
                    isClueComplete(clue)
                      ? "text-emerald-400"
                      : isClueStarted(clue)
                        ? "text-[#00e5e5]"
                        : "text-foreground"
                  )}
                  onClick={() => handleClueClick(clue)}
                >
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={isClueComplete(clue) ? "default" : "outline"}
                      className={cn(
                        "h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold shrink-0",
                        isClueComplete(clue) ? "bg-emerald-500" : "border-current"
                      )}
                    >
                      {clue.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{clue.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Brain className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-muted-foreground">
                          {clue.answer.length} letters
                        </p>
                      </div>
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