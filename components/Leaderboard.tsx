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
      // First sort by score
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by time (faster time wins)
      return a.timeTaken - b.timeTaken;
    })
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-[#00e5e5]";
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <Card className="border-[#00e5e5]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-[#00e5e5]">
            <Trophy className="h-6 w-6" />
            Leaderboard
          </CardTitle>
          <Tabs defaultValue={timeframe} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" onClick={() => setTimeframe("all")}>All Time</TabsTrigger>
              <TabsTrigger value="daily" onClick={() => setTimeframe("daily")}>Daily</TabsTrigger>
              <TabsTrigger value="weekly" onClick={() => setTimeframe("weekly")}>Weekly</TabsTrigger>
              <TabsTrigger value="monthly" onClick={() => setTimeframe("monthly")}>Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-[#00e5e5]/10 bg-[#00e5e5]/5 hover:bg-[#00e5e5]/10 transition-colors"
            >
              <div className={`text-2xl font-bold ${getRankColor(entry.rank!)}`}>
                #{entry.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{entry.playerName}</span>
                  <span className="text-2xl">{getRankEmoji(entry.rank!)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-6">
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
          ))}

          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No entries yet. Be the first to complete this puzzle!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}