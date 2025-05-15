"use client";

import { Button } from "@/components/ui/button";
import { Backpack as Backspace } from "lucide-react";

interface CrosswordKeyboardProps {
  onKeyPress: (key: string) => void;
}

export default function CrosswordKeyboard({ onKeyPress }: CrosswordKeyboardProps) {
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];
  
  return (
    <div className="p-2 bg-card rounded-lg border border-border">
      <div className="space-y-2">
        {keys.map((row, i) => (
          <div 
            key={`row-${i}`} 
            className="flex justify-center gap-1"
            style={{ marginLeft: i * 12 }} // Offset each row to match standard keyboard layout
          >
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-10 w-8 sm:h-12 sm:w-10 p-0 text-center font-medium"
                onClick={() => onKeyPress(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1">
          <Button
            variant="outline"
            className="h-10 sm:h-12 px-3"
            onClick={() => onKeyPress(' ')}
          >
            Space
          </Button>
          <Button
            variant="outline"
            className="h-10 sm:h-12 w-10 p-0"
            onClick={() => onKeyPress('')}
          >
            <Backspace className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}