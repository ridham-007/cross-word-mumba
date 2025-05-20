"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Share2, Trophy, Star, Target, Clock } from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import Confetti from "@/components/Confetti";
import { formatTime, cn } from "@/lib/utils";

interface ResultScreenProps {
  score: {
    correct: number;
    total: number;
    timeTaken?: number;
  };
  onPlayAgain: () => void;
  onBackToList: () => void;
}

export default function ResultScreen({ score, onPlayAgain, onBackToList }: ResultScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = Math.round((score.correct / score.total) * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const getResultInfo = () => {
    if (percentage === 100) {
      return {
        emoji: "🏆",
        icon: Trophy,
        message: "Perfect Score!",
        description: "Absolutely brilliant! You're a crossword master!",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500"
      };
    } else if (percentage >= 80) {
      return {
        emoji: "🌟",
        icon: Star,
        message: "Amazing Job!",
        description: "Outstanding performance! Keep up the great work!",
        color: "text-[#00e5e5]",
        bgColor: "bg-[#00e5e5]/10",
        borderColor: "border-[#00e5e5]"
      };
    } else if (percentage >= 60) {
      return {
        emoji: "👏",
        icon: Target,
        message: "Well Done!",
        description: "Good effort! You're making great progress!",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500"
      };
    } else {
      return {
        emoji: "💪",
        icon: Target,
        message: "Keep Going!",
        description: "Practice makes perfect! Try again and improve your score!",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500"
      };
    }
  };

  const resultInfo = getResultInfo();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `I scored ${percentage}% on this crossword puzzle! ${resultInfo.emoji}`;

  const Icon = resultInfo.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      {showConfetti && percentage >= 60 && <Confetti />}

      <Card className="w-full max-w-2xl border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00e5e5] to-transparent" />
          
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto mb-6 relative">
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center", resultInfo.bgColor)}>
                <Icon className={cn("w-10 h-10", resultInfo.color)} />
              </div>
              <div className="absolute -right-2 -top-2 text-4xl animate-bounce">
                {resultInfo.emoji}
              </div>
            </div>
            <CardTitle className={cn("text-3xl font-bold mb-2", resultInfo.color)}>
              {resultInfo.message}
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              {resultInfo.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={cn("border", resultInfo.borderColor)}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <p className="text-sm text-muted-foreground">
                    {score.correct} of {score.total} correct
                  </p>
                </CardContent>
              </Card>

              <Card className={cn("border", resultInfo.borderColor)}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {score.timeTaken ? formatTime(score.timeTaken) : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total time taken
                  </p>
                </CardContent>
              </Card>

              <Card className={cn("border", resultInfo.borderColor)}>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {percentage >= 90 ? "Expert" :
                     percentage >= 70 ? "Advanced" :
                     percentage >= 50 ? "Intermediate" : "Beginner"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your skill level
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Share2 className="w-4 h-4" />
                <h3 className="font-medium">Share your achievement</h3>
              </div>
              <div className="flex justify-center gap-4">
                <FacebookShareButton url={shareUrl} quote={shareTitle}>
                  <div className={cn("p-2 rounded-full transition-colors", resultInfo.bgColor)}>
                    <FacebookIcon size={40} round />
                  </div>
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <div className={cn("p-2 rounded-full transition-colors", resultInfo.bgColor)}>
                    <TwitterIcon size={40} round />
                  </div>
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <div className={cn("p-2 rounded-full transition-colors", resultInfo.bgColor)}>
                    <WhatsappIcon size={40} round />
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-between p-6">
            <Button
              variant="outline"
              onClick={onBackToList}
              className={cn("w-full sm:w-auto border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Puzzle
            </Button>
            <Button
              onClick={onPlayAgain}
              className={cn("w-full sm:w-auto", resultInfo.bgColor, resultInfo.color)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </CardFooter>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00e5e5] to-transparent" />
        </div>
      </Card>
    </div>
  );
}