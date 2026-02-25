"use client";

import { type Node } from "@xyflow/react";
import { ChevronLeft, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { useStockInStore } from "@/store/stock-in-store";
import type { StructureData } from "@/components/warehouse/types";

interface StockInAssignmentFlowProps {
  nodes: Node[];
  zoneNodes: Node[];
  onAllocationsDone?: () => void;
}

export function StockInAssignmentFlow({
  nodes,
  zoneNodes,
  onAllocationsDone,
}: StockInAssignmentFlowProps) {
  const {
    currentAssignmentStep,
    currentRequestId,
    selectedZoneId,
    selectedAllocationStructureId,
    selectedAllocationPartitions,
    remainingQuantity,
    requests,
    selectZone,
    selectAllocationStructure,
    setAssignmentStep,
    cancelAssignment,
    confirmAllocations,
  } = useStockInStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  // Get structures for selected zone or all structures
  const getStructuresForZone = () => {
    if (selectedZoneId) {
      return nodes.filter(
        (n) =>
          n.type === "structure" &&
          (n.data as Record<string, unknown>).zoneId === selectedZoneId
      ) as Node<StructureData>[];
    }
    return nodes.filter((n) => n.type === "structure") as Node<StructureData>[];
  };

  const structures = getStructuresForZone();

  return (
    <div className="space-y-3">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
        <div className="text-xs">
          <p className="font-semibold text-blue-900">{currentRequest.productName}</p>
          <p className="text-blue-700">Qty: {currentRequest.quantity} {currentRequest.productUOM}</p>
        </div>
        <div className="text-right text-xs">
          <p className="text-blue-700 font-medium">Remaining: {remainingQuantity} units</p>
          <div className="w-24 h-2 bg-blue-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${((currentRequest.quantity - remainingQuantity) / currentRequest.quantity) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Zone Selection Step */}
      {currentAssignmentStep === "zone-select" && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Select Zone (Optional)</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            <button
              onClick={() => {
                selectZone(null);
                setAssignmentStep("structure-select");
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedZoneId === null
                  ? "bg-blue-600 text-white"
                  : "border border-border hover:bg-muted bg-background"
              }`}
            >
              All Zones (Warehouse)
            </button>
            {zoneNodes.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  selectZone(zone.id);
                  setAssignmentStep("structure-select");
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedZoneId === zone.id
                    ? "bg-blue-600 text-white"
                    : "border border-border hover:bg-muted bg-background"
                }`}
              >
                <p className="font-medium">{(zone.data as Record<string, unknown>).label}</p>
                <p className="text-xs opacity-70">
                  {structures.filter((s) => (s.data as Record<string, unknown>).zoneId === zone.id).length} structures
                </p>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={cancelAssignment}
              className="flex-1 px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Structure Selection Step */}
      {currentAssignmentStep === "structure-select" && (
        <div className="space-y-2">
          <button
            onClick={() => setAssignmentStep("zone-select")}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mb-1"
          >
            <ChevronLeft size={14} />
            Back to Zone Selection
          </button>
          <h3 className="text-sm font-semibold text-foreground">Select Structure</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {structures.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-xs">
                No structures in this zone
              </div>
            ) : (
              structures.map((struct) => (
                <button
                  key={struct.id}
                  onClick={() => {
                    selectAllocationStructure(struct.id);
                    setAssignmentStep("partition-select");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedAllocationStructureId === struct.id
                      ? "bg-blue-600 text-white"
                      : "border border-border hover:bg-muted bg-background"
                  }`}
                >
                  <p className="font-medium">{(struct.data as Record<string, unknown>).label}</p>
                  <p className="text-xs opacity-70">
                    {((struct.data as StructureData).levels || []).length} levels
                  </p>
                </button>
              ))
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={cancelAssignment}
              className="flex-1 px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Partition Selection Step */}
      {currentAssignmentStep === "partition-select" && selectedAllocationStructureId && (
        <div className="space-y-2">
          <button
            onClick={() => setAssignmentStep("structure-select")}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mb-1"
          >
            <ChevronLeft size={14} />
            Back to Structure Selection
          </button>
          <h3 className="text-sm font-semibold text-foreground">Select & Allocate Partitions</h3>
          <div className="text-xs text-muted-foreground mb-2">
            Click partitions to allocate stock. You can spread across multiple partitions.
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto border border-border rounded-md p-2 bg-muted/20">
            {/* Render partition selector here - will be implemented in next component */}
            <div className="text-xs text-muted-foreground text-center py-4">
              Partition selector component will be rendered here
            </div>
          </div>

          {/* Current Allocations */}
          {selectedAllocationPartitions.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2">
              <p className="text-xs font-semibold text-green-900 mb-2">Current Allocations ({selectedAllocationPartitions.length})</p>
              <div className="space-y-1">
                {selectedAllocationPartitions.map((allocation, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded px-2 py-1 text-xs">
                    <span className="text-foreground">Partition {idx + 1}: {allocation.allocatedQuantity} units</span>
                    <button
                      onClick={() => {
                        // Remove allocation
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 pt-2 border-t border-green-200">
                <button
                  onClick={confirmAllocations}
                  disabled={remainingQuantity > 0}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    remainingQuantity > 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Confirm Allocations
                </button>
                <button
                  onClick={cancelAssignment}
                  className="flex-1 px-3 py-1.5 text-xs font-medium border border-border hover:bg-muted rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {selectedAllocationPartitions.length === 0 && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Select at least one partition to continue</span>
            </div>
          )}
        </div>
      )}

      {/* Review/Confirmation */}
      {currentAssignmentStep === "review" && (
        <div className="space-y-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Ready to confirm allocations</p>
              <p className="text-xs text-emerald-700 mt-1">
                {selectedAllocationPartitions.length} partitions selected with {currentRequest.quantity - remainingQuantity} units allocated.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmAllocations}
              className="flex-1 px-3 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              Confirm & Complete
            </button>
            <button
              onClick={cancelAssignment}
              className="flex-1 px-3 py-2 text-sm font-medium border border-border hover:bg-muted rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
