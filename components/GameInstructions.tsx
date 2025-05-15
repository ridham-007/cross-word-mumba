"use client";

import { getPuzzleById } from "@/data/puzzleData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, HelpCircle, PenTool, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameInstructionsProps {
  puzzleId: string;
  onStart: () => void;
  onBack: () => void;
}

export default function GameInstructions({ puzzleId, onStart, onBack }: GameInstructionsProps) {
  const puzzle = getPuzzleById(puzzleId);
  
  if (!puzzle) {
    return (
      <div className="text-center">
        <p>Puzzle not found</p>
        <Button onClick={onBack}>Back to Puzzles</Button>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onBack}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{puzzle.title}</h1>
        <Badge className={getDifficultyColor(puzzle.difficulty)}>
          {puzzle.difficulty}
        </Badge>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            How to Play
          </CardTitle>
          <CardDescription>
            Follow these instructions to enjoy the crossword puzzle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Getting Started</h3>
                <p className="text-muted-foreground">
                  Tap on a cell to start filling in answers. You can switch between across and down by tapping twice on the same cell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <PenTool className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Filling in Answers</h3>
                <p className="text-muted-foreground">
                  Use the on-screen keyboard or your physical keyboard to type answers. The focus will automatically move to the next cell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary rounded-full p-2 mt-0.5">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Completing the Puzzle</h3>
                <p className="text-muted-foreground">
                  Use the buttons at the bottom to check your answers, reveal solutions, or submit your completed puzzle. Have fun!
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-secondary p-4">
            <h3 className="font-medium mb-2">Puzzle Details</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Grid Size: {puzzle.grid.length}x{puzzle.grid[0].length}</li>
              <li>• Total Clues: {puzzle.clues.across.length + puzzle.clues.down.length}</li>
              <li>• Difficulty: {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}</li>
              <li>• Estimated Time: {puzzle.difficulty === 'easy' ? '5-10' : puzzle.difficulty === 'medium' ? '10-15' : '15-20'} minutes</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back to List
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={onStart}
          >
            Start Playing
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}