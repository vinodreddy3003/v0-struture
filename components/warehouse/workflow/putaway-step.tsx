"use client";

import { useStockInStore } from "@/store/stock-in-store";
import { CheckCircle2, Package } from "lucide-react";
import { useState } from "react";

export function PutawayStep() {
  const {
    currentRequestId,
    requests,
    allocations,
    completeWorkflow,
    setCurrentStep,
  } = useStockInStore();

  const [confirmedAllocations, setConfirmedAllocations] = useState<Set<string>>(
    new Set()
  );

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const toggleConfirmed = (partitionId: string) => {
    const newSet = new Set(confirmedAllocations);
    if (newSet.has(partitionId)) {
      newSet.delete(partitionId);
    } else {
      newSet.add(partitionId);
    }
    setConfirmedAllocations(newSet);
  };

  const allConfirmed = allocations.every((a) =>
    confirmedAllocations.has(a.partitionId)
  );

  const handleConfirmAndComplete = () => {
    completeWorkflow();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Physical Putaway Confirmation</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Confirm physical placement of stock in allocated partitions
        </p>
      </div>

      {/* Product Info */}
      <div className="border border-border rounded-lg p-3 bg-muted/30">
        <div className="flex items-start gap-3">
          <Package className="text-blue-600 mt-1 flex-shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {currentRequest.productName}
            </p>
            <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
              <p>Type: {currentRequest.productType}</p>
              <p>Total Quantity: {currentRequest.quantity} {currentRequest.productUOM}</p>
              <p>Vendor: {currentRequest.vendor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Putaway Checklist */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Confirm Placement</label>
        <div className="border border-border rounded-lg divide-y">
          {allocations.map((alloc) => (
            <div
              key={alloc.partitionId}
              className="p-3 hover:bg-muted/30 transition-colors"
            >
              <button
                onClick={() => toggleConfirmed(alloc.partitionId)}
                className="w-full flex items-start gap-3 text-left"
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    confirmedAllocations.has(alloc.partitionId)
                      ? "border-green-600 bg-green-50"
                      : "border-border bg-background"
                  }`}
                >
                  {confirmedAllocations.has(alloc.partitionId) && (
                    <CheckCircle2 size={16} className="text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {alloc.partitionName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Placing {alloc.allocatedQuantity} units
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
        <p className="text-xs text-blue-900">
          Verify that all items have been physically placed in their allocated partitions
          before proceeding to completion.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Confirmation Progress</span>
          <span className="text-xs font-semibold text-foreground">
            {confirmedAllocations.size} / {allocations.length}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 transition-all"
            style={{
              width: `${(confirmedAllocations.size / allocations.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("allocation")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back to Allocation
        </button>
        <button
          onClick={handleConfirmAndComplete}
          disabled={!allConfirmed}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            allConfirmed
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Confirm & Complete
        </button>
      </div>
    </div>
  );
}
