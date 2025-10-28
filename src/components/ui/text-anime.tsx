"use client";
import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
const loadingStates = [
  {
    text: "طلب شراء منزل",
  },
  {
    text: "طلب تمويل منزل ",
  },
  {
    text: "طلب ايجار منزل",
  },
  {
    text: "مساعدة في إستثماراتك العقارية",
  }
];

export function MultiStepLoaderDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < loadingStates.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Reset to beginning after a short pause
        setTimeout(() => {
          setCurrentStep(0);
        }, 2000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="relative w-full h-96 md:h-full flex items-center justify-center bg-yel">
  <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-neutral"></div>

      <div className="space-y-4 p-8 relative z-20">
        {loadingStates.map((state, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-7 transition-all duration-500 ${
                isUpcoming ? "opacity-0" : "opacity-100"
              }`}
            >
             
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-secondary"
                    : isCurrent
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-gray-600" />
                )}
              </div>
               <span
                className={`text-right min-w-[250px] transition-all duration-300  ${
                  isCurrent
                    ? "text-primary font-extrabold text-lg lg:text-2xl"
                    : isCompleted
                    ? "text-gray-300 font-extrabold text-lg lg:text-2xl"
                    : "text-gray-500 font-extrabold text-lg lg:text-2xl"
                }`}
              >
                {state.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}