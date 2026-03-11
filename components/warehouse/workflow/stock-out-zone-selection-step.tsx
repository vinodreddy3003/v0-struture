"use client";

import { useState, useMemo } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { StructureData, ZoneData } from "@/components/warehouse/types";

interface StockOutZoneSelectionStepProps {
  nodes?: Node[];
}

export function StockOutZoneSelectionStep({ nodes = [] }: StockOutZoneSelectionStepProps) {
  const {
    currentRequest,
    selectedZoneId,
    selectZone,
    startPicking,
    setAvailableLocations,
    pickingAllocations,
    addPickingAllocation,
    removePickingAllocation,
  } = useStockOutStore();

  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [quantityToPick, setQuantityToPick] = useState("");
  const [selectedPartitionId, setSelectedPartitionId] = useState("");

  // Get zones from nodes
  const zones = useMemo(() => {
    return nodes.filter((n) => n.type === "zone") as Node<ZoneData>[];
  }, [nodes]);

  // Get structures for selected zone
  const structures = useMemo(() => {
    return selectedZoneId
      ? nodes.filter(
          (n) =>
            n.type === "structure" &&
            (n.data as StructureData).parentZoneId === selectedZoneId
        )
      : [];
  }, [nodes, selectedZoneId]);

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

  const handlePickPartition = (
    structureId: string,
    levelId: string,
    partitionId: string,
    partitionName: string
  ) => {
    const qty = Math.min(
      parseInt(quantityToPick) || 0,
      currentRequest?.quantity || 0
    );

    if (qty > 0) {
      const zone = zones.find((z) => z.id === selectedZoneId);
      const structure = structures.find((s) => s.id === structureId);
      const level = (structure?.data as StructureData)?.levels?.find(
        (l) => l.id === levelId
      );

      addPickingAllocation({
        locationId: `${structureId}-${levelId}-${partitionId}`,
        location: {
          zoneId: selectedZoneId || "",
          zoneName: (zone?.data as ZoneData)?.label || "",
          structureId,
          structureName: (structure?.data as StructureData)?.label || "",
          levelId,
          levelName: level?.name || "",
          partitionId,
          partitionName,
          availableQuantity: 0,
        },
        pickedQuantity: qty,
      });
      setQuantityToPick("");
      setSelectedPartitionId("");
    }
  };

  const canProceedToPicking = pickingAllocations.length > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Select Picking Locations</h3>
        {currentRequest && (
          <>
            <p className="text-xs text-muted-foreground mt-1">
              Product: {currentRequest.productName}
            </p>
            <p className="text-xs text-muted-foreground">
              Total Quantity: {currentRequest.quantity}
            </p>
          </>
        )}
      </div>

      {/* Zone Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Select Zone</label>
        <div className="grid grid-cols-2 gap-2">
          {zones.length > 0 ? (
            zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  selectZone(zone.id === selectedZoneId ? null : zone.id);
                }}
                className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                  selectedZoneId === zone.id
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {(zone.data as ZoneData).label}
              </button>
            ))
          ) : (
            <p className="col-span-2 text-xs text-muted-foreground">
              No zones available. Create warehouse design first.
            </p>
          )}
        </div>
      </div>

      {/* Structures and Partitions */}
      {(selectedZoneId || structures.length > 0) && structures.length > 0 && (
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
                    {data.levels && data.levels.length > 0 ? (
                      data.levels.map((level) => {
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
                                {level.partitions && level.partitions.length > 0 ? (
                                  level.partitions.map((partition) => {
                                    const availableCapacity = partition.used_capacity || 0;

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
                                  })
                                ) : (
                                  <p className="px-2 py-1 text-xs text-muted-foreground">
                                    No partitions available
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="px-2 py-1 text-xs text-muted-foreground">
                        No levels available
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quantity Picking */}
      {selectedPartitionId && (
        <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
          <label className="text-xs font-medium text-foreground">Quantity to Pick</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantityToPick}
              onChange={(e) => setQuantityToPick(e.target.value)}
              min={0}
              className="flex-1 px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
            <button
              onClick={() => {
                const structure = structures.find((s) => s.id);
                if (structure && selectedZoneId) {
                  const level = (structure.data as StructureData).levels?.find((l) =>
                    l.partitions?.some((p) => p.id === selectedPartitionId)
                  );
                  const partition = level?.partitions?.find((p) => p.id === selectedPartitionId);
                  if (level && partition) {
                    handlePickPartition(
                      structure.id,
                      level.id,
                      partition.id,
                      partition.name
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

      {/* Picking Allocations Summary */}
      {pickingAllocations.length > 0 && (
        <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
          <h4 className="text-xs font-medium text-green-900">
            Picking Locations ({pickingAllocations.length})
          </h4>
          <div className="space-y-1">
            {pickingAllocations.map((alloc) => (
              <div
                key={alloc.locationId}
                className="flex items-center justify-between bg-white p-2 rounded border border-green-200"
              >
                <span className="text-xs text-foreground">
                  {alloc.location.partitionName}: {alloc.pickedQuantity} units
                </span>
                <button
                  onClick={() => removePickingAllocation(alloc.locationId)}
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
          onClick={() => {}}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (canProceedToPicking) {
              setAvailableLocations(pickingAllocations.map((p) => p.location));
              startPicking();
            }
          }}
          disabled={!canProceedToPicking}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            canProceedToPicking
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Proceed to Picking
        </button>
      </div>
    </div>
  );
}
