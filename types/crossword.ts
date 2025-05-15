export interface CrosswordPuzzle {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  grid: Cell[][];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

export interface Cell {
  row: number;
  col: number;
  answer: string;
  isBlack: boolean;
  number?: number;
  isRevealed: boolean;
  userInput: string;
  isCorrect?: boolean;
  isHighlighted: boolean;
}

export interface Clue {
  number: number;
  text: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

export interface GameResults {
  correct: number;
  total: number;
  timeTaken: number;
}

export interface UserProgress {
  userGrid: Cell[][];
  selectedCell: { row: number; col: number } | null;
  selectedDirection: 'across' | 'down';
  isCompleted: boolean;
  checkedCells: boolean[][];
}