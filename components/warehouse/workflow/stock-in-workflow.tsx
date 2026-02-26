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
    <div className="space-y-6">
      {/* Modern Workflow Progress Indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 rounded-xl p-6">
        {/* Progress Bar Background */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center flex-1">
                {/* Step Indicator */}
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                      idx < currentStepIndex
                        ? "bg-blue-600 text-white shadow-lg scale-100"
                        : idx === currentStepIndex
                          ? "bg-blue-600 text-white shadow-lg scale-110"
                          : "bg-gray-300 text-gray-600 scale-100"
                    }`}
                  >
                    {idx < currentStepIndex ? "✓" : step.number}
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${
                      idx < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels and Current Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div
                key={`label-${step.key}`}
                className="flex-1 text-center"
              >
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    idx === currentStepIndex
                      ? "text-blue-600"
                      : idx < currentStepIndex
                        ? "text-gray-700"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Current Step Info */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-200">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-blue-600">
                {steps[currentStepIndex]?.label}
              </span>
              {" "} - {steps[currentStepIndex]?.label === "Request" && "Create new stock-in request"}
              {steps[currentStepIndex]?.label === "Vehicle" && "Enter vehicle details"}
              {steps[currentStepIndex]?.label === "Allocation" && "Allocate stock to zones"}
              {steps[currentStepIndex]?.label === "Handling" && "Select handling method"}
              {steps[currentStepIndex]?.label === "Putaway" && "Confirm putaway to warehouse"}
              {steps[currentStepIndex]?.label === "Completion" && "Complete workflow and view summary"}
            </span>
          </div>
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
