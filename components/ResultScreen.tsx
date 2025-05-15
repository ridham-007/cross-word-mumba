"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import Confetti from "@/components/Confetti";

interface ResultScreenProps {
  score: {
    correct: number;
    total: number;
  };
  onPlayAgain: () => void;
  onBackToList: () => void;
}

export default function ResultScreen({ score, onPlayAgain, onBackToList }: ResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((score.correct / score.total) * 100);
  
  // Show confetti after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get the appropriate message based on score
  const getMessage = () => {
    if (percentage === 100) {
      return "Perfect! You got every answer correct!";
    } else if (percentage >= 80) {
      return "Great job! You really know your stuff!";
    } else if (percentage >= 60) {
      return "Good work! You're making progress!";
    } else if (percentage >= 40) {
      return "Nice effort! Keep practicing!";
    } else {
      return "You'll get better with practice!";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {showConfetti && percentage > 50 && <Confetti />}
      
      <Card className="w-full max-w-lg border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Results
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-8 pt-4">
          <div className="space-y-2">
            <p className="text-xl font-medium">{getMessage()}</p>
            
            <div className="flex items-center justify-center mt-6">
              <div className="relative h-48 w-48">
                {/* Progress circle */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                  ></circle>
                  
                  {/* Progress circle */}
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                
                {/* Percentage in the middle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold">{percentage}%</span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {score.correct} / {score.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={onPlayAgain}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}