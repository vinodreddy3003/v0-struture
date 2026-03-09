"use client";

import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step Circle */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
              index < currentStep
                ? "border-success bg-success"
                : index === currentStep
                  ? "border-success bg-success-soft-2"
                  : "border-border bg-bg"
            }`}
          >
            {index < currentStep ? (
              <Check size={16} className="text-card-foreground" />
            ) : (
              <span
                className={`text-xs font-semibold ${
                  index === currentStep ? "text-success" : "text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="ml-2 text-xs font-medium">
            <p
              className={
                index <= currentStep ? "text-fg" : "text-muted-foreground"
              }
            >
              {step.label}
            </p>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`ml-2 flex-1 h-0.5 transition-colors ${
                index < currentStep ? "bg-success" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
