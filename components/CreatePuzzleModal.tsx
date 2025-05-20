import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Loader2, Sparkles, Wand2 } from "lucide-react";
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
    icon: Brain
  },
  {
    title: "Generating clues",
    description: "Creating engaging crossword clues and answers",
    icon: Sparkles
  },
  {
    title: "Building puzzle",
    description: "Arranging clues into a crossword layout",
    icon: Wand2
  }
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
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6 bg-[#00e5e5]/5 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00e5e5] flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Create New Puzzle
            </DialogTitle>
            <DialogDescription className="text-base">
              Enter a topic or theme and let AI generate a custom crossword puzzle for you.
            </DialogDescription>
          </DialogHeader>
        </div>

        {!isLoading ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base font-medium">
                Puzzle Topic
              </Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a puzzle about Indian culture"
                className="h-12"
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Be specific about the theme and difficulty level you want.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full sm:w-auto order-1 sm:order-2 bg-[#00e5e5] hover:bg-[#00e5e5]/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Puzzle
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <LoadingSteps steps={LOADING_STEPS} currentStep={currentStep} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}