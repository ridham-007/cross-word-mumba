"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import PuzzleList from "@/components/PuzzleList";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <PuzzleList onSelectPuzzle={() => {}} />
        </div>
      </main>
    </ThemeProvider>
  );
}