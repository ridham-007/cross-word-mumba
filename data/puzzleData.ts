"use client";

import { CrosswordPuzzle } from "@/types/crossword";
import clg from "crossword-layout-generator";

type Orientation = "across" | "down";

interface ClueInput {
  clue: string;
  answer: string;
  startx: number;
  starty: number;
  orientation: Orientation;
  position: number;
}

interface ClueFormatted {
  number: number;
  text: string;
  answer: string;
  row: number;
  col: number;
  direction: Orientation;
}

interface CluesOutput {
  across: ClueFormatted[];
  down: ClueFormatted[];
}

function convertToCluesObject(clueArray: ClueInput[]): CluesOutput {
  const clues: CluesOutput = {
    across: [],
    down: []
  };

  clueArray.forEach((item) => {
    const formatted: ClueFormatted = {
      number: item.position,
      text: item.clue,
      answer: item.answer,
      row: item.starty - 1,
      col: item.startx - 1,
      direction: item.orientation
    };

    if (item.orientation === "across") {
      clues.across.push(formatted);
    } else if (item.orientation === "down") {
      clues.down.push(formatted);
    }
  });

  return clues;
}

const defaultPuzzles = [
  {
    id: "animals",
    title: "Animal Kingdom",
    difficulty: "easy",
    description: "A fun crossword about animals from around the world.",
    clues: [
      { clue: "Domestic feline pet", answer: "CAT" },
      { clue: "Man's best friend", answer: "DOG" },
      { clue: "Howls at the moon", answer: "WOLF" },
      { clue: "Large omnivore that hibernates", answer: "BEAR" },
      { clue: "Striped big cat", answer: "TIGER" },
      { clue: "Produces milk for humans", answer: "COW" },
      { clue: "Long-necked African animal", answer: "GIRAFFE" },
    ],
  },
  {
    id: "fruits",
    title: "Fruity Delights",
    difficulty: "medium",
    description: "Test your knowledge of various fruits from around the world.",
    clues: [
      { clue: "Red or green fruit, keeps the doctor away", answer: "APPLE" },
      { clue: "Yellow curved fruit", answer: "BANANA" },
      { clue: "Small round fruit that grows in clusters", answer: "GRAPE" },
      { clue: "Citrus fruit with the same name as a color", answer: "ORANGE" },
      { clue: "Soft fuzzy fruit with a large pit", answer: "PEACH" },
      { clue: "Tropical spiky fruit", answer: "PINEAPPLE" },
      { clue: "Green tropical fruit with a creamy texture", answer: "KIWI" },
    ],
  },
  {
    id: "countries",
    title: "World Countries",
    difficulty: "hard",
    description: "Challenge yourself with this crossword about countries around the world.",
    clues: [
      { clue: "Island nation known for sushi and anime", answer: "JAPAN" },
      { clue: "Largest country in South America", answer: "BRAZIL" },
      { clue: "Home to the Pyramids and Sphinx", answer: "EGYPT" },
      { clue: "European country known for wine and fashion", answer: "FRANCE" },
      { clue: "Largest country by area", answer: "RUSSIA" },
      { clue: "Known for Taj Mahal and Bollywood", answer: "INDIA" },
      { clue: "Nordic country with fjords", answer: "ITALY" },
    ],
  },
  {
    id: "technology",
    title: "Tech World",
    difficulty: "medium",
    description: "A crossword about technology, computers, and gadgets.",
    clues: [
      { clue: "Portable computer", answer: "LAPTOP" },
      { clue: "Pointing device for computers", answer: "MOUSE" },
      { clue: "Computer that provides data to other computers", answer: "SERVER" },
      { clue: "Portable touchscreen device", answer: "TABLET" },
      { clue: "Output device for visual display", answer: "MONITOR" },
      { clue: "Central processing unit", answer: "CPU" },
      { clue: "Device used to print documents", answer: "PRINTER" },
    ],
  },
];

