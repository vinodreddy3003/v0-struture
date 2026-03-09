"use client";

import { useEffect, useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { Node } from "@xyflow/react";

interface StockOutPickingStepProps {
  nodes: Node[];
  onPartitionUpdate?: (structureId: string, levelId: string, partition: Record<string, unknown>) => void;
}

export function StockOutPickingStep({
  nodes,
  onPartitionUpdate,
}: StockOutPickingStepProps) {
  const {
    currentRequestId,
    requests,
    selectedPickingDetail,
    pickedQuantity,
    pickingHistory,
    setPickedQuantity,
    confirmPicking,
    completeWorkflow,
    addPickingHistory,
    updateRequest,
  } = useStockOutStore();

  const currentRequest = currentRequestId
    ? requests.find((r) => r.id === currentRequestId)
    : null;

  const [confirmQuantity, setConfirmQuantity] = useState<number | "">("");
  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (selectedPickingDetail) {
      setConfirmQuantity(selectedPickingDetail.pickedQuantity || "");
    }
  }, [selectedPickingDetail]);

  const handleConfirmPicking = () => {
    const quantity = typeof confirmQuantity === "number" ? confirmQuantity : parseInt(confirmQuantity as string);

    // Validation
    if (!confirmQuantity || quantity <= 0) {
      setErrors("Please enter a valid quantity");
      return;
    }

    if (!currentRequest) {
      setErrors("No active request");
      return;
    }

    if (
      selectedPickingDetail &&
      quantity > selectedPickingDetail.availableQuantity
    ) {
      setErrors(
        `Cannot pick more than available quantity (${selectedPickingDetail.availableQuantity})`
      );
      return;
    }

    if (quantity > currentRequest.quantity) {
      setErrors(
        `Cannot pick more than requested quantity (${currentRequest.quantity})`
      );
      return;
    }

    setPickedQuantity(quantity);

    // Add picking to history
    if (selectedPickingDetail) {
      addPickingHistory(
        selectedPickingDetail.partitionId,
        selectedPickingDetail.partitionName,
        quantity
      );
    }

    // Update partition inventory - reduce available quantity by picked amount
    if (selectedPickingDetail && onPartitionUpdate) {
      const structureNode = nodes.find(
        (n) => n.id === selectedPickingDetail.structureId
      );
      if (structureNode) {
        // Calculate new used capacity after picking
        const newUsedCapacity = selectedPickingDetail.availableQuantity - (selectedPickingDetail.availableQuantity - quantity);

        const partitionData = {
          id: selectedPickingDetail.partitionId,
          name: selectedPickingDetail.partitionName,
          used_capacity: newUsedCapacity,
          max_capacity: selectedPickingDetail.availableQuantity + newUsedCapacity,
          product_quantity: quantity, // Track actual product quantity picked
        };

        onPartitionUpdate(
          selectedPickingDetail.structureId,
          selectedPickingDetail.levelId,
          partitionData
        );
      }
    }

    // Update request with picking details and new status
    if (currentRequestId) {
      updateRequest(currentRequestId, {
        status: "completed",
        pickingDetails: selectedPickingDetail,
      });
    }

    completeWorkflow();
  };

  if (!currentRequest || !selectedPickingDetail) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
        <AlertCircle size={16} className="text-yellow-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">Missing picking information</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Location Display */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Picking Location</h3>

        {/* Zone */}
        <div className="bg-muted/50 p-3 rounded space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Zone</p>
          <p className="text-sm font-semibold">{selectedPickingDetail.zoneName}</p>
          <p className="text-xs text-muted-foreground">
            {selectedPickingDetail.zoneType}
          </p>
        </div>

        {/* Structure */}
        <div className="bg-muted/50 p-3 rounded space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Rack/Shelf (Structure)
          </p>
          <p className="text-sm font-semibold">{selectedPickingDetail.structureName}</p>
        </div>

        {/* Level */}
        <div className="bg-muted/50 p-3 rounded space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Level</p>
          <p className="text-sm font-semibold">{selectedPickingDetail.levelName}</p>
        </div>

        {/* Partition */}
        <div className="bg-muted/50 p-3 rounded space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Position (Partition)</p>
          <p className="text-sm font-semibold">{selectedPickingDetail.partitionName}</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Product Information</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Product Name</p>
            <p className="font-medium">{currentRequest.productName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Type</p>
            <p className="font-medium">{currentRequest.productType}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">UOM</p>
            <p className="font-medium">{currentRequest.productUOM}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Order Reference</p>
            <p className="font-medium">{currentRequest.orderReference}</p>
          </div>
        </div>
      </div>

      {/* Stock Verification */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Stock Verification</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted/50 p-3 rounded">
            <p className="text-muted-foreground text-xs font-medium mb-1">Requested Quantity</p>
            <p className="font-semibold text-base">{currentRequest.quantity} {currentRequest.productUOM}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
            <p className="text-emerald-900 text-xs font-medium mb-1">Product Available</p>
            <p className="font-semibold text-base text-emerald-700">
              {selectedPickingDetail.availableQuantity} {selectedPickingDetail.productUom}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-900">
          <p className="font-medium mb-1">{selectedPickingDetail.productName}</p>
          <p className="text-xs">Type: {selectedPickingDetail.productType} • UOM: {selectedPickingDetail.productUom}</p>
        </div>

        {selectedPickingDetail.availableQuantity < currentRequest.quantity && (
          <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <p>
              Only {selectedPickingDetail.availableQuantity} {selectedPickingDetail.productUom} available. You can pick partial quantity.
            </p>
          </div>
        )}
      </div>

      {/* Picking Confirmation */}
      <div className="p-4 border rounded-lg bg-card space-y-4">
        <h3 className="text-sm font-semibold">Confirm Picking</h3>

        <div className="space-y-2">
          <Label htmlFor="pickedQuantity" className="text-sm font-medium">
            Quantity Picked *
          </Label>
          <Input
            id="pickedQuantity"
            type="number"
            min="0"
            max={Math.min(
              selectedPickingDetail.availableQuantity,
              currentRequest.quantity
            )}
            placeholder="Enter quantity picked"
            value={confirmQuantity}
            onChange={(e) => {
              setConfirmQuantity(e.target.value ? parseInt(e.target.value) : "");
              setErrors("");
            }}
            className={errors ? "border-red-500" : ""}
          />
          {errors && <p className="text-xs text-red-500">{errors}</p>}
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
          <p>
            Confirm that you have picked{" "}
            <span className="font-semibold">{confirmQuantity || "?"}</span>{" "}
            {currentRequest.productUOM} of {currentRequest.productName} from the
            selected location.
          </p>
        </div>

        <Button
          onClick={handleConfirmPicking}
          disabled={!confirmQuantity || (typeof confirmQuantity === "number" && confirmQuantity <= 0)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <CheckCircle2 size={16} className="mr-2" />
          Confirm Picking
        </Button>
      </div>
    </div>
  );
}
