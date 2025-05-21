import { ThemeProvider } from "@/components/ThemeProvider";
import Leaderboard from "@/components/Leaderboard";

// This would normally come from your database
const mockEntries = [
  {
    id: "1",
    playerName: "CrosswordMaster",
    score: 100,
    timeTaken: 300,
    puzzleId: "animals",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    playerName: "PuzzleKing",
    score: 95,
    timeTaken: 400,
    puzzleId: "animals",
    date: new Date().toISOString(),
  },
  {
    id: "3",
    playerName: "WordGenius",
    score: 90,
    timeTaken: 350,
    puzzleId: "animals",
    date: new Date().toISOString(),
  },
];

export default function LeaderboardPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-[#00e5e5] text-center mb-8">Global Rankings</h1>
            <Leaderboard entries={mockEntries} />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}