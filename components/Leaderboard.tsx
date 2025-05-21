"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Target, Medal } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  timeTaken: number;
  puzzleId: string;
  date: string;
  rank?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  puzzleId?: string;
}

export default function Leaderboard({ entries, puzzleId }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"all" | "daily" | "weekly" | "monthly">("all");

  const filteredEntries = entries
    .filter(entry => !puzzleId || entry.puzzleId === puzzleId)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTaken - b.timeTaken;
    })
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-[#00e5e5]";
      case 2:
        return "text-[#00e5e5]/90";
      case 3:
        return "text-[#00e5e5]/80";
      default:
        return "text-[#00e5e5]/70";
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "👑";
      case 2:
        return "⭐";
      case 3:
        return "✨";
      default:
        return "";
    }
  };

  return (
    <Card className="border-[#00e5e5]/20">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-[#00e5e5]">
            <Trophy className="h-6 w-6" />
            Leaderboard
          </CardTitle>
          <Tabs defaultValue={timeframe} className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2 p-2">
              <TabsTrigger 
                value="all" 
                onClick={() => setTimeframe("all")}
                className="data-[state=active]:bg-[#00e5e5]/10 data-[state=active]:text-[#00e5e5]"
              >
                All Time
              </TabsTrigger>
              <TabsTrigger 
                value="daily" 
                onClick={() => setTimeframe("daily")}
                className="data-[state=active]:bg-[#00e5e5]/10 data-[state=active]:text-[#00e5e5]"
              >
                Today
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="relative overflow-hidden rounded-lg border border-[#00e5e5]/10 bg-[#00e5e5]/5 p-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#00e5e5]/20 ${getRankColor(entry.rank!)}`}>
                      {entry.rank}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.playerName}</span>
                      <span>{getRankEmoji(entry.rank!)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-[#00e5e5]/10 pt-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#00e5e5]" />
                    <span className="font-medium">{entry.score}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#00e5e5]" />
                    <span className="font-medium">{formatTime(entry.timeTaken)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 text-[#00e5e5]/20" />
              <div>
                <p className="font-medium">No entries yet</p>
                <p className="text-sm">Be the first to complete this puzzle!</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}