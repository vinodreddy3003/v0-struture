"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { StockOutRequestStep } from "./stock-out-request-step";
import { StockOutApprovalStep } from "./stock-out-approval-step";
import { StockOutOrderSelectionStep } from "./stock-out-order-selection-step";
import { StockOutPickingStep } from "./stock-out-picking-step";
import { StockOutCompletionStep } from "./stock-out-completion-step";
import { Stepper } from "@/components/warehouse/stepper";
import type { Node } from "@xyflow/react";

interface StockOutWorkflowProps {
  nodes: Node[];
  onPartitionUpdate?: (structureId: string, levelId: string, partition: Record<string, unknown>) => void;
}

const STEPS = [
  { id: "request", label: "Request" },
  { id: "approval", label: "Approval" },
  { id: "order-selection", label: "Order Selection" },
  { id: "picking", label: "Picking" },
  { id: "completion", label: "Completion" },
];

export function StockOutWorkflow({ nodes, onPartitionUpdate }: StockOutWorkflowProps) {
  const { currentStep } = useStockOutStore();

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Stepper */}
      <div className="px-4 pt-4">
        <Stepper
          steps={STEPS}
          currentStep={currentStepIndex}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {currentStep === "request" && <StockOutRequestStep />}
        {currentStep === "approval" && <StockOutApprovalStep />}
        {currentStep === "order-selection" && (
          <StockOutOrderSelectionStep nodes={nodes} />
        )}
        {currentStep === "picking" && (
          <StockOutPickingStep
            nodes={nodes}
            onPartitionUpdate={onPartitionUpdate}
          />
        )}
        {currentStep === "completion" && <StockOutCompletionStep />}
      </div>
    </div>
  );
}
