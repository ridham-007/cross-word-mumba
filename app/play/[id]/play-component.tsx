"use client";
import { useParams } from "next/navigation";
import { getPuzzleById } from "@/data/puzzleData";
import CrosswordGame from "@/components/CrosswordGame";
import GameInstructions from "@/components/GameInstructions";
import ResultScreen from "@/components/ResultScreen";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

enum GameState {
    INSTRUCTIONS,
    PLAYING,
    RESULT
}

export default function PlayArea() {
    const params = useParams();
    const router = useRouter();
    const puzzleId = params.id as string;
    const puzzle = getPuzzleById(puzzleId);

    const [gameState, setGameState] = useState<GameState>(GameState.INSTRUCTIONS);
    const [score, setScore] = useState({ correct: 0, total: 0, timeTaken: 0 });

    const handleStartGame = () => {
        setGameState(GameState.PLAYING);
    };

    const handleSubmitGame = (correct: number, total: number, timeTaken: number) => {
        setScore({ correct, total, timeTaken });
        setGameState(GameState.RESULT);
    };

    const handleBackToList = () => {
        router.push("/");
    };

    const handlePlayAgain = () => {
        setGameState(GameState.PLAYING);
    };

    if (!puzzle) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Puzzle not found</h1>
                    <Button onClick={handleBackToList}>Back to Puzzles</Button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {gameState === GameState.INSTRUCTIONS && (
                    <GameInstructions
                        puzzleId={puzzleId}
                        onStart={handleStartGame}
                        onBack={handleBackToList}
                    />
                )}

                {gameState === GameState.PLAYING && (
                    <div className="relative">
                        <div className="absolute -top-2 left-0 w-full h-1 bg-gradient-to-r from-[#00e5e5]/0 via-[#00e5e5] to-[#00e5e5]/0 animate-pulse" />
                        <CrosswordGame
                            puzzleId={puzzleId}
                            onSubmit={handleSubmitGame}
                            onBack={handleBackToList}
                        />
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00e5e5]/0 via-[#00e5e5] to-[#00e5e5]/0 animate-pulse" />
                    </div>
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
    );
}