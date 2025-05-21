import { useState } from "react";
import { puzzles, createPuzzle } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Users, FileText, Plus, Brain, Trophy, Target, Clock } from "lucide-react";
import CreatePuzzleModal from "./CreatePuzzleModal";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
          color: 'bg-[#00e5e5]',
          textColor: 'text-[#00e5e5]',
          borderColor: 'border-[#00e5e5]',
          level: 'Beginner'
        };
      case 'medium':
        return {
          color: 'bg-[#00e5e5]',
          textColor: 'text-[#00e5e5]',
          borderColor: 'border-[#00e5e5]',
          level: 'Intermediate'
        };
      case 'hard':
        return {
          color: 'bg-[#00e5e5]',
          textColor: 'text-[#00e5e5]',
          borderColor: 'border-[#00e5e5]',
          level: 'Expert'
        };
      default:
        return {
          color: 'bg-[#00e5e5]',
          textColor: 'text-[#00e5e5]',
          borderColor: 'border-[#00e5e5]',
          level: 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[#00e5e5]">
            Crossword Puzzles
          </h1>
          <p className="text-xl text-muted-foreground">Challenge yourself with our collection of puzzles</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outline"
            className="border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Puzzle
          </Button>
          <Link href="/leaderboard">
            <Button
              variant="outline"
              className="border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {puzzleList.map((puzzle) => {
            const difficultyInfo = getDifficultyInfo(puzzle.difficulty);
            
            return (
              <Card
                key={puzzle.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  hoveredPuzzle === puzzle.id ? 'scale-[1.01]' : 'scale-100'
                }`}
                onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
                onMouseLeave={() => setHoveredPuzzle(null)}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-2xl font-bold">{puzzle.title}</CardTitle>
                          <Badge variant="outline" className={`${difficultyInfo.borderColor} ${difficultyInfo.textColor} hidden sm:inline-flex`}>
                            {puzzle.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription className="text-base mt-2">{puzzle.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className={`${difficultyInfo.borderColor} ${difficultyInfo.textColor} sm:hidden ml-2 shrink-0`}>
                        {puzzle.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 bg-card`}>
                        <Trophy className="h-4 w-4 text-[#00e5e5]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Clues</p>
                        <p className="text-sm text-muted-foreground">{puzzle.clues.across.length + puzzle.clues.down.length} total</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 bg-card`}>
                        <Clock className="h-4 w-4 text-[#00e5e5]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">~{puzzle.difficulty === 'easy' ? 5 : puzzle.difficulty === 'medium' ? 10 : 15} mins</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 bg-card`}>
                        <Brain className="h-4 w-4 text-[#00e5e5]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Level</p>
                        <p className="text-sm text-muted-foreground">{difficultyInfo.level}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      className="border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10"
                      onClick={() => handlePlayClick(puzzle.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Challenge
                    </Button>
                    <Link href={`/leaderboard?puzzleId=${puzzle.id}`}>
                      <Button
                        variant="outline"
                        className="border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10"
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        View Rankings
                      </Button>
                    </Link>
                  </div>
                </div>
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