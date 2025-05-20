```tsx
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface LoadingStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function LoadingSteps({ steps, currentStep }: LoadingStepsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {steps.map((step, index) => {
          const isComplete = currentStep > index;
          const isCurrent = currentStep === index;
          const Icon = step.icon;

          return (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500",
                    isComplete && "border-[#00e5e5] bg-[#00e5e5]/10",
                    isCurrent && "border-[#00e5e5] bg-[#00e5e5]/5",
                    !isComplete && !isCurrent && "border-muted"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5 text-[#00e5e5]" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#00e5e5]" />
                  ) : (
                    <Icon className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "h-12 w-0.5 transition-colors duration-500",
                      isComplete ? "bg-[#00e5e5]" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 pb-8">
                <h3
                  className={cn(
                    "font-medium transition-colors duration-500",
                    isComplete && "text-[#00e5e5]",
                    isCurrent && "text-[#00e5e5]"
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
```