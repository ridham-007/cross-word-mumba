"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Share2, Trophy } from "lucide-react";
import { 
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
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
  
  // Get the appropriate message and emoji based on score
  const getResultInfo = () => {
    if (percentage === 100) {
      return {
        emoji: "🏆",
        message: "Perfect! You're a crossword master!",
        description: "Absolutely brilliant! Every answer correct!"
      };
    } else if (percentage >= 80) {
      return {
        emoji: "🌟",
        message: "Amazing job!",
        description: "You're really good at this!"
      };
    } else if (percentage >= 60) {
      return {
        emoji: "👏",
        message: "Good work!",
        description: "You're making great progress!"
      };
    } else if (percentage >= 40) {
      return {
        emoji: "💪",
        message: "Nice effort!",
        description: "Keep practicing, you're getting better!"
      };
    } else {
      return {
        emoji: "🎯",
        message: "Keep going!",
        description: "Every puzzle makes you stronger!"
      };
    }
  };

  const resultInfo = getResultInfo();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `I scored ${percentage}% on this crossword puzzle! ${resultInfo.emoji}`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {showConfetti && percentage > 50 && <Confetti />}
      
      <Card className="w-full max-w-lg border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl mb-4 animate-bounce">
            {resultInfo.emoji}
          </div>
          <CardTitle className="text-3xl font-bold">
            {resultInfo.message}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-8 pt-4">
          <p className="text-xl text-muted-foreground">
            {resultInfo.description}
          </p>
          
          <div className="flex items-center justify-center">
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

          <div className="space-y-4">
            <h3 className="font-medium text-muted-foreground">Share your result</h3>
            <div className="flex justify-center gap-4">
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-between">
          <Button
            variant="outline"
            onClick={onBackToList}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Puzzle
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
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