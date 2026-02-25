"use client";

import { type Node } from "@xyflow/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useStockInStore } from "@/store/stock-in-store";
import type { StructureData } from "@/components/warehouse/types";

interface PartitionSelectorProps {
  structureId: string;
  nodes: Node[];
  remainingQuantity: number;
  onAllocationConfirm?: () => void;
}

export function PartitionSelector({
  structureId,
  nodes,
  remainingQuantity,
  onAllocationConfirm,
}: PartitionSelectorProps) {
  const [expandedLevelId, setExpandedLevelId] = useState<string | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>({});
  const { addAllocation, removeAllocation, selectedAllocationPartitions } = useStockInStore();

  const structure = nodes.find(
    (n) => n.id === structureId && n.type === "structure"
  ) as Node<StructureData> | undefined;

  if (!structure) return null;

  const getCapacityStatus = (used: number, max: number) => {
    const percentage = (used / max) * 100;
    if (percentage < 40) return { label: "Low", color: "text-green-600 bg-green-50 border-green-200" };
    if (percentage < 70) return { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "High", color: "text-red-600 bg-red-50 border-red-200" };
  };

  const getAvailableSpace = (partition) => {
    return partition.max_capacity - partition.used_capacity;
  };

  const isPartitionSelected = (partitionId: string) => {
    return selectedAllocationPartitions.some((a) => a.partitionId === partitionId);
  };

  const getAllocatedQuantity = (partitionId: string) => {
    const allocation = selectedAllocationPartitions.find((a) => a.partitionId === partitionId);
    return allocation?.allocatedQuantity || 0;
  };

  const handleAllocatePartition = (levelId: string, partitionId: string, partition) => {
    const allocatedQty = getAllocatedQuantity(partitionId);
    const inputQty = quantityInputs[partitionId] || 0;

    if (allocatedQty === 0 && inputQty > 0) {
      // Add allocation
      addAllocation({
        structureId,
        levelId,
        partitionId,
        allocatedQuantity: Math.min(inputQty, remainingQuantity),
      });
      setQuantityInputs((prev) => ({ ...prev, [partitionId]: 0 }));
    } else if (allocatedQty > 0) {
      // Remove allocation
      removeAllocation(partitionId);
      setQuantityInputs((prev) => ({ ...prev, [partitionId]: 0 }));
    }
  };

  return (
    <div className="space-y-1">
      {(structure.data as StructureData).levels.map((level) => (
        <div key={level.id} className="border border-border rounded-md overflow-hidden">
          {/* Level Header */}
          <button
            onClick={() =>
              setExpandedLevelId(expandedLevelId === level.id ? null : level.id)
            }
            className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors text-sm bg-muted/30"
          >
            <div className="flex items-center gap-2">
              {expandedLevelId === level.id ? (
                <ChevronDown size={14} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground" />
              )}
              <span className="font-medium text-foreground">{level.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {level.partitions.length} partitions
            </span>
          </button>

          {/* Partitions */}
          {expandedLevelId === level.id && (
            <div className="px-2 py-2 space-y-1 bg-muted/10 border-t border-border">
              {level.partitions.map((partition) => {
                const status = getCapacityStatus(partition.used_capacity, partition.max_capacity);
                const percentage = Math.round(
                  (partition.used_capacity / partition.max_capacity) * 100
                );
                const availableSpace = getAvailableSpace(partition);
                const isSelected = isPartitionSelected(partition.id);
                const allocatedQty = getAllocatedQuantity(partition.id);

                return (
                  <div
                    key={partition.id}
                    className={`border rounded-md p-2 transition-all ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50 border-blue-300"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {/* Partition Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-foreground">{partition.name}</p>
                        <p className="text-[10px] text-muted-foreground">{partition.code}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Capacity Bar */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-muted-foreground">
                        {partition.used_capacity}/{partition.max_capacity}
                      </span>
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              percentage < 40
                                ? "#10b981"
                                : percentage < 70
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        />
                      </div>
                    </div>

                    {/* Allocation Input */}
                    {isSelected ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-green-700 font-medium">
                            Allocated: {allocatedQty} units
                          </span>
                        </div>
                        <button
                          onClick={() => handleAllocatePartition(level.id, partition.id, partition)}
                          className="w-full px-2 py-1 text-[10px] font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Remove Allocation
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1 items-end">
                        <div className="flex-1">
                          <label className="text-[10px] text-muted-foreground">
                            Qty (max: {availableSpace})
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={Math.min(availableSpace, remainingQuantity)}
                            value={quantityInputs[partition.id] || ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setQuantityInputs((prev) => ({
                                ...prev,
                                [partition.id]: Math.min(
                                  Math.max(0, val),
                                  Math.min(availableSpace, remainingQuantity)
                                ),
                              }));
                            }}
                            placeholder="0"
                            className="w-full px-1 py-0.5 text-[10px] border border-border rounded bg-background"
                          />
                        </div>
                        <button
                          onClick={() =>
                            handleAllocatePartition(level.id, partition.id, partition)
                          }
                          disabled={!quantityInputs[partition.id] || quantityInputs[partition.id] === 0}
                          className={`px-2 py-1 text-[10px] font-medium rounded transition-colors whitespace-nowrap ${
                            !quantityInputs[partition.id] || quantityInputs[partition.id] === 0
                              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          Allocate
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
