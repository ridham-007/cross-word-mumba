"use client";

import { useState } from "react";
import { puzzles } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock, Grid3X3 } from "lucide-react";

interface PuzzleListProps {
  onSelectPuzzle: (puzzleId: string) => void;
}

export default function PuzzleList({ onSelectPuzzle }: PuzzleListProps) {
  const [hoveredPuzzle, setHoveredPuzzle] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 hover:bg-green-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'hard': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Crossword Puzzle</h1>
        <p className="text-xl text-muted-foreground">Choose a puzzle and challenge yourself!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzles.map((puzzle) => (
          <Card 
            key={puzzle.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              hoveredPuzzle === puzzle.id ? 'scale-[1.02]' : 'scale-100'
            } cursor-pointer`}
            onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
            onMouseLeave={() => setHoveredPuzzle(null)}
            onClick={() => onSelectPuzzle(puzzle.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{puzzle.title}</CardTitle>
                <Badge className={getDifficultyColor(puzzle.difficulty)}>
                  {puzzle.difficulty}
                </Badge>
              </div>
              <CardDescription>{puzzle.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span>{puzzle.grid.length}x{puzzle.grid[0].length} grid</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {puzzle.clues.across.length + puzzle.clues.down.length} clues
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>~{puzzle.difficulty === 'easy' ? 5 : puzzle.difficulty === 'medium' ? 10 : 15} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{puzzle.difficulty === 'easy' ? 'Beginner' : puzzle.difficulty === 'medium' ? 'Intermediate' : 'Expert'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => onSelectPuzzle(puzzle.id)}
              >
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}