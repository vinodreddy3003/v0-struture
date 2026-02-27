"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { InventoryStep } from "./inventory-step";
import { LocationSelectionStep } from "./location-selection-step";
import { QuantityEntryStep } from "./quantity-entry-step";
import { StockOutCompletionStep } from "./stock-out-completion-step";
import { ManagerApprovalQueue } from "./manager-approval-queue";
import { CreateStockOutRequestForm } from "./create-stock-out-request-form";
import type { Node } from "@xyflow/react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockOutWorkflowProps {
  nodes: Node[];
  onWorkflowComplete?: (callback: (data: any) => void) => void;
  onAddRequest?: (request: any) => void;
}

export function StockOutWorkflow({
  nodes,
  onWorkflowComplete,
  onAddRequest,
}: StockOutWorkflowProps) {
  const { currentStep, completeWorkflow, currentUserRole } = useStockOutStore();
  const [activeTab, setActiveTab] = useState<"create" | "approve">("create");

  // For manager workflow - show create/approve interface
  if (currentUserRole === "manager") {
    return (
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "create" | "approve")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Request</TabsTrigger>
            <TabsTrigger value="approve">Approvals Queue</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4">
            <CreateStockOutRequestForm
              onRequestCreated={(request) => {
                onAddRequest?.(request);
                setActiveTab("approve");
              }}
            />
          </TabsContent>
          <TabsContent value="approve">
            <ManagerApprovalQueue />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // For warehouse staff - show picking workflow (existing flow)
  // Step progress indicator - 4 main steps
  const steps: Array<{ key: typeof currentStep; label: string; number: number }> = [
    { key: "inventory", label: "Inventory", number: 1 },
    { key: "select-structure", label: "Structure", number: 2 },
    { key: "quantity", label: "Quantity", number: 3 },
    { key: "completion", label: "Complete", number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleWorkflowComplete = () => {
    completeWorkflow();
    onWorkflowComplete?.((data) => {
      // Callback for warehouse updates
    });
  };

  return (
    <div className="space-y-4">
      {/* Step Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors z-10 ${
                  idx <= currentStepIndex
                    ? "bg-purple-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              {/* Step Label */}
              <span
                className={`text-xs mt-1 text-center whitespace-nowrap text-balance ${
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
                  className={`absolute h-1 top-3.5 left-1/2 transition-colors ${
                    idx < currentStepIndex ? "bg-purple-600" : "bg-muted"
                  }`}
                  style={{
                    width: "calc(100% + 8px)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="border border-border rounded-lg p-4 bg-background min-h-96">
        {currentStep === "inventory" && (
          <InventoryStep />
        )}
        {currentStep === "select-structure" && (
          <LocationSelectionStep nodes={nodes} />
        )}
        {currentStep === "quantity" && (
          <QuantityEntryStep />
        )}
        {currentStep === "completion" && (
          <StockOutCompletionStep />
        )}
      </div>
    </div>
  );
}
