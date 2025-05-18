"use client";

import { useState } from "react";
import { puzzles, createPuzzle } from "@/data/puzzleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, CheckCircle, Clock, Grid3X3, Target, PenTool, Check, Plus } from "lucide-react";
import CreatePuzzleModal from "./CreatePuzzleModal";
import { useRouter } from "next/navigation";

interface PuzzleListProps {
  onSelectPuzzle: (puzzleId: string) => void;
}

export default function PuzzleList({ onSelectPuzzle }: PuzzleListProps) {
  const [hoveredPuzzle, setHoveredPuzzle] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
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
            className={`transition-all duration-300 hover:shadow-lg ${hoveredPuzzle === puzzle.id ? 'scale-[1.02]' : 'scale-100'
              } cursor-pointer`}
            onMouseEnter={() => setHoveredPuzzle(puzzle.id)}
            onMouseLeave={() => setHoveredPuzzle(null)}
            onClick={() => handlePlayClick(puzzle.id)}
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
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInstructions(true);
                }}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                How to Play
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => handlePlayClick(puzzle.id)}
              >
                Play Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              How to Play
            </DialogTitle>
            <DialogDescription>
              Master the crossword puzzle with these simple instructions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/10 rounded-full p-3 mt-0.5">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Select & Navigate</h3>
                    <p className="text-muted-foreground">
                      Click any cell to start. Double-click to switch between across and down. Use arrow keys or tab to move between cells.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/10 rounded-full p-3 mt-0.5">
                    <PenTool className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Fill in Answers</h3>
                    <p className="text-muted-foreground">
                      Type letters directly or use the on-screen keyboard. Press backspace to clear a cell. The cursor automatically moves to the next cell.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/10 rounded-full p-3 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Check Your Progress</h3>
                    <p className="text-muted-foreground">
                      Use the check button to verify answers. Correct answers turn green, incorrect ones red. Complete all words to finish the puzzle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-500/10 rounded-full p-3 mt-0.5">
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Take Your Time</h3>
                    <p className="text-muted-foreground">
                      {` There's no time limit - solve at your own pace. Use hints when needed and enjoy the challenge!`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Start with shorter words to build momentum
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Use crossing words to help solve difficult clues
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {` Don't be afraid to use the check feature to learn`}
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreatePuzzleModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreatePuzzle={handleCreatePuzzle}
      />
    </div>
  );
}