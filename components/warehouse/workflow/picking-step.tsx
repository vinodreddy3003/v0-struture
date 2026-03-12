"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import type { Node } from "@xyflow/react";
import type { StructureData, Partition } from "@/components/warehouse/types";
import { ChevronDown, ChevronRight, Trash2, Package } from "lucide-react";
import { useState } from "react";

interface PickingStepProps {
  nodes: Node[];
}

export function PickingStep({ nodes }: PickingStepProps) {
  const {
    currentRequestId,
    requests,
    selectedQuantity,
    pickingDetails,
    remainingQuantity,
    addPickingDetail,
    removePickingDetail,
    setCurrentStep,
  } = useStockOutStore();

  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [quantityToPick, setQuantityToPick] = useState("");
  const [selectedPartitionId, setSelectedPartitionId] = useState("");
  const [pickedLocations, setPickedLocations] = useState<Set<string>>(new Set());

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  // Get structures with available stock
  const structures = nodes.filter((n) => n.type === "structure") as Node<StructureData>[];

  const toggleStructure = (id: string) => {
    const newSet = new Set(expandedStructures);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedStructures(newSet);
  };

  const toggleLevel = (id: string) => {
    const newSet = new Set(expandedLevels);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedLevels(newSet);
  };

  const handlePickFromPartition = (
    structureId: string,
    levelId: string,
    partitionId: string,
    partitionName: string,
    availableQuantity: number,
    partition?: Partition
  ) => {
    const qty = Math.min(
      parseInt(quantityToPick) || 0,
      remainingQuantity,
      availableQuantity
    );

    if (qty > 0 && !pickingDetails.some((p) => p.partitionId === partitionId)) {
      addPickingDetail({
        structureId,
        levelId,
        partitionId,
        partitionName,
        pickedQuantity: qty,
      });

      setQuantityToPick("");
      setSelectedPartitionId("");
      setPickedLocations(new Set([...pickedLocations, partitionId]));
    }
  };

  const canProceedToCompletion =
    pickingDetails.length > 0 && remainingQuantity === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Warehouse Picking</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Product: {currentRequest.productName}
        </p>
        <p className="text-xs text-muted-foreground">
          Total to Pick: {selectedQuantity} | Remaining: {remainingQuantity}
        </p>
      </div>

      {/* Warehouse Structure Navigation */}
      <div className="space-y-2 max-h-96 overflow-y-auto border border-border rounded-lg p-2">
        {structures.map((structure) => {
          const data = structure.data as StructureData;
          const isExpanded = expandedStructures.has(structure.id);

          return (
            <div key={structure.id} className="border border-border rounded">
              <button
                onClick={() => toggleStructure(structure.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                {data.label}
              </button>

              {isExpanded && (
                <div className="border-t border-border bg-muted/20 p-2 space-y-1">
                  {data.levels.map((level) => {
                    const isLevelExpanded = expandedLevels.has(level.id);

                    return (
                      <div key={level.id}>
                        <button
                          onClick={() => toggleLevel(level.id)}
                          className="w-full flex items-center gap-2 px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                        >
                          {isLevelExpanded ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                          {level.name}
                        </button>

                        {isLevelExpanded && (
                          <div className="pl-4 space-y-1 mt-1">
                            {level.partitions.map((partition) => {
                              const availableQuantity = partition.used_capacity;
                              const isAlreadyPicked = pickingDetails.some(
                                (p) => p.partitionId === partition.id
                              );

                              return (
                                <button
                                  key={partition.id}
                                  onClick={() =>
                                    setSelectedPartitionId(partition.id)
                                  }
                                  disabled={availableQuantity === 0}
                                  className={`w-full text-left px-2 py-1 text-xs rounded border transition-colors ${
                                    isAlreadyPicked
                                      ? "border-green-500 bg-green-50"
                                      : selectedPartitionId === partition.id
                                        ? "border-amber-500 bg-amber-50"
                                        : availableQuantity === 0
                                          ? "border-border bg-muted cursor-not-allowed opacity-50"
                                          : "border-border bg-background hover:bg-muted"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-foreground">
                                      {partition.name}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {availableQuantity} available
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quantity to Pick */}
      {selectedPartitionId && (
        <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
          <label className="text-xs font-medium text-foreground">
            Quantity to Pick from Selected Location
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantityToPick}
              onChange={(e) => setQuantityToPick(e.target.value)}
              max={remainingQuantity}
              min={1}
              className="flex-1 px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
            <button
              onClick={() => {
                const structure = structures.find((s) =>
                  s.data.levels.some((l) =>
                    l.partitions.some((p) => p.id === selectedPartitionId)
                  )
                );
                if (structure) {
                  const level = structure.data.levels.find((l) =>
                    l.partitions.some((p) => p.id === selectedPartitionId)
                  );
                  const partition = level?.partitions.find(
                    (p) => p.id === selectedPartitionId
                  );
                  if (level && partition) {
                    handlePickFromPartition(
                      structure.id,
                      level.id,
                      partition.id,
                      partition.name,
                      partition.used_capacity,
                      partition
                    );
                  }
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              Pick
            </button>
          </div>
        </div>
      )}

      {/* Picked Summary */}
      {pickingDetails.length > 0 && (
        <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
          <h4 className="text-xs font-medium text-green-900">
            Picked Locations ({pickingDetails.length})
          </h4>
          <div className="space-y-1">
            {pickingDetails.map((picking) => (
              <div
                key={picking.partitionId}
                className="flex items-center justify-between bg-white p-2 rounded border border-green-200"
              >
                <span className="text-xs text-foreground">
                  {picking.partitionName}: {picking.pickedQuantity} units
                </span>
                <button
                  onClick={() => removePickingDetail(picking.partitionId)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-3 rounded">
        <p className="text-xs text-amber-900">
          Select partition locations and pick quantities until remaining quantity reaches zero to proceed to completion.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            Picking Progress
          </span>
          <span className="text-xs font-semibold text-foreground">
            {selectedQuantity - remainingQuantity} / {selectedQuantity} picked
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("product-selection")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep("completion")}
          disabled={!canProceedToCompletion}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            canProceedToCompletion
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Complete Picking
        </button>
      </div>
    </div>
  );
}
