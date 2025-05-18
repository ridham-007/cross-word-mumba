import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your environment
});

const SYSTEM_PROMPT = `Create a crossword puzzle with the following requirements:
- Generate a maximum of 8 clues and answers
- All answers must be single words and no longer than 6 characters
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

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-3.5-turbo' if needed
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    // Parse the JSON content from the response
    const content = chatResponse.choices[0].message.content;

    // Try parsing the content as JSON
    const puzzle = JSON.parse(content || '{}');

    // Add an ID for tracking (optional)
    puzzle.id = `puzzle-${Date.now()}`;

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to generate puzzle' },
      { status: 500 }
    );
  }
}
