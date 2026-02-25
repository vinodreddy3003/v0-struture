"use client";

import { useStockInStore } from "@/store/stock-in-store";
import { CheckCircle2, Package } from "lucide-react";
import { useState } from "react";
import { PartitionLevelVisualization } from "@/components/warehouse/panels/partition-level-visualization";
import type { Partition } from "@/components/warehouse/types";

interface PartitionAllocationDetail {
  partition: Partition;
  allocatedQuantity: number;
}

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

  // Mock partition data - in a real app, this would come from the warehouse canvas/nodes
  const partitionData: Record<string, Partition> = {
    // This would be populated from actual warehouse data
  };

  const getPartitionDetails = (): PartitionAllocationDetail[] => {
    return allocations.map((alloc) => ({
      partition: {
        id: alloc.partitionId,
        name: alloc.partitionName,
        code: `${alloc.partitionId.substring(0, 3).toUpperCase()}`,
        width: 1,
        max_capacity: 100,
        used_capacity: 50,
        product_name: currentRequest.productName,
        product_type: currentRequest.productType,
        product_uom: currentRequest.productUOM,
      },
      allocatedQuantity: alloc.allocatedQuantity,
    }));
  };

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

  const partitionDetails = getPartitionDetails();

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

      {/* Partition Level Visualization */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Confirm Partition Placement</label>
        <div className="border border-border rounded-lg p-3 space-y-3 max-h-96 overflow-y-auto bg-muted/10">
          {partitionDetails.map((detail) => (
            <div
              key={detail.partition.id}
              className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
                confirmedAllocations.has(detail.partition.id)
                  ? "border-green-500 bg-green-50"
                  : "border-border bg-background hover:bg-muted/50"
              }`}
              onClick={() => toggleConfirmed(detail.partition.id)}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                    confirmedAllocations.has(detail.partition.id)
                      ? "border-green-600 bg-green-50"
                      : "border-border bg-background"
                  }`}
                >
                  {confirmedAllocations.has(detail.partition.id) && (
                    <CheckCircle2 size={16} className="text-green-600" />
                  )}
                </div>

                {/* Partition Visualization */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Allocating {detail.allocatedQuantity} units
                    </span>
                  </div>
                  <PartitionLevelVisualization
                    partition={detail.partition}
                    isAllocated={confirmedAllocations.has(detail.partition.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
        <p className="text-xs text-blue-900">
          Click on each partition to confirm physical placement. Hover over partitions to see product name and remaining capacity.
        </p>
      </div>

      {/* Confirmation Counter */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Confirmation Progress</span>
          <span className="text-xs font-semibold text-foreground">
            {confirmedAllocations.size} / {allocations.length} partitions confirmed
          </span>
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
