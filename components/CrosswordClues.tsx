"use client";

import { useState, useEffect } from "react";
import { Clue, Cell } from "@/types/crossword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    const cell = grid[row][col];
    
    if (cell.isBlack) return;
    
    let clueNumber = 0;
    
    // Find the starting cell of the word
    if (selectedDirection === 'across') {
      // Find the leftmost cell of the word
      let startCol = col;
      while (startCol > 0 && !grid[row][startCol - 1].isBlack) {
        startCol--;
      }
      
      clueNumber = grid[row][startCol].number || 0;
      
      const matchingClue = clues.across.find(c => c.number === clueNumber);
      if (matchingClue) {
        setActiveClue(matchingClue);
      }
    } else {
      // Find the topmost cell of the word
      let startRow = row;
      while (startRow > 0 && !grid[startRow - 1][col].isBlack) {
        startRow--;
      }
      
      clueNumber = grid[startRow][col].number || 0;
      
      const matchingClue = clues.down.find(c => c.number === clueNumber);
      if (matchingClue) {
        setActiveClue(matchingClue);
      }
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
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
      <Tabs defaultValue="across" className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-gray-900/50">
          <TabsTrigger 
            value="across"
            className={cn(
              "text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400",
              selectedDirection === 'across' && "font-medium"
            )}
          >
            Across
          </TabsTrigger>
          <TabsTrigger 
            value="down"
            className={cn(
              "text-sm data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400",
              selectedDirection === 'down' && "font-medium"
            )}
          >
            Down
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="across" className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            <ul className="divide-y divide-gray-700/50">
              {clues.across.map((clue) => (
                <li 
                  key={`across-${clue.number}`}
                  className={cn(
                    "p-3 cursor-pointer transition-colors hover:bg-gray-700/30",
                    activeClue && activeClue.number === clue.number && activeClue.direction === 'across' 
                      ? "bg-blue-500/10" 
                      : "",
                    isClueComplete(clue) 
                      ? "text-green-400" 
                      : isClueStarted(clue) 
                        ? "text-blue-300" 
                        : "text-gray-400"
                  )}
                  onClick={() => onClueSelect(clue)}
                >
                  <span className="font-medium mr-2">{clue.number}.</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="down" className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            <ul className="divide-y divide-gray-700/50">
              {clues.down.map((clue) => (
                <li 
                  key={`down-${clue.number}`}
                  className={cn(
                    "p-3 cursor-pointer transition-colors hover:bg-gray-700/30",
                    activeClue && activeClue.number === clue.number && activeClue.direction === 'down' 
                      ? "bg-blue-500/10" 
                      : "",
                    isClueComplete(clue) 
                      ? "text-green-400" 
                      : isClueStarted(clue) 
                        ? "text-blue-300" 
                        : "text-gray-400"
                  )}
                  onClick={() => onClueSelect(clue)}
                >
                  <span className="font-medium mr-2">{clue.number}.</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}