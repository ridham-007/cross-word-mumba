"use client";

import { useState } from "react";
import { puzzles, createPuzzle } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Users, FileText, Plus } from "lucide-react";
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Crossword Puzzle</h1>
        <p className="text-xl text-muted-foreground">Choose a puzzle and challenge yourself!</p>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Puzzle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzleList.map((puzzle) => (
          <Card
            key={puzzle.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              hoveredPuzzle === puzzle.id ? 'scale-[1.02]' : 'scale-100'
            } cursor-pointer border-border bg-card`}
            onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
            onMouseLeave={() => setHoveredPuzzle(null)}
            onClick={() => handlePlayClick(puzzle.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-bold">{puzzle.title}</CardTitle>
                <Badge className={`${getDifficultyColor(puzzle.difficulty)} transition-colors`}>
                  {puzzle.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground">
                {puzzle.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{puzzle.clues.across.length + puzzle.clues.down.length} clues</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>~{puzzle.difficulty === 'easy' ? 5 : puzzle.difficulty === 'medium' ? 10 : 15} mins</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {puzzle.difficulty === 'easy' ? 'Beginner' : 
                     puzzle.difficulty === 'medium' ? 'Intermediate' : 
                     'Expert'}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Button 
                className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
                onClick={() => handlePlayClick(puzzle.id)}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Challenge
              </Button>
            </CardFooter>

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