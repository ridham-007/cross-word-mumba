import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import LoadingSteps from "./LoadingSteps";

interface CreatePuzzleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePuzzle: (puzzleData: any) => void;
}

const LOADING_STEPS = [
  {
    title: "Analyzing prompt",
    description: "Processing your request and understanding the theme",
  },
  {
    title: "Generating clues",
    description: "Creating engaging crossword clues and answers",
  },
  {
    title: "Building puzzle",
    description: "Arranging clues into a crossword layout",
  },
  {
    title: "Finalizing",
    description: "Preparing the puzzle for you to solve",
  },
];

export default function CreatePuzzleModal({ open, onOpenChange, onCreatePuzzle }: CreatePuzzleModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentStep(0);

    try {
      // Step 1: Analyzing prompt
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(1);

      // Step 2: Generating clues
      const response = await fetch('/api/generate-puzzle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate puzzle');
      }

      // Step 3: Building puzzle
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const puzzleData = await response.json();

      // Step 4: Finalizing
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 500));

      onCreatePuzzle(puzzleData);
      onOpenChange(false);
      setPrompt("");
    } catch (error) {
      console.error('Error generating puzzle:', error);
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Puzzle</DialogTitle>
          <DialogDescription>
            Enter a topic or theme for your crossword puzzle and we'll generate it for you.
          </DialogDescription>
        </DialogHeader>

        {!isLoading ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Puzzle Topic</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a puzzle about Indian culture"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !prompt.trim()}
              >
                Create Puzzle
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-6">
            <LoadingSteps steps={LOADING_STEPS} currentStep={currentStep} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}