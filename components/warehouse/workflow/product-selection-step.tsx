"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import type { Node } from "@xyflow/react";
import type { StructureData } from "@/components/warehouse/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductSelectionStepProps {
  nodes: Node[];
}

interface ProductInventory {
  productName: string;
  totalAvailable: number;
  locations: Array<{
    structureId: string;
    levelId: string;
    partitionId: string;
    partitionName: string;
    quantity: number;
  }>;
}

export function ProductSelectionStep({ nodes }: ProductSelectionStepProps) {
  const {
    currentRequestId,
    requests,
    selectedProductName,
    selectedQuantity,
    setCurrentStep,
    selectProduct,
  } = useStockOutStore();

  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [confirmQuantity, setConfirmQuantity] = useState(selectedQuantity.toString());

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  // Mock product inventory - in a real app, this would come from warehouse data
  const getProductInventory = (): ProductInventory => {
    // Simulate inventory by creating partition data from nodes
    const structures = nodes.filter((n) => n.type === "structure") as Node<StructureData>[];
    const locations: ProductInventory["locations"] = [];
    let totalAvailable = 0;

    structures.forEach((structure) => {
      const data = structure.data as StructureData;
      data.levels.forEach((level) => {
        level.partitions.forEach((partition) => {
          const available = partition.used_capacity;
          if (available > 0) {
            locations.push({
              structureId: structure.id,
              levelId: level.id,
              partitionId: partition.id,
              partitionName: partition.name,
              quantity: available,
            });
            totalAvailable += available;
          }
        });
      });
    });

    return {
      productName: selectedProductName || "Product",
      totalAvailable,
      locations,
    };
  };

  const toggleStructure = (id: string) => {
    const newSet = new Set(expandedStructures);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedStructures(newSet);
  };

  const handleProceedToPicking = () => {
    const qty = parseInt(confirmQuantity) || selectedQuantity;
    selectProduct(selectedProductName || "", qty);
  };

  const inventory = getProductInventory();
  const canProceed = parseInt(confirmQuantity) > 0 && parseInt(confirmQuantity) <= inventory.totalAvailable;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Select Product & Quantity</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Product: {currentRequest.productName}
        </p>
        <p className="text-xs text-muted-foreground">
          Requested Quantity: {currentRequest.quantity} units
        </p>
      </div>

      {/* Available Inventory */}
      <div className="border border-border rounded-lg p-3 bg-blue-50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-blue-900">Total Available in Warehouse</span>
          <span className="text-sm font-bold text-blue-600">{inventory.totalAvailable} units</span>
        </div>
      </div>

      {/* Quantity Confirmation */}
      <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
        <label className="text-xs font-medium text-foreground">Quantity to Pick</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter quantity"
            value={confirmQuantity}
            onChange={(e) => setConfirmQuantity(e.target.value)}
            max={inventory.totalAvailable}
            min={1}
            className="flex-1 px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />
          <span className="px-2 py-1.5 text-xs font-medium bg-background border border-border rounded text-muted-foreground">
            / {inventory.totalAvailable}
          </span>
        </div>
        {parseInt(confirmQuantity) > inventory.totalAvailable && (
          <p className="text-xs text-red-600">Requested quantity exceeds available stock</p>
        )}
      </div>

      {/* Available Locations */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Available Locations</label>
        {inventory.locations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-xs">No stock available for this product</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-2 max-h-96 overflow-y-auto space-y-1">
            {inventory.locations.map((location) => (
              <button
                key={location.partitionId}
                onClick={() => setSelectedLocationId(location.partitionId)}
                className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors ${
                  selectedLocationId === location.partitionId
                    ? "border-blue-500 bg-blue-50"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {location.partitionName}
                  </span>
                  <span className="text-muted-foreground">
                    {location.quantity} units
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-3 rounded">
        <p className="text-xs text-amber-900">
          Enter the quantity to pick and proceed. Stock locations will be shown for warehouse picking.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("request")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleProceedToPicking}
          disabled={!canProceed}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            canProceed
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Proceed to Picking
        </button>
      </div>
    </div>
  );
}
