"use client";

import { useStockInStore } from "@/store/stock-in-store";
import type { Node } from "@xyflow/react";
import type { StructureData, ZoneData } from "@/components/warehouse/types";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AllocationStepProps {
  nodes: Node[];
}

export function AllocationStep({ nodes }: AllocationStepProps) {
  const {
    currentRequestId,
    requests,
    selectedZoneId,
    selectedStructureId,
    selectedLevelId,
    allocations,
    remainingQuantity,
    selectZone,
    selectStructure,
    selectLevel,
    addAllocation,
    removeAllocation,
    setCurrentStep,
  } = useStockInStore();

  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [quantityToAllocate, setQuantityToAllocate] = useState("");
  const [selectedPartitionId, setSelectedPartitionId] = useState("");

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  // Get zones
  const zones = nodes.filter((n) => n.type === "zone") as Node<ZoneData>[];

  // Get structures for selected zone
  const structures = selectedZoneId
    ? nodes.filter(
        (n) =>
          n.type === "structure" &&
          (n.data as StructureData).label === selectedZoneId
      )
    : nodes.filter((n) => n.type === "structure");

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

  const handleAllocatePartition = (structureId: string, levelId: string, partitionId: string, partitionName: string, maxCapacity: number) => {
    const qty = Math.min(
      parseInt(quantityToAllocate) || 0,
      remainingQuantity,
      maxCapacity
    );

    if (qty > 0) {
      // Find the partition to get its data
      const structure = structures.find(s => s.id === structureId);
      const level = structure?.data?.levels?.find((l: any) => l.id === levelId);
      const partition = level?.partitions?.find((p: any) => p.id === partitionId);

      addAllocation({
        structureId,
        levelId,
        partitionId,
        partitionName,
        allocatedQuantity: qty,
      });
      setQuantityToAllocate("");
      setSelectedPartitionId("");
    }
  };

  const canProceedToputaway = allocations.length > 0 && remainingQuantity === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Allocate Stock</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Product: {currentRequest.productName}
        </p>
        <p className="text-xs text-muted-foreground">
          Total Quantity: {currentRequest.quantity} | Remaining: {remainingQuantity}
        </p>
      </div>

      {/* Zone Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Select Zone</label>
        <div className="grid grid-cols-2 gap-2">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => {
                selectZone(zone.id === selectedZoneId ? null : zone.id);
                selectStructure(null);
                selectLevel(null);
              }}
              className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                selectedZoneId === zone.id
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {(zone.data as ZoneData).label}
            </button>
          ))}
        </div>
      </div>

      {/* Structures and Partitions */}
      {(selectedZoneId || structures.length > 0) && (
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
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
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
                            {isLevelExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            {level.name}
                          </button>

                          {isLevelExpanded && (
                            <div className="pl-4 space-y-1 mt-1">
                              {level.partitions.map((partition) => {
                                const availableCapacity = partition.max_capacity - partition.used_capacity;

                                return (
                                  <button
                                    key={partition.id}
                                    onClick={() => setSelectedPartitionId(partition.id)}
                                    className={`w-full text-left px-2 py-1 text-xs rounded border transition-colors ${
                                      selectedPartitionId === partition.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-border bg-background hover:bg-muted"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-foreground">
                                        {partition.name}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {availableCapacity} available
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
      )}

      {/* Quantity Allocation */}
      {selectedPartitionId && (
        <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
          <label className="text-xs font-medium text-foreground">Quantity to Allocate</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantityToAllocate}
              onChange={(e) => setQuantityToAllocate(e.target.value)}
              max={remainingQuantity}
              min={0}
              className="flex-1 px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
            <button
              onClick={() => {
                const structureData = structures.find(
                  (s) =>
                    s.data.levels.some((l) =>
                      l.partitions.some((p) => p.id === selectedPartitionId)
                    )
                );
                if (structureData) {
                  const level = structureData.data.levels.find((l) =>
                    l.partitions.some((p) => p.id === selectedPartitionId)
                  );
                  const partition = level?.partitions.find(
                    (p) => p.id === selectedPartitionId
                  );
                  if (level && partition) {
                    handleAllocatePartition(
                      structureData.id,
                      level.id,
                      partition.id,
                      partition.name,
                      partition.max_capacity
                    );
                  }
                }
              }}
              className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Allocations Summary */}
      {allocations.length > 0 && (
        <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
          <h4 className="text-xs font-medium text-green-900">
            Allocations ({allocations.length})
          </h4>
          <div className="space-y-1">
            {allocations.map((alloc) => (
              <div
                key={alloc.partitionId}
                className="flex items-center justify-between bg-white p-2 rounded border border-green-200"
              >
                <span className="text-xs text-foreground">
                  {alloc.partitionName}: {alloc.allocatedQuantity} units
                </span>
                <button
                  onClick={() => removeAllocation(alloc.partitionId)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("request")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setCurrentStep("putaway")}
          disabled={!canProceedToputaway}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            canProceedToputaway
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Proceed to Putaway
        </button>
      </div>
    </div>
  );
}
