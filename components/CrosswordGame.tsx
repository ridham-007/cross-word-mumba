import { useState, useEffect, useCallback } from "react";
import { getPuzzleById } from "@/data/puzzleData";
import { Cell, Clue } from "@/types/crossword";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Eraser, Eye, Keyboard, Send, Clock } from "lucide-react";
import CrosswordGrid from "@/components/CrosswordGrid";
import CrosswordClues from "@/components/CrosswordClues";
import CrosswordKeyboard from "@/components/CrosswordKeyboard";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import { Card } from "./ui/card";

interface CrosswordGameProps {
  puzzleId: string;
  onSubmit: (correct: number, total: number, timeTaken: number) => void;
  onBack: () => void;
}

export default function CrosswordGame({ puzzleId, onSubmit, onBack }: CrosswordGameProps) {
  const puzzle = getPuzzleById(puzzleId);
  const { toast } = useToast();

  const [userProgress, setUserProgress] = useState<{
    userGrid: Cell[][];
    selectedCell: { row: number; col: number } | null;
    selectedDirection: 'across' | 'down';
    isCompleted: boolean;
    checkedCells: boolean[][];
  }>({
    userGrid: [],
    selectedCell: null,
    selectedDirection: 'across',
    isCompleted: false,
    checkedCells: []
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [totalCells, setTotalCells] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

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

    // Check if device is mobile
    const isMobile = window.innerWidth < 768;
    setIsKeyboardVisible(isMobile);
  }, [puzzle]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!userProgress.selectedCell) return;

      if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
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

  // Move to previous cell
  const moveToPreviousCell = useCallback(() => {
    if (!userProgress.selectedCell || !puzzle) return;

    const { row, col } = userProgress.selectedCell;
    const { userGrid, selectedDirection } = userProgress;

    let prevRow = row;
    let prevCol = col;

    if (selectedDirection === 'across') {
      prevCol = col - 1;
      while (prevCol >= 0 && userGrid[prevRow][prevCol].isBlack) {
        prevCol--;
      }

      if (prevCol < 0) {
        // Move to the previous row
        prevRow--;
        prevCol = userGrid[0].length - 1;

        while (prevRow >= 0) {
          while (prevCol >= 0) {
            if (!userGrid[prevRow][prevCol].isBlack) {
              break;
            }
            prevCol--;
          }

          if (prevCol >= 0) break;
          prevRow--;
          prevCol = userGrid[0].length - 1;
        }
      }
    } else {
      prevRow = row - 1;
      while (prevRow >= 0 && userGrid[prevRow][prevCol].isBlack) {
        prevRow--;
      }

      if (prevRow < 0) {
        // Move to the previous column
        prevCol--;
        prevRow = userGrid.length - 1;

        while (prevCol >= 0) {
          while (prevRow >= 0) {
            if (!userGrid[prevRow][prevCol].isBlack) {
              break;
            }
            prevRow--;
          }

          if (prevRow >= 0) break;
          prevCol--;
          prevRow = userGrid.length - 1;
        }
      }
    }

    if (prevRow >= 0 && prevCol >= 0) {
      setUserProgress(prev => ({
        ...prev,
        selectedCell: { row: prevRow, col: prevCol }
      }));
    }
  }, [userProgress, puzzle]);

  // Handle backspace
  const handleBackspace = () => {
    if (!userProgress.selectedCell) return;

    const { row, col } = userProgress.selectedCell;
    const newGrid = [...userProgress.userGrid];

    // If current cell has input, clear it
    if (newGrid[row][col].userInput) {
      newGrid[row][col].userInput = '';
      setUserProgress({
        ...userProgress,
        userGrid: newGrid
      });
    } else {
      // If current cell is empty, move to previous cell
      moveToPreviousCell();
    }
  };

  // Find the starting cell of a word
  const findWordStart = (row: number, col: number, direction: 'across' | 'down'): { row: number; col: number } => {
    if (!puzzle) return { row, col };

    const { userGrid } = userProgress;

    if (direction === 'across') {
      let startCol = col;
      while (startCol > 0 && !userGrid[row][startCol - 1].isBlack) {
        startCol--;
      }
      return { row, col: startCol };
    } else {
      let startRow = row;
      while (startRow > 0 && !userGrid[startRow - 1][col].isBlack) {
        startRow--;
      }
      return { row: startRow, col };
    }
  };

  // Handle cell selection
  const handleCellSelect = (row: number, col: number, overrideDirection?: 'across' | 'down') => {
    if (!puzzle) return;

    const { userGrid, selectedCell, selectedDirection } = userProgress;

    const direction = overrideDirection ?? selectedDirection;

    if (userGrid[row][col].isBlack) return;

    let newDirection = direction;

    if (selectedCell?.row === row && selectedCell?.col === col) {
      newDirection = direction === 'across' ? 'down' : 'across';
    }

    // Find the word boundaries and highlight cells
    const newGrid = JSON.parse(JSON.stringify(userGrid));

    // Clear previous highlights
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid[i].length; j++) {
        newGrid[i][j].isHighlighted = false;
      }
    }

    // Find the start of the word
    const wordStart = findWordStart(row, col, newDirection);

    // Highlight the word
    if (newDirection === 'across') {
      let currentCol = wordStart.col;
      while (currentCol < newGrid[row].length && !newGrid[row][currentCol].isBlack) {
        newGrid[row][currentCol].isHighlighted = true;
        currentCol++;
      }
    } else {
      let currentRow = wordStart.row;
      while (currentRow < newGrid.length && !newGrid[currentRow][col].isBlack) {
        newGrid[currentRow][col].isHighlighted = true;
        currentRow++;
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

    onSubmit(correct, totalCells, elapsedTime);
  };

  // Handle clue selection
  const handleClueSelect = (clue: Clue) => {
    if (!puzzle) return;

    handleCellSelect(clue.row, clue.col, clue.direction);
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          size="icon"
          className="rounded-full border-[#00e5e5] hover:bg-[#00e5e5]/10"
        >
          <ArrowLeft className="h-4 w-4 text-[#00e5e5]" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#00e5e5]">{puzzle.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-[#00e5e5] hover:bg-[#00e5e5]/10"
          onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
        >
          <Keyboard className="h-4 w-4 text-[#00e5e5]" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6 border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative">
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
                className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500"
                onClick={handleCheck}
              >
                <Check className="h-4 w-4" />
                Check
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500"
                onClick={handleReveal}
              >
                <Eye className="h-4 w-4" />
                Reveal All
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500"
                onClick={handleClear}
              >
                <Eraser className="h-4 w-4" />
                Clear
              </Button>
              <Button
                className="bg-[#00e5e5] hover:bg-[#00e5e5]/90 flex items-center gap-2"
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
                Submit
              </Button>
            </div>

            {isKeyboardVisible && (
              <div className="mt-6">
                <CrosswordKeyboard onKeyPress={handleInput} onBackspace={handleBackspace} />
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-1 border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CrosswordClues
            clues={puzzle.clues}
            selectedCell={userProgress.selectedCell}
            selectedDirection={userProgress.selectedDirection}
            grid={userProgress.userGrid}
            onClueSelect={handleClueSelect}
          />
        </Card>
      </div>
    </div>
  );
}