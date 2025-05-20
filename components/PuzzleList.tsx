"use client";

import { useState } from "react";
import { puzzles, createPuzzle } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Users, FileText, Plus, Trophy } from "lucide-react";
import CreatePuzzleModal from "./CreatePuzzleModal";
import { useRouter } from "next/navigation";

interface PuzzleListProps {
  onSelectPuzzle: (puzzleId: string) => void;
}

export default function PuzzleList({ onSelectPuzzle }: PuzzleListProps) {
  const [hoveredPuzzle, setHoveredPuzzle] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [puzzleList, setPuzzleList] = useState(puzzles);
  const router = useRouter();

  const handleCreatePuzzle = (puzzleData: any) => {
    const newPuzzle: any = createPuzzle(puzzleData);
    setPuzzleList([...puzzleList, newPuzzle]);
  };

  const handlePlayClick = (puzzleId: string) => {
    router.push(`/play/${puzzleId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
      case 'hard': return 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🌟';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
          Crossword Puzzle Challenge
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge and challenge yourself with our collection of engaging crossword puzzles
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Puzzle
        </Button>
      </div>

      <div className="space-y-6">
        {puzzleList.map((puzzle) => (
          <Card
            key={puzzle.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
              hoveredPuzzle === puzzle.id ? 'scale-[1.01]' : 'scale-100'
            } cursor-pointer border-border/50 hover:border-primary/50`}
            onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
            onMouseLeave={() => setHoveredPuzzle(null)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl font-bold">{puzzle.title}</CardTitle>
                    <Badge className={`${getDifficultyColor(puzzle.difficulty)} transition-colors`}>
                      {getDifficultyIcon(puzzle.difficulty)} {puzzle.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground text-base">
                    {puzzle.description}
                  </CardDescription>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Clues</p>
                    <p className="text-2xl font-bold">{puzzle.clues.across.length + puzzle.clues.down.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Est. Time</p>
                    <p className="text-2xl font-bold">{puzzle.difficulty === 'easy' ? '5' : puzzle.difficulty === 'medium' ? '10' : '15'}m</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Skill Level</p>
                    <p className="text-2xl font-bold">
                      {puzzle.difficulty === 'easy' ? 'Beginner' : 
                       puzzle.difficulty === 'medium' ? 'Intermediate' : 
                       'Expert'}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => handlePlayClick(puzzle.id)}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Challenge
              </Button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </Card>
        ))}
      </div>

      <CreatePuzzleModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreatePuzzle={handleCreatePuzzle}
      />
    </div>
  );
}