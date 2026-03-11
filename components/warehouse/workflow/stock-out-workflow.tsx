"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { StockOutRequestStep } from "./stock-out-request-step";
import { StockOutZoneSelectionStep } from "./stock-out-zone-selection-step";
import { StockOutPickingStep } from "./stock-out-picking-step";
import { StockOutCompletionStep } from "./stock-out-completion-step";
import { ChevronLeft } from "lucide-react";
import type { Node } from "@xyflow/react";

interface StockOutWorkflowProps {
  nodes?: Node[];
}

export function StockOutWorkflow({ nodes = [] }: StockOutWorkflowProps) {
  const { currentStep, setCurrentStep, resetWorkflow, requests } = useStockOutStore();

  // Step configuration
  const steps = [
    { key: "request", label: "Request & Approval", number: 1 },
    { key: "zone-selection", label: "Location", number: 2 },
    { key: "picking", label: "Picking", number: 3 },
    { key: "completion", label: "Completion", number: 4 },
  ] as const;

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleBack = () => {
    if (currentStep === "request") return;

    if (currentStep === "zone-selection") {
      setCurrentStep("request");
    } else if (currentStep === "picking") {
      setCurrentStep("zone-selection");
    } else if (currentStep === "completion") {
      resetWorkflow();
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Stock Out Workflow</h1>
        {currentStep !== "request" && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
      </div>

      {/* Step Progress Indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-1">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  idx <= currentStepIndex
                    ? idx === currentStepIndex
                      ? "bg-blue-600 text-white ring-2 ring-blue-300"
                      : "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 transition-all ${
                    idx < currentStepIndex ? "bg-green-600" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.key} className="flex-1">
              <p
                className={`text-xs font-medium text-center transition-colors ${
                  step.key === currentStep
                    ? "text-blue-600 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-border rounded-lg p-6 bg-background min-h-[500px]">
        {currentStep === "request" && (
          <StockOutRequestStep 
            onApprove={() => setCurrentStep("zone-selection")}
            onReject={() => {}}
          />
        )}
        {currentStep === "zone-selection" && <StockOutZoneSelectionStep nodes={nodes} />}
        {currentStep === "picking" && <StockOutPickingStep />}
        {currentStep === "completion" && <StockOutCompletionStep />}
      </div>

      {/* Request List (visible on request step) */}
      {currentStep === "request" && requests.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Previous Requests</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-3 bg-background border border-border rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{request.productName}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "approved"
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : request.status === "picking"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Type: {request.productType} | Qty: {request.quantity} {request.uom} | Vendor: {request.vendor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
