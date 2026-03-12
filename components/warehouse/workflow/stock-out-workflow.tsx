"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { StockOutRequestStep } from "./stock-out-request-step";
import { ProductSelectionStep } from "./product-selection-step";
import { PickingStep } from "./picking-step";
import { StockOutCompletionStep } from "./stock-out-completion-step";
import type { Node } from "@xyflow/react";
import type { StockOutRequest } from "@/components/warehouse/types";

interface StockOutWorkflowProps {
  nodes: Node[];
  onWorkflowComplete?: (callback: (picking: any) => void) => void;
  onAddRequest?: (request: Omit<StockOutRequest, "id" | "status" | "pickingDetails">) => void;
}

export function StockOutWorkflow({
  nodes,
  onWorkflowComplete,
  onAddRequest,
}: StockOutWorkflowProps) {
  const { currentStep, addRequest, completeWorkflow } = useStockOutStore();

  const handleAddRequest = (request: Omit<StockOutRequest, "id" | "status" | "pickingDetails">) => {
    const newRequest: StockOutRequest = {
      id: `stock-out-${Date.now()}`,
      status: "pending",
      pickingDetails: [],
      ...request,
    };
    addRequest(newRequest);
    onAddRequest?.(request);
  };

  const handleWorkflowComplete = () => {
    completeWorkflow((picking) => {
      // This callback will be called for each picking detail to update warehouse
      onWorkflowComplete?.((picking) => {
        // Partition update callback will be passed to canvas
      });
    });
  };

  // Step progress indicator
  const steps: Array<{ key: typeof currentStep; label: string; number: number }> = [
    { key: "request", label: "Request", number: 1 },
    { key: "product-selection", label: "Selection", number: 2 },
    { key: "picking", label: "Picking", number: 3 },
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
                    ? "bg-amber-600 text-white"
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
                    idx < currentStepIndex ? "bg-amber-600" : "bg-muted"
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
          <StockOutRequestStep onAddRequest={handleAddRequest} />
        )}
        {currentStep === "product-selection" && <ProductSelectionStep nodes={nodes} />}
        {currentStep === "picking" && <PickingStep nodes={nodes} />}
        {currentStep === "completion" && (
          <StockOutCompletionStep onWorkflowComplete={handleWorkflowComplete} />
        )}
      </div>
    </div>
  );
}
