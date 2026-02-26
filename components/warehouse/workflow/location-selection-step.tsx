"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { ChevronLeft } from "lucide-react";
import type { Node } from "@xyflow/react";

interface LocationSelectionStepProps {
  nodes: Node[];
}

export function LocationSelectionStep({ nodes }: LocationSelectionStepProps) {
  const { selectedItem, structuresWithItem, selectStructure, setCurrentStep, selectItem } = useStockOutStore();

  if (!selectedItem) return null;

  const handleBack = () => {
    selectItem("", null);
    setCurrentStep("inventory");
  };

  // Get structure names from nodes
  const getStructureName = (structureId: string) => {
    const node = nodes.find((n) => n.id === structureId);
    return node?.data?.label || structureId;
  };

  // Group allocations by structure
  const allocationsByStructure = selectedItem.allocations.reduce(
    (acc: any, alloc: any) => {
      if (!acc[alloc.structureId]) {
        acc[alloc.structureId] = {
          structureId: alloc.structureId,
          structureName: getStructureName(alloc.structureId),
          totalQuantity: 0,
          allocations: [],
        };
      }
      acc[alloc.structureId].totalQuantity += alloc.allocatedQuantity;
      acc[alloc.structureId].allocations.push(alloc);
      return acc;
    },
    {}
  );

  const structures = Object.values(allocationsByStructure);

  const handleSelectStructure = (structureId: string) => {
    selectStructure(structureId);
    setCurrentStep("quantity");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mb-2"
        >
          <ChevronLeft size={14} />
          Back to Inventory
        </button>
        <h3 className="text-sm font-semibold text-foreground">Select Structure</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Choose where to pick {selectedItem.productName} from
        </p>
      </div>

      {/* Selected Item Info */}
      <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
        <p className="text-sm font-semibold text-foreground">{selectedItem.productName}</p>
        <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
          <p>Type: {selectedItem.productType}</p>
          <p>Total Available: {selectedItem.quantity} {selectedItem.productUOM}</p>
        </div>
      </div>

      {/* Structures List */}
      {structures.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-xs">No locations found for this item</p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground block">
            Available Structures ({structures.length})
          </label>
          {(structures as any[]).map((structure) => (
            <button
              key={structure.structureId}
              onClick={() => handleSelectStructure(structure.structureId)}
              className="w-full p-3 border border-border rounded-lg bg-background hover:border-green-300 hover:bg-green-50/30 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {structure.structureName}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <p>Available: {structure.totalQuantity} {selectedItem.productUOM}</p>
                    <p>Locations: {structure.allocations.length}</p>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  {structure.totalQuantity}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
