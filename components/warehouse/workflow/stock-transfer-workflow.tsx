"use client";

import { useStockTransferStore } from "@/store/stock-transfer-store";
import { StockTransferRequestStep } from "./stock-transfer-request-step";
import { SourceSelectionStep } from "./source-selection-step";
import { DestinationSelectionStep } from "./destination-selection-step";
import { ConfirmationStep } from "./confirmation-step";
import { StockTransferCompletionStep } from "./stock-transfer-completion-step";
import type { Node } from "@xyflow/react";
import type { StockTransferRequest } from "@/components/warehouse/types";

interface StockTransferWorkflowProps {
  nodes: Node[];
  onWorkflowComplete?: (callback: (transfer: any) => void) => void;
  onAddRequest?: (request: Omit<StockTransferRequest, "id" | "status" | "transfers">) => void;
}

export function StockTransferWorkflow({
  nodes,
  onWorkflowComplete,
  onAddRequest,
}: StockTransferWorkflowProps) {
  const { currentStep, addRequest, completeWorkflow } = useStockTransferStore();

  const handleAddRequest = (request: Omit<StockTransferRequest, "id" | "status" | "transfers">) => {
    const newRequest: StockTransferRequest = {
      id: `stock-transfer-${Date.now()}`,
      status: "pending",
      transfers: [],
      ...request,
    };
    addRequest(newRequest);
    onAddRequest?.(request);
  };

  const handleWorkflowComplete = () => {
    completeWorkflow((transfer) => {
      onWorkflowComplete?.((transfer) => {
        // Transfer update callback will be passed to canvas
      });
    });
  };

  // Step progress indicator
  const steps: Array<{ key: typeof currentStep; label: string; number: number }> = [
    { key: "request", label: "Request", number: 1 },
    { key: "source-selection", label: "Source", number: 2 },
    { key: "destination-selection", label: "Destination", number: 3 },
    { key: "confirmation", label: "Confirm", number: 4 },
    { key: "completion", label: "Complete", number: 5 },
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
                    ? "bg-indigo-600 text-white"
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
                    idx < currentStepIndex ? "bg-indigo-600" : "bg-muted"
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
          <StockTransferRequestStep onAddRequest={handleAddRequest} />
        )}
        {currentStep === "source-selection" && <SourceSelectionStep nodes={nodes} />}
        {currentStep === "destination-selection" && <DestinationSelectionStep nodes={nodes} />}
        {currentStep === "confirmation" && <ConfirmationStep />}
        {currentStep === "completion" && (
          <StockTransferCompletionStep onWorkflowComplete={handleWorkflowComplete} />
        )}
      </div>
    </div>
  );
}