function loadPuzzlesFromStorage(): CrosswordPuzzle[] {
  if (typeof window === 'undefined') {
    return generatePuzzles(defaultPuzzles);
  }

  const storedPuzzles = localStorage.getItem('crosswordPuzzles');
  if (!storedPuzzles) {
    const generatedPuzzles = generatePuzzles(defaultPuzzles);
    localStorage.setItem('crosswordPuzzles', JSON.stringify(generatedPuzzles));
    return generatedPuzzles;
  }

  return JSON.parse(storedPuzzles);
}

function generatePuzzles(puzzleData: any[]): CrosswordPuzzle[] {
  return puzzleData.map(({ id, title, difficulty, description, clues }) => ({
    id,
    title,
    difficulty,
    description,
    ...generateGrid(clues),
  }));
}

function generateGrid(questions: any): any {
  const puzzleGenerator = clg.generateLayout(questions);
  const clues = convertToCluesObject(puzzleGenerator?.result);
  const dynamicTemplate: string[][] = puzzleGenerator.table?.map((cur: string[]) => {
    return cur?.map((cur: string) => (cur === "-" ? "" : cur))
  });

  const maxLength = Math.max(...dynamicTemplate.map(row => row.length));

  const normalizedTemplate = dynamicTemplate.map(row => {
    if (row.length < maxLength) {
      return [...row, ...Array(maxLength - row.length).fill("")];
    }
    return row;
  });

  const grid: any[][] = [];
  let numberMap = new Map<string, number>();

  // Map clue numbers to their starting positions
  clues.across.forEach(clue => {
    numberMap.set(`${clue.row},${clue.col}`, clue.number);
  });
  clues.down.forEach(clue => {
    numberMap.set(`${clue.row},${clue.col}`, clue.number);
  });

  // Create grid with numbers only at clue starting positions
  for (let i = 0; i < normalizedTemplate.length; i++) {
    grid[i] = [];
    for (let j = 0; j < maxLength; j++) {
      const cellValue = normalizedTemplate[i][j];
      grid[i][j] = {
        row: i,
        col: j,
        answer: cellValue,
        isBlack: cellValue === "",
        number: numberMap.get(`${i},${j}`), // Only set numbers for clue starting positions
        isRevealed: false,
        userInput: "",
        isHighlighted: false
      };
    }
  }
  return { grid, clues };
}

// Initialize puzzles with default data for static generation
export const puzzles: CrosswordPuzzle[] = loadPuzzlesFromStorage();

// Client-side functions for dynamic puzzle management
let clientPuzzles: CrosswordPuzzle[] | null = null;

export function getPuzzleById(id: string): CrosswordPuzzle | undefined {
  if (typeof window !== 'undefined') {
    if (!clientPuzzles) {
      clientPuzzles = loadPuzzlesFromStorage();
    }
    return clientPuzzles.find(puzzle => puzzle.id === id);
  }
  return puzzles.find(puzzle => puzzle.id === id);
}

export function savePuzzleProgress(puzzleId: string, progress: any) {
  if (typeof window === 'undefined') return;

  const currentPuzzles = loadPuzzlesFromStorage();
  const updatedPuzzles = currentPuzzles.map(puzzle =>
    puzzle.id === puzzleId ? { ...puzzle, ...progress } : puzzle
  );

  localStorage.setItem('crosswordPuzzles', JSON.stringify(updatedPuzzles));
  clientPuzzles = updatedPuzzles;
}

export function createPuzzle(puzzleData: any) {
  if (typeof window === 'undefined') return;

  const currentPuzzles = loadPuzzlesFromStorage();
  const newPuzzle = generatePuzzles([puzzleData])[0];
  const updatedPuzzles = [...currentPuzzles, newPuzzle];

  localStorage.setItem('crosswordPuzzles', JSON.stringify(updatedPuzzles));
  clientPuzzles = updatedPuzzles;
  return newPuzzle;
}