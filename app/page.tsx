"use client";

import { useState } from "react";
import PuzzleList from "@/components/PuzzleList";
import GameInstructions from "@/components/GameInstructions";
import CrosswordGame from "@/components/CrosswordGame";
import ResultScreen from "@/components/ResultScreen";
import { ThemeProvider } from "@/components/ThemeProvider";

// Game states
enum GameState {
  LIST,
  INSTRUCTIONS,
  PLAYING,
  RESULT
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(GameState.LIST);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleSelectPuzzle = (puzzleId: string) => {
    setSelectedPuzzleId(puzzleId);
    setGameState(GameState.INSTRUCTIONS);
  };

  const handleStartGame = () => {
    setGameState(GameState.PLAYING);
  };

  const handleSubmitGame = (correct: number, total: number) => {
    setScore({ correct, total });
    setGameState(GameState.RESULT);
  };

  const handleBackToList = () => {
    setSelectedPuzzleId(null);
    setGameState(GameState.LIST);
  };

  const handlePlayAgain = () => {
    setGameState(GameState.PLAYING);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          {gameState === GameState.LIST && (
            <PuzzleList onSelectPuzzle={handleSelectPuzzle} />
          )}
          
          {gameState === GameState.INSTRUCTIONS && selectedPuzzleId && (
            <GameInstructions 
              puzzleId={selectedPuzzleId} 
              onStart={handleStartGame} 
              onBack={handleBackToList} 
            />
          )}
          
          {gameState === GameState.PLAYING && selectedPuzzleId && (
            <CrosswordGame 
              puzzleId={selectedPuzzleId} 
              onSubmit={handleSubmitGame} 
              onBack={handleBackToList} 
            />
          )}
          
          {gameState === GameState.RESULT && (
            <ResultScreen 
              score={score} 
              onPlayAgain={handlePlayAgain} 
              onBackToList={handleBackToList} 
            />
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}