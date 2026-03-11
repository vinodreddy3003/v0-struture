"use client";

import { useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle2, Package } from "lucide-react";
import { PartitionLevelVisualization } from "@/components/warehouse/panels/partition-level-visualization";
import type { Partition } from "@/components/warehouse/types";

interface PartitionPickingDetail {
  partition: Partition;
  pickedQuantity: number;
  availableQuantity: number;
}

export function StockOutPickingStep() {
  const {
    currentRequest,
    availableLocations,
    pickingAllocations,
    totalPickedQuantity,
    setCurrentStep,
    confirmPicking,
  } = useStockOutStore();

  const [confirmedPickings, setConfirmedPickings] = useState<Set<string>>(
    new Set()
  );

  if (!currentRequest) return null;

  // Transform available locations into partition details
  const getPickingDetails = (): PartitionPickingDetail[] => {
    return availableLocations.map((location) => {
      const allocation = pickingAllocations.find(
        (a) => a.locationId === `${location.structureId}-${location.levelId}-${location.partitionId}`
      );

      return {
        partition: {
          id: location.partitionId,
          name: location.partitionName,
          code: `${location.partitionId.substring(0, 3).toUpperCase()}`,
          width: 1,
          max_capacity: location.availableQuantity,
          used_capacity: allocation?.pickedQuantity || 0,
          product_name: currentRequest.productName,
          product_type: currentRequest.productType,
          product_uom: currentRequest.uom,
        },
        pickedQuantity: allocation?.pickedQuantity || 0,
        availableQuantity: location.availableQuantity,
      };
    });
  };

  const toggleConfirmed = (partitionId: string) => {
    const newSet = new Set(confirmedPickings);
    if (newSet.has(partitionId)) {
      newSet.delete(partitionId);
    } else {
      newSet.add(partitionId);
    }
    setConfirmedPickings(newSet);
  };

  const allConfirmed = pickingAllocations.every((a) =>
    confirmedPickings.has(a.location.partitionId)
  );

  const handleConfirmAndComplete = () => {
    // Dispatch partition updates for visual confirmation
    pickingAllocations.forEach((alloc) => {
      const event = new CustomEvent("partition-picked", {
        detail: {
          structureId: alloc.location.structureId,
          levelId: alloc.location.levelId,
          partition: {
            id: alloc.location.partitionId,
            name: alloc.location.partitionName,
            code: `${alloc.location.partitionId.substring(0, 3).toUpperCase()}`,
            width: 1,
            max_capacity: alloc.location.availableQuantity,
            used_capacity: alloc.pickedQuantity,
            product_name: currentRequest.productName,
            product_type: currentRequest.productType,
            product_uom: currentRequest.uom,
          },
        },
      });
      window.dispatchEvent(event);
    });

    confirmPicking();
  };

  const pickingDetails = getPickingDetails();
  const progressPercentage = (totalPickedQuantity / currentRequest.quantity) * 100;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Confirm Picking Order</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Confirm physical picking of stock from selected locations
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
              <p>Total Quantity: {currentRequest.quantity} {currentRequest.uom}</p>
              <p>Vendor: {currentRequest.vendor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Picking Progress */}
      <div className="space-y-2 bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Picking Progress</span>
          <span className="text-xs font-semibold text-foreground">
            {totalPickedQuantity} / {currentRequest.quantity} {currentRequest.uom}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Partition Level Visualization */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Confirm Picking from Locations</label>
        <div className="border border-border rounded-lg p-3 space-y-3 max-h-96 overflow-y-auto bg-muted/10">
          {pickingDetails.length > 0 ? (
            pickingDetails.map((detail) => (
              <div
                key={detail.partition.id}
                className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
                  confirmedPickings.has(detail.partition.id)
                    ? "border-green-500 bg-green-50"
                    : "border-border bg-background hover:bg-muted/50"
                }`}
                onClick={() => toggleConfirmed(detail.partition.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mt-1 ${
                      confirmedPickings.has(detail.partition.id)
                        ? "border-green-600 bg-green-50"
                        : "border-border bg-background"
                    }`}
                  >
                    {confirmedPickings.has(detail.partition.id) && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                  </div>

                  {/* Partition Visualization */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        Picking {detail.pickedQuantity} units from {detail.partition.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Available: {detail.availableQuantity}
                      </span>
                    </div>
                    <PartitionLevelVisualization
                      partition={detail.partition}
                      isAllocated={confirmedPickings.has(detail.partition.id)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                No locations selected. Go back to select picking locations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
        <p className="text-xs text-blue-900">
          Click on each location to confirm physical picking. Hover over partitions to see product name and quantity information.
        </p>
      </div>

      {/* Confirmation Counter */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Confirmation Progress</span>
          <span className="text-xs font-semibold text-foreground">
            {confirmedPickings.size} / {pickingAllocations.length} locations confirmed
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("zone-selection")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back to Location
        </button>
        <button
          onClick={handleConfirmAndComplete}
          disabled={!allConfirmed || pickingAllocations.length === 0}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            allConfirmed && pickingAllocations.length > 0
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
