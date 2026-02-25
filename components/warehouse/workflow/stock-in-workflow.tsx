"use client";

import { useStockInStore } from "@/store/stock-in-store";
import { StockInRequestStep } from "./stock-in-request-step";
import { AllocationStep } from "./allocation-step";
import { PutawayStep } from "./putaway-step";
import { CompletionStep } from "./completion-step";
import type { Node } from "@xyflow/react";
import type { StockInRequest } from "@/components/warehouse/types";

interface StockInWorkflowProps {
  nodes: Node[];
  onWorkflowComplete?: (callback: (allocation: any) => void) => void;
  onAddRequest?: (request: Omit<StockInRequest, "id" | "status" | "allocations">) => void;
}

export function StockInWorkflow({
  nodes,
  onWorkflowComplete,
  onAddRequest,
}: StockInWorkflowProps) {
  const { currentStep, addRequest, completeWorkflow } = useStockInStore();

  const handleAddRequest = (request: Omit<StockInRequest, "id" | "status" | "allocations">) => {
    const newRequest: StockInRequest = {
      id: `req-${Date.now()}`,
      status: "pending",
      allocations: [],
      ...request,
    };
    addRequest(newRequest);
    onAddRequest?.(request);
  };

  const handleWorkflowComplete = () => {
    completeWorkflow((allocation) => {
      // This callback will be called for each allocation to update warehouse
      onWorkflowComplete?.((allocation) => {
        // Partition update callback will be passed to canvas
      });
    });
  };

  // Step progress indicator
  const steps: Array<{ key: typeof currentStep; label: string; number: number }> = [
    { key: "request", label: "Request", number: 1 },
    { key: "allocation", label: "Allocation", number: 2 },
    { key: "putaway", label: "Putaway", number: 3 },
    { key: "completion", label: "Completion", number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="space-y-4">
      {/* Step Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                  idx <= currentStepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              {/* Step Label */}
              <span
                className={`text-xs mt-1 text-center ${
                  idx === currentStepIndex
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-1 w-full mt-1 transition-colors ${
                    idx < currentStepIndex ? "bg-blue-600" : "bg-muted"
                  }`}
                  style={{
                    width: "calc(100% + 8px)",
                    marginLeft: 4,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-border rounded-lg p-4 bg-background">
        {currentStep === "request" && (
          <StockInRequestStep onAddRequest={handleAddRequest} />
        )}
        {currentStep === "allocation" && <AllocationStep nodes={nodes} />}
        {currentStep === "putaway" && <PutawayStep />}
        {currentStep === "completion" && (
          <CompletionStep onWorkflowComplete={handleWorkflowComplete} />
        )}
      </div>
    </div>
  );
}
