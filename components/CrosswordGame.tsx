"use client";

import { useState, useEffect, useCallback } from "react";
import { getPuzzleById } from "@/data/puzzleData";
import { Cell, Clue, UserProgress } from "@/types/crossword";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Eraser, Eye, Send } from "lucide-react";
import CrosswordGrid from "@/components/CrosswordGrid";
import CrosswordClues from "@/components/CrosswordClues";
import CrosswordKeyboard from "@/components/CrosswordKeyboard";
import { useToast } from "@/hooks/use-toast";

interface CrosswordGameProps {
  puzzleId: string;
  onSubmit: (correct: number, total: number) => void;
  onBack: () => void;
}

export default function CrosswordGame({ puzzleId, onSubmit, onBack }: CrosswordGameProps) {
  const puzzle = getPuzzleById(puzzleId);
  const { toast } = useToast();
  
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userGrid: [],
    selectedCell: null,
    selectedDirection: 'across',
    isCompleted: false,
    checkedCells: []
  });
  
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [totalCells, setTotalCells] = useState(0);
  
  // Initialize the grid
  useEffect(() => {
    if (!puzzle) return;
    
    const initialGrid = JSON.parse(JSON.stringify(puzzle.grid));
    const initialCheckedCells = Array(puzzle.grid.length).fill(null)
      .map(() => Array(puzzle.grid[0].length).fill(false));
    
    let count = 0;
    for (let i = 0; i < initialGrid.length; i++) {
      for (let j = 0; j < initialGrid[i].length; j++) {
        if (!initialGrid[i][j].isBlack) {
          count++;
        }
      }
    }
    
    setTotalCells(count);
    setUserProgress({
      userGrid: initialGrid,
      selectedCell: null,
      selectedDirection: 'across',
      isCompleted: false,
      checkedCells: initialCheckedCells
    });
  }, [puzzle]);
  
  // Handle device check for keyboard visibility
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsKeyboardVisible(isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!userProgress.selectedCell) return;

      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleInput('');
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        moveToNextCell();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userProgress.selectedCell]);
  
  // Navigate to next cell
  const moveToNextCell = useCallback(() => {
    if (!userProgress.selectedCell || !puzzle) return;
    
    const { row, col } = userProgress.selectedCell;
    const { userGrid, selectedDirection } = userProgress;
    
    let nextRow = row;
    let nextCol = col;
    
    if (selectedDirection === 'across') {
      nextCol = col + 1;
      while (nextCol < userGrid[0].length && userGrid[nextRow][nextCol].isBlack) {
        nextCol++;
      }
      
      if (nextCol >= userGrid[0].length) {
        // Move to the next row
        nextRow++;
        nextCol = 0;
        
        while (nextRow < userGrid.length) {
          while (nextCol < userGrid[0].length) {
            if (!userGrid[nextRow][nextCol].isBlack) {
              break;
            }
            nextCol++;
          }
          
          if (nextCol < userGrid[0].length) break;
          nextRow++;
          nextCol = 0;
        }
      }
    } else {
      nextRow = row + 1;
      while (nextRow < userGrid.length && userGrid[nextRow][nextCol].isBlack) {
        nextRow++;
      }
      
      if (nextRow >= userGrid.length) {
        // Move to the next column
        nextCol++;
        nextRow = 0;
        
        while (nextCol < userGrid[0].length) {
          while (nextRow < userGrid.length) {
            if (!userGrid[nextRow][nextCol].isBlack) {
              break;
            }
            nextRow++;
          }
          
          if (nextRow < userGrid.length) break;
          nextCol++;
          nextRow = 0;
        }
      }
    }
    
    if (nextRow < userGrid.length && nextCol < userGrid[0].length) {
      setUserProgress(prev => ({
        ...prev,
        selectedCell: { row: nextRow, col: nextCol }
      }));
    }
  }, [userProgress, puzzle]);
  
  // Handle cell selection
  const handleCellSelect = (row: number, col: number) => {
    if (!puzzle) return;
    
    const { userGrid, selectedCell, selectedDirection } = userProgress;
    
    if (userGrid[row][col].isBlack) return;
    
    let newDirection = selectedDirection;
    
    // Toggle direction if selecting the same cell
    if (selectedCell?.row === row && selectedCell?.col === col) {
      newDirection = selectedDirection === 'across' ? 'down' : 'across';
    }
    
    // Update the grid highlighting
    const newGrid = [...userGrid];
    
    // Clear previous highlights
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j].isHighlighted = false;
      }
    }
    
    // Highlight the word
    if (newDirection === 'across') {
      // Highlight the row
      let startCol = col;
      while (startCol > 0 && !newGrid[row][startCol - 1].isBlack) {
        startCol--;
      }
      
      let endCol = col;
      while (endCol < newGrid[0].length - 1 && !newGrid[row][endCol + 1].isBlack) {
        endCol++;
      }
      
      for (let j = startCol; j <= endCol; j++) {
        newGrid[row][j].isHighlighted = true;
      }
    } else {
      // Highlight the column
      let startRow = row;
      while (startRow > 0 && !newGrid[startRow - 1][col].isBlack) {
        startRow--;
      }
      
      let endRow = row;
      while (endRow < newGrid.length - 1 && !newGrid[endRow + 1][col].isBlack) {
        endRow++;
      }
      
      for (let i = startRow; i <= endRow; i++) {
        newGrid[i][col].isHighlighted = true;
      }
    }
    
    setUserProgress({
      ...userProgress,
      userGrid: newGrid,
      selectedCell: { row, col },
      selectedDirection: newDirection
    });
  };
  
  // Handle input
  const handleInput = (value: string) => {
    if (!userProgress.selectedCell || !puzzle) return;
    
    const { row, col } = userProgress.selectedCell;
    const newGrid = [...userProgress.userGrid];
    
    // Update the cell
    newGrid[row][col].userInput = value.toUpperCase();
    
    setUserProgress({
      ...userProgress,
      userGrid: newGrid
    });
    
    // Move to next cell if a letter was entered
    if (value !== '') {
      moveToNextCell();
    }
  };
  
  // Check answers
  const handleCheck = () => {
    if (!puzzle) return;
    
    const { userGrid } = userProgress;
    const newGrid = [...userGrid];
    const newCheckedCells = [...userProgress.checkedCells];
    
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (!newGrid[i][j].isBlack && newGrid[i][j].userInput) {
          newGrid[i][j].isCorrect = newGrid[i][j].userInput === newGrid[i][j].answer;
          newCheckedCells[i][j] = true;
        }
      }
    }
    
    setUserProgress({
      ...userProgress,
      userGrid: newGrid,
      checkedCells: newCheckedCells
    });
    
    toast({
      title: "Answers Checked",
      description: "Correct answers are highlighted in green, incorrect in red."
    });
  };
  
  // Reveal all answers
  const handleReveal = () => {
    if (!puzzle) return;
    
    const { userGrid } = userProgress;
    const newGrid = [...userGrid];
    
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (!newGrid[i][j].isBlack) {
          newGrid[i][j].userInput = newGrid[i][j].answer;
          newGrid[i][j].isRevealed = true;
          newGrid[i][j].isCorrect = true;
        }
      }
    }
    
    setUserProgress({
      ...userProgress,
      userGrid: newGrid,
      isCompleted: true
    });
    
    toast({
      title: "All Answers Revealed",
      description: "The complete solution has been revealed.",
      variant: "destructive"
    });
  };
  
  // Clear the grid
  const handleClear = () => {
    if (!puzzle) return;
    
    const newGrid = [...userProgress.userGrid];
    const newCheckedCells = Array(puzzle.grid.length).fill(null)
      .map(() => Array(puzzle.grid[0].length).fill(false));
    
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        if (!newGrid[i][j].isBlack) {
          newGrid[i][j].userInput = "";
          newGrid[i][j].isRevealed = false;
          newGrid[i][j].isCorrect = undefined;
        }
      }
    }
    
    setUserProgress({
      ...userProgress,
      userGrid: newGrid,
      checkedCells: newCheckedCells
    });
    
    toast({
      title: "Grid Cleared",
      description: "All your answers have been cleared."
    });
  };
  
  // Submit the puzzle
  const handleSubmit = () => {
    if (!puzzle) return;
    
    const { userGrid } = userProgress;
    let correct = 0;
    let filled = 0;
    
    for (let i = 0; i < userGrid.length; i++) {
      for (let j = 0; j < userGrid[i].length; j++) {
        if (!userGrid[i][j].isBlack) {
          if (userGrid[i][j].userInput) {
            filled++;
            if (userGrid[i][j].userInput === userGrid[i][j].answer) {
              correct++;
            }
          }
        }
      }
    }
    
    if (filled < totalCells) {
      toast({
        title: "Incomplete Puzzle",
        description: `You've filled ${filled} out of ${totalCells} cells. Continue solving or reveal answers to complete.`,
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(correct, totalCells);
  };
  
  // Handle clue selection
  const handleClueSelect = (clue: Clue) => {
    if (!puzzle) return;
    
    handleCellSelect(clue.row, clue.col);
    setUserProgress(prev => ({
      ...prev,
      selectedDirection: clue.direction
    }));
  };
  
  if (!puzzle) {
    return (
      <div className="text-center">
        <p>Puzzle not found</p>
        <Button onClick={onBack}>Back to Puzzles</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{puzzle.title}</h1>
        <div className="w-9"></div> {/* Placeholder for symmetry */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CrosswordGrid 
            grid={userProgress.userGrid}
            selectedCell={userProgress.selectedCell}
            selectedDirection={userProgress.selectedDirection}
            checkedCells={userProgress.checkedCells}
            onCellSelect={handleCellSelect}
          />
          
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
              onClick={handleCheck}
            >
              <Check className="h-4 w-4" />
              Check
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500"
              onClick={handleReveal}
            >
              <Eye className="h-4 w-4" />
              Reveal All
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500"
              onClick={handleClear}
            >
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
          
          {isKeyboardVisible && (
            <div className="mt-4">
              <CrosswordKeyboard onKeyPress={handleInput} />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <CrosswordClues 
            clues={puzzle.clues} 
            selectedCell={userProgress.selectedCell}
            selectedDirection={userProgress.selectedDirection}
            grid={userProgress.userGrid}
            onClueSelect={handleClueSelect}
          />
        </div>
      </div>
    </div>
  );
}