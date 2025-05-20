import { getPuzzleById } from "@/data/puzzleData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, HelpCircle, PenTool, Zap, Target, Check, Brain, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

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

  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'from-emerald-400 to-teal-500',
          textColor: 'text-emerald-500',
          bgColor: 'bg-emerald-500',
          gradientBg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          level: 'Beginner Friendly',
          progress: 33,
          description: 'Perfect for those new to crosswords'
        };
      case 'medium':
        return {
          color: 'from-amber-400 to-orange-500',
          textColor: 'text-amber-500',
          bgColor: 'bg-amber-500',
          gradientBg: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
          level: 'Intermediate',
          progress: 66,
          description: 'Challenging but manageable'
        };
      case 'hard':
        return {
          color: 'from-rose-400 to-red-500',
          textColor: 'text-rose-500',
          bgColor: 'bg-rose-500',
          gradientBg: 'bg-gradient-to-r from-rose-500/10 to-red-500/10',
          level: 'Expert',
          progress: 100,
          description: 'For seasoned puzzle solvers'
        };
      default:
        return {
          color: 'from-blue-400 to-indigo-500',
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-500',
          gradientBg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
          level: 'Unknown',
          progress: 50,
          description: 'Difficulty level not specified'
        };
    }
  };

  const difficultyInfo = getDifficultyInfo(puzzle.difficulty);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Badge className={`bg-gradient-to-r ${difficultyInfo.color} text-white`}>
            {puzzle.difficulty.toUpperCase()}
          </Badge>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">{puzzle.title}</h1>
          <p className="text-xl text-muted-foreground">{puzzle.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className={`${difficultyInfo.gradientBg} border-none shadow-xl`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className={`h-5 w-5 ${difficultyInfo.textColor}`} />
                Puzzle Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Difficulty Level</span>
                  <span className={`font-medium ${difficultyInfo.textColor}`}>{difficultyInfo.level}</span>
                </div>
                <Progress value={difficultyInfo.progress} className={`h-2 [&>div]:bg-gradient-to-r ${difficultyInfo.color}`} />
                <p className="text-sm text-muted-foreground">{difficultyInfo.description}</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className={difficultyInfo.textColor} />
                    <span>Estimated Time</span>
                  </div>
                  <span className="font-medium">
                    {puzzle.difficulty === 'easy' ? '5-10' : 
                     puzzle.difficulty === 'medium' ? '10-15' : 
                     '15-20'} minutes
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Trophy className={difficultyInfo.textColor} />
                    <span>Total Clues</span>
                  </div>
                  <span className="font-medium">
                    {puzzle.clues.across.length + puzzle.clues.down.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Target className={difficultyInfo.textColor} />
                    <span>Grid Size</span>
                  </div>
                  <span className="font-medium">
                    {puzzle.grid.length}x{puzzle.grid[0].length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                <div className="rounded-full bg-primary/20 p-2">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Fill Strategy</h4>
                  <p className="text-sm text-muted-foreground">Start with the shorter words and use intersecting letters as hints</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                <div className="rounded-full bg-primary/20 p-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Use the Check Feature</h4>
                  <p className="text-sm text-muted-foreground">Verify your answers as you go to stay on track</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                <div className="rounded-full bg-primary/20 p-2">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Navigate Efficiently</h4>
                  <p className="text-sm text-muted-foreground">Click cells or use arrow keys to move around the grid</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            variant="outline"
            onClick={() => setShowInstructions(true)}
            className="w-full sm:w-auto border-primary/20 hover:bg-primary/10"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            How to Play
          </Button>
          <Button
            onClick={onStart}
            size="lg"
            className={`w-full sm:w-auto bg-gradient-to-r ${difficultyInfo.color} text-white hover:opacity-90 transition-opacity`}
          >
            Start Playing
          </Button>
        </div>

        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>How to Play</DialogTitle>
              <DialogDescription>
                Master the crossword puzzle with these simple instructions
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Controls</h3>
                <div className="grid gap-4 text-sm">
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Navigation</p>
                      <p className="text-muted-foreground">Click any cell to start. Use arrow keys or tab to move between cells. Double-click to switch direction.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                    <div className="rounded-full bg-primary/20 p-2">
                      <PenTool className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Entering Answers</p>
                      <p className="text-muted-foreground">Type letters directly or use the on-screen keyboard. Press backspace to clear a cell.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Checking Progress</p>
                      <p className="text-muted-foreground">Use the check button to verify answers. Green indicates correct, red indicates incorrect.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}