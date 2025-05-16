import { CrosswordPuzzle } from "@/types/crossword";

// Sample crossword puzzles
export const puzzles: CrosswordPuzzle[] = [
  {
    id: "animals",
    title: "Animal Kingdom",
    difficulty: "easy",
    description: "A fun crossword about animals from around the world.",
    grid: generateGrid([
      ["C", "A", "T", "", "D", "O", "G"],
      ["O", "", "", "", "", "", "I"],
      ["W", "O", "L", "F", "", "", "R"],
      ["", "", "", "", "", "", "A"],
      ["B", "E", "A", "R", "", "", "F"],
      ["A", "", "", "", "", "", "F"],
      ["T", "I", "G", "E", "R", "", "E"]
    ]),
    clues: {
      across: [
        { number: 1, text: "Domestic feline pet", answer: "CAT", row: 0, col: 0, direction: "across" },
        { number: 4, text: "Man's best friend", answer: "DOG", row: 0, col: 4, direction: "across" },
        { number: 5, text: "Howls at the moon", answer: "WOLF", row: 2, col: 0, direction: "across" },
        { number: 7, text: "Large omnivore that hibernates", answer: "BEAR", row: 4, col: 0, direction: "across" },
        { number: 8, text: "Striped big cat", answer: "TIGER", row: 6, col: 0, direction: "across" }
      ],
      down: [
        { number: 1, text: "Produces milk for humans", answer: "COW", row: 0, col: 0, direction: "down" },
        { number: 2, text: "Long-necked African animal", answer: "GIRAFFE", row: 0, col: 6, direction: "down" }
      ]
    }
  },
  {
    id: "fruits",
    title: "Fruity Delights",
    difficulty: "medium",
    description: "Test your knowledge of various fruits from around the world.",
    grid: generateGrid([
      ["A", "P", "P", "L", "E", "", ""],
      ["", "E", "", "", "", "K", ""],
      ["B", "A", "N", "A", "N", "A", ""],
      ["", "R", "", "", "", "W", ""],
      ["", "", "G", "R", "A", "P", "E"],
      ["O", "R", "A", "N", "G", "E", ""],
      ["", "", "", "", "", "", ""]
    ]),
    clues: {
      across: [
        { number: 1, text: "Red or green fruit, keeps the doctor away", answer: "APPLE", row: 0, col: 0, direction: "across" },
        { number: 3, text: "Yellow curved fruit", answer: "BANANA", row: 2, col: 0, direction: "across" },
        { number: 5, text: "Small round fruit that grows in clusters", answer: "GRAPE", row: 4, col: 2, direction: "across" },
        { number: 6, text: "Citrus fruit with the same name as a color", answer: "ORANGE", row: 5, col: 0, direction: "across" }
      ],
      down: [
        { number: 1, text: "Soft fuzzy fruit with a large pit", answer: "PEACH", row: 0, col: 1, direction: "down" },
        { number: 2, text: "Tropical spiky fruit", answer: "PINEAPPLE", row: 0, col: 2, direction: "down" },
        { number: 4, text: "Green tropical fruit with a creamy texture", answer: "KIWI", row: 0, col: 5, direction: "down" }
      ]
    }
  },
  {
    id: "countries",
    title: "World Countries",
    difficulty: "hard",
    description: "Challenge yourself with this crossword about countries around the world.",
    grid: generateGrid([
      ["J", "A", "P", "A", "N", "", ""],
      ["", "", "O", "", "", "F", ""],
      ["B", "R", "A", "Z", "I", "L", ""],
      ["", "U", "", "", "N", "A", ""],
      ["", "S", "", "", "D", "N", ""],
      ["E", "G", "Y", "P", "T", "C", ""],
      ["", "I", "", "", "A", "E", ""],
      ["", "A", "", "", "L", "", ""],
      ["", "", "", "", "Y", "", ""]
    ]),
    clues: {
      across: [
        { number: 1, text: "Island nation known for sushi and anime", answer: "JAPAN", row: 0, col: 0, direction: "across" },
        { number: 3, text: "Largest country in South America", answer: "BRAZIL", row: 2, col: 0, direction: "across" },
        { number: 5, text: "Home to the Pyramids and Sphinx", answer: "EGYPT", row: 5, col: 0, direction: "across" }
      ],
      down: [
        { number: 1, text: "European country known for wine and fashion", answer: "FRANCE", row: 0, col: 5, direction: "down" },
        { number: 2, text: "Largest country by area", answer: "RUSSIA", row: 0, col: 1, direction: "down" },
        { number: 4, text: "Known for Taj Mahal and Bollywood", answer: "INDIA", row: 0, col: 4, direction: "down" },
        { number: 6, text: "Nordic country with fjords", answer: "ITALY", row: 2, col: 4, direction: "down" }
      ]
    }
  },
  {
    id: "technology",
    title: "Tech World",
    difficulty: "medium",
    description: "A crossword about technology, computers, and gadgets.",
    grid: generateGrid([
      ["L", "A", "P", "T", "O", "P", ""],
      ["", "", "H", "", "", "R", ""],
      ["M", "O", "U", "S", "E", "I", ""],
      ["", "", "N", "", "", "N", ""],
      ["S", "E", "R", "V", "E", "R", ""],
      ["", "", "", "", "", "E", ""],
      ["", "T", "A", "B", "L", "E", "T"]
    ]),
    clues: {
      across: [
        { number: 1, text: "Portable computer", answer: "LAPTOP", row: 0, col: 0, direction: "across" },
        { number: 3, text: "Pointing device for computers", answer: "MOUSE", row: 2, col: 0, direction: "across" },
        { number: 5, text: "Computer that provides data to other computers", answer: "SERVER", row: 4, col: 0, direction: "across" },
        { number: 7, text: "Portable touchscreen device", answer: "TABLET", row: 6, col: 1, direction: "across" }
      ],
      down: [
        { number: 1, text: "Output device for visual display", answer: "LMST", row: 0, col: 0, direction: "down" },
        { number: 2, text: "Central processing unit", answer: "PHONE", row: 0, col: 2, direction: "down" },
        { number: 4, text: "Device used to print documents", answer: "PRINTER", row: 0, col: 5, direction: "down" }
      ]
    }
  }
];

function generateGrid(template: string[][]): any[][] {
  // First, find the maximum row length to ensure all rows have the same length
  const maxLength = Math.max(...template.map(row => row.length));

  // Normalize the template so all rows have the same length
  const normalizedTemplate = template.map(row => {
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

  return grid;
}

export function getPuzzleById(id: string): CrosswordPuzzle | undefined {
  return puzzles.find(puzzle => puzzle.id === id);
}