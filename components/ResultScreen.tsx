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
import { formatTime } from "@/lib/utils";
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
        description: "Absolutely brilliant! You're a crossword master!"
      };
    } else if (percentage >= 80) {
      return {
        emoji: "🌟",
        icon: Star,
        message: "Amazing Job!",
        description: "Outstanding performance! Keep up the great work!"
      };
    } else if (percentage >= 60) {
      return {
        emoji: "👏",
        icon: Target,
        message: "Well Done!",
        description: "Good effort! You're making great progress!"
      };
    } else {
      return {
        emoji: "💪",
        icon: Target,
        message: "Keep Going!",
        description: "Practice makes perfect! Try again and improve your score!"
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
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e5e5]/0 via-[#00e5e5] to-[#00e5e5]/0" />

          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto mb-6 relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#00e5e5]/10">
                <Icon className="w-10 h-10 text-[#00e5e5]" />
              </div>
              <div className="absolute -right-2 -top-2 text-4xl animate-bounce">
                {resultInfo.emoji}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-2 text-[#00e5e5]">
              {resultInfo.message}
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              {resultInfo.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="text-[#00e5e5]" />
                    Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-[#00e5e5]">{percentage}%</div>
                  <p className="text-sm text-muted-foreground">
                    {score.correct} of {score.total} correct
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="text-[#00e5e5]" />
                    Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-[#00e5e5]">
                    {score.timeTaken ? formatTime(score.timeTaken) : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total time taken
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#00e5e5]/20 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="text-[#00e5e5]" />
                    Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-[#00e5e5]">
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
                <FacebookShareButton url={shareUrl} title={shareTitle}>
                  <div className="p-2 rounded-full transition-colors bg-[#00e5e5]/10 hover:bg-[#00e5e5]/20">
                    <FacebookIcon size={40} round />
                  </div>
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <div className="p-2 rounded-full transition-colors bg-[#00e5e5]/10 hover:bg-[#00e5e5]/20">
                    <TwitterIcon size={40} round />
                  </div>
                </TwitterShareButton>

                <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <div className="p-2 rounded-full transition-colors bg-[#00e5e5]/10 hover:bg-[#00e5e5]/20">
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
              className="w-full sm:w-auto border-[#00e5e5] text-[#00e5e5] hover:bg-[#00e5e5]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Puzzle
            </Button>
            <Button
              onClick={onPlayAgain}
              className="w-full sm:w-auto bg-[#00e5e5] hover:bg-[#00e5e5]/90"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </CardFooter>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00e5e5]/0 via-[#00e5e5] to-[#00e5e5]/0" />
        </div>
      </Card>
    </div>
  );
}