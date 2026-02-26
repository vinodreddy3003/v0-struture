"use client";

import { useStockInStore } from "@/store/stock-in-store";
import { StockInRequestStep } from "./stock-in-request-step";
import { VehicleInfoStep } from "./vehicle-info-step";
import { AllocationStep } from "./allocation-step";
import { PutawayStep } from "./putaway-step";
import { HandlingMethodStep } from "./handling-method-step";
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
    { key: "vehicle", label: "Vehicle", number: 2 },
    { key: "allocation", label: "Allocation", number: 3 },
    { key: "handling", label: "Handling", number: 4 },
    { key: "putaway", label: "Putaway", number: 5 },
    { key: "completion", label: "Completion", number: 6 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="space-y-4">
      {/* Step Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all shrink-0 ${
                  idx < currentStepIndex
                    ? "bg-blue-600 text-white shadow-md"
                    : idx === currentStepIndex
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number}
              </div>
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 transition-all ${
                    idx < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex items-center gap-1">
          {steps.map((step, idx) => (
            <div key={`label-${step.key}`} className="flex-1 text-center px-1">
              <span
                className={`text-xs font-medium transition-colors ${
                  idx <= currentStepIndex
                    ? idx === currentStepIndex
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-border rounded-lg p-4 bg-background">
        {currentStep === "request" && (
          <StockInRequestStep onAddRequest={handleAddRequest} />
        )}
        {currentStep === "vehicle" && <VehicleInfoStep />}
        {currentStep === "allocation" && <AllocationStep nodes={nodes} />}
        {currentStep === "handling" && <HandlingMethodStep />}
        {currentStep === "putaway" && <PutawayStep />}
        {currentStep === "completion" && (
          <CompletionStep onWorkflowComplete={handleWorkflowComplete} />
        )}
      </div>
    </div>
  );
}
