import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CreatePuzzleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePuzzle: (puzzleData: any) => void;
}

export default function CreatePuzzleModal({ open, onOpenChange, onCreatePuzzle }: CreatePuzzleModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [clues, setClues] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse clues from textarea
    const parsedClues = clues.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [clue, answer] = line.split('|').map(str => str.trim());
        return { clue, answer: answer.toUpperCase() };
      });

    const puzzleData = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      difficulty,
      clues: parsedClues
    };

    onCreatePuzzle(puzzleData);
    onOpenChange(false);
    
    // Reset form
    setTitle("");
    setDescription("");
    setDifficulty("easy");
    setClues("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Puzzle</DialogTitle>
          <DialogDescription>
            Create your own crossword puzzle. Add clues in the format: "clue | answer" (one per line)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter puzzle title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter puzzle description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clues">Clues</Label>
            <Textarea
              id="clues"
              value={clues}
              onChange={(e) => setClues(e.target.value)}
              placeholder="Enter clues (one per line)&#10;Example:&#10;Man's best friend | DOG&#10;Domestic feline pet | CAT"
              className="min-h-[200px] font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Puzzle</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}