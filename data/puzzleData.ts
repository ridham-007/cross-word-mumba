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

export const puzzles: CrosswordPuzzle[] = [
  {
    id: "animals",
    title: "Animal Kingdom",
    difficulty: "easy",
    description: "A fun crossword about animals from around the world.",
    ...generateGrid([
      { "clue": "Domestic feline pet", "answer": "CAT" },
      { "clue": "Man's best friend", "answer": "DOG" },
      { "clue": "Howls at the moon", "answer": "WOLF" },
      { "clue": "Large omnivore that hibernates", "answer": "BEAR" },
      { "clue": "Striped big cat", "answer": "TIGER" },
      { "clue": "Produces milk for humans", "answer": "COW" },
      { "clue": "Long-necked African animal", "answer": "GIRAFFE" }]
    ),
  },
  {
    id: "fruits",
    title: "Fruity Delights",
    difficulty: "medium",
    description: "Test your knowledge of various fruits from around the world.",
    ...generateGrid([
      { "clue": "Red or green fruit, keeps the doctor away", "answer": "APPLE" },
      { "clue": "Yellow curved fruit", "answer": "BANANA" },
      { "clue": "Small round fruit that grows in clusters", "answer": "GRAPE" },
      { "clue": "Citrus fruit with the same name as a color", "answer": "ORANGE" },
      { "clue": "Soft fuzzy fruit with a large pit", "answer": "PEACH" },
      { "clue": "Tropical spiky fruit", "answer": "PINEAPPLE" },
      { "clue": "Green tropical fruit with a creamy texture", "answer": "KIWI" }
    ]
    ),
  },
  {
    id: "countries",
    title: "World Countries",
    difficulty: "hard",
    description: "Challenge yourself with this crossword about countries around the world.",
    ...generateGrid([
      { "clue": "Island nation known for sushi and anime", "answer": "JAPAN" },
      { "clue": "Largest country in South America", "answer": "BRAZIL" },
      { "clue": "Home to the Pyramids and Sphinx", "answer": "EGYPT" },
      { "clue": "European country known for wine and fashion", "answer": "FRANCE" },
      { "clue": "Largest country by area", "answer": "RUSSIA" },
      { "clue": "Known for Taj Mahal and Bollywood", "answer": "INDIA" },
      { "clue": "Nordic country with fjords", "answer": "ITALY" }
    ]),
  },
  {
    id: "technology",
    title: "Tech World",
    difficulty: "medium",
    description: "A crossword about technology, computers, and gadgets.",
    ...generateGrid([
      { "clue": "Portable computer", "answer": "LAPTOP" },
      { "clue": "Pointing device for computers", "answer": "MOUSE" },
      { "clue": "Computer that provides data to other computers", "answer": "SERVER" },
      { "clue": "Portable touchscreen device", "answer": "TABLET" },
      { "clue": "Output device for visual display", "answer": "LMST" },
      { "clue": "Central processing unit", "answer": "PHONE" },
      { "clue": "Device used to print documents", "answer": "PRINTER" }
    ]
    ),
  }
];

function generateGrid(questions: any): any {
  const puzzleGenerator = clg.generateLayout(questions);
  const clues = convertToCluesObject(puzzleGenerator?.result);
  const dynamicTemplate: string[][] = puzzleGenerator.table?.map((cur: string[]) => {
    return cur?.map((cur: string) => (cur === "-" ? "" : cur))
  })
  // First, find the maximum row length to ensure all rows have the same length
  const maxLength = Math.max(...dynamicTemplate.map(row => row.length));

  // Normalize the template so all rows have the same length
  const normalizedTemplate = dynamicTemplate.map(row => {
    if (row.length < maxLength) {
      return [...row, ...Array(maxLength - row.length).fill("")];
    }
    return row;
  });

  const grid: any[][] = [];
  let numberMap = new Map<string, number>();
  let currentNumber = 1;

  // First pass: determine cell numbers
  for (let i = 0; i < normalizedTemplate.length; i++) {
    for (let j = 0; j < maxLength; j++) {
      if (normalizedTemplate[i][j] !== "") {
        const isStartOfAcross = j === 0 || normalizedTemplate[i][j - 1] === "";
        const isStartOfDown = i === 0 || normalizedTemplate[i - 1][j] === "";

        if (isStartOfAcross || isStartOfDown) {
          numberMap.set(`${i},${j}`, currentNumber++);
        }
      }
    }
  }

  // Second pass: create grid with numbers
  for (let i = 0; i < normalizedTemplate.length; i++) {
    grid[i] = [];
    for (let j = 0; j < maxLength; j++) {
      const cellValue = normalizedTemplate[i][j];
      grid[i][j] = {
        row: i,
        col: j,
        answer: cellValue,
        isBlack: cellValue === "",
        number: numberMap.get(`${i},${j}`),
        isRevealed: false,
        userInput: "",
        isHighlighted: false
      };
    }
  }
  console.log({ grid })

  return { grid, clues };
}

export function getPuzzleById(id: string): CrosswordPuzzle | undefined {
  return puzzles.find(puzzle => puzzle.id === id);
}