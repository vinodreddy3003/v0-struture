"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { StructureData, Partition } from "@/components/warehouse/types";

interface StockOutCompletionStepProps {
  nodes?: Node[];
  onWorkflowComplete?: () => void;
}

export function StockOutCompletionStep({
  nodes = [],
  onWorkflowComplete,
}: StockOutCompletionStepProps) {
  const { currentRequestId, requests, pickingDetails, resetWorkflow, completeWorkflow } = useStockOutStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const handleDispatchWarehouseUpdates = () => {
    pickingDetails.forEach((picking) => {
      const structure = nodes.find((n) => n.id === picking.structureId) as Node<StructureData> | undefined;
      if (!structure) {
        console.warn(`[v0] Structure ${picking.structureId} not found`);
        return;
      }

      const level = structure.data.levels?.find((l) => l.id === picking.levelId);
      if (!level) {
        console.warn(`[v0] Level ${picking.levelId} not found in structure ${picking.structureId}`);
        return;
      }

      const partition = level.partitions?.find((p) => p.id === picking.partitionId);
      if (!partition) {
        console.warn(`[v0] Partition ${picking.partitionId} not found`);
        return;
      }

      const updatedPartition: Partition = {
        ...partition,
        used_capacity: Math.max(0, (partition.used_capacity || 0) - picking.pickedQuantity),
      };

      console.log("[v0] Dispatching partition-updated event:", {
        structureId: picking.structureId,
        levelId: picking.levelId,
        oldCapacity: partition.used_capacity,
        pickedQuantity: picking.pickedQuantity,
        newCapacity: updatedPartition.used_capacity,
      });

      const event = new CustomEvent("partition-updated", {
        detail: {
          structureId: picking.structureId,
          levelId: picking.levelId,
          partition: updatedPartition,
        },
      });
      window.dispatchEvent(event);
    });

    completeWorkflow();
    onWorkflowComplete?.();
  };

  const handleNewWorkflow = () => {
    resetWorkflow();
  };

  const totalPicked = pickingDetails.reduce(
    (sum, p) => sum + p.pickedQuantity,
    0
  );

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="text-green-600" size={24} />
          <h3 className="text-sm font-semibold text-foreground">
            Stock Out Completed
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Stock has been picked and warehouse inventory updated
        </p>
      </div>

      {/* Completion Summary */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
        {/* Request Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">Request Details</h4>
          <div className="bg-white rounded p-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium text-foreground">
                {currentRequest.productName}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Requested By:</span>
              <span className="font-medium text-foreground">
                {currentRequest.requestedBy}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Requested Quantity:</span>
              <span className="font-medium text-foreground">
                {currentRequest.quantity} units
              </span>
            </div>
            {currentRequest.notes && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Notes:</span>
                <span className="font-medium text-foreground">
                  {currentRequest.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Picking Details */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">
            Picked Locations ({pickingDetails.length})
          </h4>
          <div className="bg-white rounded p-2 space-y-1 max-h-40 overflow-y-auto">
            {pickingDetails.map((picking, idx) => (
              <div
                key={picking.partitionId}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">
                  {idx + 1}. {picking.partitionName}
                </span>
                <span className="font-medium text-foreground">
                  {picking.pickedQuantity} units
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-1 mt-1 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total Picked:</span>
              <span className="font-bold text-green-700">{totalPicked} units</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Request Status:</span>
            <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">
              COMPLETED
            </span>
          </div>
        </div>
      </div>

      {/* Warehouse Update Confirmation */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          Partition quantities have been automatically updated in the warehouse
          layout. The inventory changes are now visible in the canvas.
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-foreground">Next Steps</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Verify warehouse partition quantities updated correctly
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Process additional stock out requests if needed
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Generate reports for completed transactions
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={handleDispatchWarehouseUpdates}
          className="flex-1 px-4 py-2 text-sm font-semibold rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Update Warehouse & Finish
        </button>
        <button
          onClick={handleNewWorkflow}
          className="flex-1 px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          New Stock Out Request
        </button>
      </div>
    </div>
  );
}
