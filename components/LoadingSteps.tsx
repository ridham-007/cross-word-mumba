import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface LoadingStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function LoadingSteps({ steps, currentStep }: LoadingStepsProps) {
  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isComplete = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                    isComplete && "border-green-500 bg-green-500/20",
                    isCurrent && "border-blue-500 bg-blue-500/20",
                    !isComplete && !isCurrent && "border-muted"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "h-12 w-0.5",
                      isComplete ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 pb-8">
                <h3
                  className={cn(
                    "font-medium",
                    isComplete && "text-green-500",
                    isCurrent && "text-blue-500"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}