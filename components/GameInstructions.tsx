import { getPuzzleById } from "@/data/puzzleData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, HelpCircle, PenTool, Zap, Target, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface GameInstructionsProps {
  puzzleId: string;
  onStart: () => void;
  onBack: () => void;
}

export default function GameInstructions({ puzzleId, onStart, onBack }: GameInstructionsProps) {
  const puzzle = getPuzzleById(puzzleId);
  const [showInstructions, setShowInstructions] = useState(false);
  
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
            <Zap className="h-6 w-6 text-yellow-500" />
            Puzzle Details
          </CardTitle>
          <CardDescription>
            Everything you need to know about this puzzle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Grid Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Size: {puzzle.grid.length}x{puzzle.grid[0].length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Words: {puzzle.clues.across.length + puzzle.clues.down.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Across: {puzzle.clues.across.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>Down: {puzzle.clues.down.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Difficulty Level</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-medium">
                    {puzzle.difficulty === 'easy' ? '5-10' : 
                     puzzle.difficulty === 'medium' ? '10-15' : 
                     '15-20'} minutes
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Skill Level:</span>
                  <span className="font-medium">
                    {puzzle.difficulty === 'easy' ? 'Beginner' :
                     puzzle.difficulty === 'medium' ? 'Intermediate' :
                     'Expert'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{puzzle.description}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-32"
          >
            Back to List
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              How to Play
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={onStart}
            >
              Start Playing
            </Button>
          </div>
        </CardFooter>
      </Card>

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
                      There's no time limit - solve at your own pace. Use hints when needed and enjoy the challenge!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}