import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Create a crossword puzzle with the following requirements:
- Generate 8-10 clues and answers
- Answers should be single words
- Clues should be clear and appropriate for the difficulty level
- Include a mix of easy and challenging clues
- Format the response as a JSON object with:
  - title: A catchy title for the puzzle
  - description: A brief description
  - difficulty: "easy", "medium", or "hard"
  - clues: Array of objects with "clue" and "answer" properties`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Here you would integrate with your preferred AI API
    // This is a mock response for demonstration
    const mockPuzzle = {
      id: `puzzle-${Date.now()}`,
      title: "Indian Culture Crossword",
      description: "Test your knowledge of Indian culture, traditions, and history",
      difficulty: "medium",
      clues: [
        { clue: "Traditional Indian dress for women", answer: "SARI" },
        { clue: "India's national bird", answer: "PEACOCK" },
        { clue: "Holy river of India", answer: "GANGES" },
        { clue: "Ancient Indian system of medicine", answer: "AYURVEDA" },
        { clue: "Classical Indian dance form", answer: "KATHAK" },
        { clue: "Indian bread", answer: "NAAN" },
        { clue: "Sacred Hindu text", answer: "VEDAS" },
        { clue: "India's national animal", answer: "TIGER" }
      ]
    };

    return NextResponse.json(mockPuzzle);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to generate puzzle' },
      { status: 500 }
    );
  }
}