"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle2, Package } from "lucide-react";
import { useState } from "react";
import type { StockOutRequest } from "@/components/warehouse/types";

export function VerificationStep() {
  const {
    currentRequestId,
    requests,
    picks,
    completeWorkflow,
    setCurrentStep,
  } = useStockOutStore();

  const [verifiedPicks, setVerifiedPicks] = useState<Set<string>>(new Set());

  const currentRequest = requests.find(
    (r) => r.id === currentRequestId
  ) as StockOutRequest | undefined;
  if (!currentRequest) return null;

  const toggleVerified = (partitionId: string) => {
    const newSet = new Set(verifiedPicks);
    if (newSet.has(partitionId)) {
      newSet.delete(partitionId);
    } else {
      newSet.add(partitionId);
    }
    setVerifiedPicks(newSet);
  };

  const allVerified = picks.every((p) => verifiedPicks.has(p.partitionId));
  const totalPickedQuantity = picks.reduce((sum, p) => sum + p.pickedQuantity, 0);

  const handleConfirmAndComplete = () => {
    // Dispatch partition updates to warehouse canvas to visually update
    picks.forEach((pick) => {
      const event = new CustomEvent("partition-updated-stockout", {
        detail: {
          structureId: pick.structureId,
          levelId: pick.levelId,
          partitionId: pick.partitionId,
          pickedQuantity: pick.pickedQuantity,
          productName: currentRequest.productName,
        },
      });
      window.dispatchEvent(event);
    });

    completeWorkflow();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Pick Verification</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Verify all picked items match the order requirements
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
              <p>Total Required: {currentRequest.quantity} {currentRequest.productUOM}</p>
              <p>Total Picked: {totalPickedQuantity} {currentRequest.productUOM}</p>
              <p>Customer: {currentRequest.customer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Fulfillment Status */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Order Fulfillment</span>
          <span className="text-xs font-semibold text-foreground">
            {totalPickedQuantity} / {currentRequest.quantity}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              totalPickedQuantity === currentRequest.quantity
                ? "bg-green-600"
                : totalPickedQuantity > 0
                  ? "bg-amber-600"
                  : "bg-red-600"
            }`}
            style={{
              width: `${(totalPickedQuantity / currentRequest.quantity) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Picked Items Verification */}
      <div className="border border-border rounded-lg p-3 space-y-3 max-h-80 overflow-y-auto bg-muted/10">
        <label className="text-xs font-medium text-foreground block">
          Verify Each Pick
        </label>
        {picks.map((pick) => (
          <div
            key={pick.partitionId}
            className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
              verifiedPicks.has(pick.partitionId)
                ? "border-green-500 bg-green-50"
                : "border-border bg-background hover:bg-muted/50"
            }`}
            onClick={() => toggleVerified(pick.partitionId)}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                  verifiedPicks.has(pick.partitionId)
                    ? "border-green-600 bg-green-50"
                    : "border-border bg-background"
                }`}
              >
                {verifiedPicks.has(pick.partitionId) && (
                  <CheckCircle2 size={16} className="text-green-600" />
                )}
              </div>

              {/* Pick Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {pick.partitionName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Location: Level {pick.levelId.split("-")[1]}, Partition {pick.partitionName}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Picked Quantity:</span>
                    <span className="text-xs font-bold text-foreground">
                      {pick.pickedQuantity} {currentRequest.productUOM}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Message */}
      <div
        className={`border-l-4 p-3 rounded ${
          totalPickedQuantity === currentRequest.quantity
            ? "border-green-500 bg-green-50"
            : "border-amber-500 bg-amber-50"
        }`}
      >
        <p
          className={`text-xs ${
            totalPickedQuantity === currentRequest.quantity
              ? "text-green-900"
              : "text-amber-900"
          }`}
        >
          {totalPickedQuantity === currentRequest.quantity
            ? "✓ All items picked correctly. Ready to complete order."
            : `⚠ Order partially fulfilled. ${currentRequest.quantity - totalPickedQuantity} units still needed.`}
        </p>
      </div>

      {/* Verification Counter */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            Verification Progress
          </span>
          <span className="text-xs font-semibold text-foreground">
            {verifiedPicks.size} / {picks.length} items verified
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("picking")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back to Picking
        </button>
        <button
          onClick={handleConfirmAndComplete}
          disabled={!allVerified || totalPickedQuantity !== currentRequest.quantity}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            allVerified && totalPickedQuantity === currentRequest.quantity
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Complete Order
        </button>
      </div>
    </div>
  );
}
