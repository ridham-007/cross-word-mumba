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
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const handleStartGame = () => {
        setGameState(GameState.PLAYING);
    };

    const handleSubmitGame = (correct: number, total: number) => {
        setScore({ correct, total });
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
            <div className="container mx-auto px-4 py-8">
                {/* <Button
                    onClick={handleBackToList}
                    variant="outline"
                    size="icon"
                    className="mb-6 rounded-full"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button> */}

                {gameState === GameState.INSTRUCTIONS && (
                    <GameInstructions
                        puzzleId={puzzleId}
                        onStart={handleStartGame}
                        onBack={handleBackToList}
                    />
                )}

                {gameState === GameState.PLAYING && (
                    <CrosswordGame
                        puzzleId={puzzleId}
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
    );
}