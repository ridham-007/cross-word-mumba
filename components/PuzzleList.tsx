"use client";

import { useState } from "react";
import { puzzles, createPuzzle } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Users, FileText, Plus, Brain, Trophy, Target, Clock } from "lucide-react";
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

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'from-green-400 to-emerald-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-400',
          gradientBg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
          level: 'Beginner Friendly',
          description: 'Perfect for those new to crosswords'
        };
      case 'medium':
        return {
          color: 'from-emerald-400 to-teal-500',
          textColor: 'text-emerald-400',
          bgColor: 'bg-emerald-400',
          gradientBg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          level: 'Intermediate',
          description: 'Challenging but manageable'
        };
      case 'hard':
        return {
          color: 'from-teal-400 to-cyan-500',
          textColor: 'text-teal-400',
          bgColor: 'bg-teal-400',
          gradientBg: 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10',
          level: 'Expert',
          description: 'For seasoned puzzle solvers'
        };
      default:
        return {
          color: 'from-green-400 to-emerald-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-400',
          gradientBg: 'bg-gradient-to-r from-green-500/10 to-emerald-500/10',
          level: 'Unknown',
          description: 'Difficulty level not specified'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Crossword Puzzles
          </h1>
          <p className="text-xl text-muted-foreground">Challenge yourself with our collection of puzzles</p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Puzzle
          </Button>
        </div>

        <div className="space-y-6">
          {puzzleList.map((puzzle) => {
            const difficultyInfo = getDifficultyInfo(puzzle.difficulty);
            
            return (
              <Card
                key={puzzle.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  hoveredPuzzle === puzzle.id ? 'scale-[1.01]' : 'scale-100'
                } ${difficultyInfo.gradientBg} border-none`}
                onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
                onMouseLeave={() => setHoveredPuzzle(null)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl font-bold">{puzzle.title}</CardTitle>
                          <Badge variant="outline" className={`border-green-500 ${difficultyInfo.textColor} hidden sm:inline-flex`}>
                            {puzzle.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-base mt-2">{puzzle.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className={`border-green-500 ${difficultyInfo.textColor} sm:hidden ml-2 shrink-0`}>
                        {puzzle.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                      <div className={`rounded-full ${difficultyInfo.gradientBg} p-2`}>
                        <Trophy className={`h-4 w-4 ${difficultyInfo.textColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Clues</p>
                        <p className="text-sm text-muted-foreground">{puzzle.clues.across.length + puzzle.clues.down.length} total</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                      <div className={`rounded-full ${difficultyInfo.gradientBg} p-2`}>
                        <Clock className={`h-4 w-4 ${difficultyInfo.textColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">~{puzzle.difficulty === 'easy' ? 5 : puzzle.difficulty === 'medium' ? 10 : 15} mins</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                      <div className={`rounded-full ${difficultyInfo.gradientBg} p-2`}>
                        <Brain className={`h-4 w-4 ${difficultyInfo.textColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Level</p>
                        <p className="text-sm text-muted-foreground">{difficultyInfo.level}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    className={`border-green-500 ${difficultyInfo.textColor} hover:bg-green-500/10`}
                    onClick={() => handlePlayClick(puzzle.id)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Challenge
                  </Button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            );
          })}
        </div>

        <CreatePuzzleModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onCreatePuzzle={handleCreatePuzzle}
        />
      </div>
    </div>
  );
}