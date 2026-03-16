"use client";

import { useStockTransferStore } from "@/store/stock-transfer-store";
import type { Node } from "@xyflow/react";
import type { StructureData, ZoneData } from "@/components/warehouse/types";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface DestinationSelectionStepProps {
  nodes: Node[];
}

export function DestinationSelectionStep({ nodes }: DestinationSelectionStepProps) {
  const {
    currentRequestId,
    requests,
    transferType,
    selectedDestZoneId,
    selectedDestStructureId,
    selectedDestLevelId,
    sourceTransfers,
    destTransfers,
    setDestinationInfo,
    selectDestZone,
    selectDestStructure,
    selectDestLevel,
    addDestTransfer,
    removeDestTransfer,
    setCurrentStep,
  } = useStockTransferStore();

  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [selectedPartitionId, setSelectedPartitionId] = useState("");
  const [externalDestination, setExternalDestination] = useState("");
  const [externalZone, setExternalZone] = useState("");

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const totalQuantity = sourceTransfers.reduce((sum, t) => sum + t.transferredQuantity, 0);

  // Get zones
  const zones = nodes.filter((n) => n.type === "zone") as Node<ZoneData>[];

  // Get structures for selected zone
  const structures = selectedDestZoneId
    ? nodes.filter(
        (n) =>
          n.type === "structure" &&
          n.parentId === selectedDestZoneId
      )
    : [];

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

  const handleAddDestination = (structureId: string, levelId: string, partitionId: string, partitionName: string, maxCapacity: number) => {
    const availableSpace = maxCapacity - Math.max(0, (destTransfers.reduce((sum, t) => sum + t.transferredQuantity, 0) || 0));
    const qty = Math.min(totalQuantity, availableSpace);

    if (qty > 0) {
      addDestTransfer({
        sourceStructureId: structureId,
        sourceLevelId: levelId,
        sourcePartitionId: partitionId,
        sourcePartitionName: partitionName,
        transferredQuantity: qty,
      });
      setSelectedPartitionId("");
    }
  };

  const canProceed = transferType === "external"
    ? externalDestination.trim().length > 0
    : destTransfers.length > 0 && destTransfers.reduce((sum, t) => sum + t.transferredQuantity, 0) >= totalQuantity;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {transferType === "internal" ? "Select Destination Location" : "Enter External Destination"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Transfer Type: {transferType === "internal" ? "Internal" : "External"}
        </p>
        <p className="text-xs text-muted-foreground">
          Quantity to Transfer: {totalQuantity}
        </p>
      </div>

      {transferType === "external" ? (
        // External Transfer Form
        <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Destination Location</label>
            <input
              type="text"
              placeholder="Enter destination address or location"
              value={externalDestination}
              onChange={(e) => {
                setExternalDestination(e.target.value);
                setDestinationInfo({
                  location: e.target.value,
                  zone: externalZone,
                });
              }}
              className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Zone/Department (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Distribution Center, Branch"
              value={externalZone}
              onChange={(e) => {
                setExternalZone(e.target.value);
                setDestinationInfo({
                  location: externalDestination,
                  zone: e.target.value,
                });
              }}
              className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
          </div>

          {externalDestination && (
            <div className="p-2 rounded bg-indigo-50 border border-indigo-200">
              <p className="text-xs text-indigo-900">
                <span className="font-medium">Destination:</span> {externalDestination}
                {externalZone && ` - ${externalZone}`}
              </p>
            </div>
          )}
        </div>
      ) : (
        // Internal Transfer Selection
        <>
          {/* Zone Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Select Destination Zone</label>
            <div className="grid grid-cols-2 gap-2">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    selectDestZone(zone.id === selectedDestZoneId ? null : zone.id);
                    selectDestStructure(null);
                    selectDestLevel(null);
                  }}
                  className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                    selectedDestZoneId === zone.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {(zone.data as ZoneData).label}
                </button>
              ))}
            </div>
          </div>

          {/* Structures and Partitions */}
          {(selectedDestZoneId || structures.length > 0) && (
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
                                        disabled={availableCapacity === 0}
                                        className={`w-full text-left px-2 py-1 text-xs rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                          selectedPartitionId === partition.id
                                            ? "border-indigo-500 bg-indigo-50"
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

          {/* Add Destination Button */}
          {selectedPartitionId && (
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
                    handleAddDestination(
                      structureData.id,
                      level.id,
                      partition.id,
                      partition.name,
                      partition.max_capacity
                    );
                  }
                }
              }}
              className="w-full px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              Add Destination
            </button>
          )}

          {/* Destinations Summary */}
          {destTransfers.length > 0 && (
            <div className="border border-border rounded-lg p-3 bg-indigo-50 space-y-2">
              <h4 className="text-xs font-medium text-indigo-900">
                Destinations ({destTransfers.length})
              </h4>
              <div className="space-y-1">
                {destTransfers.map((dest) => (
                  <div
                    key={dest.sourcePartitionId}
                    className="flex items-center justify-between bg-white p-2 rounded border border-indigo-200"
                  >
                    <span className="text-xs text-foreground">
                      {dest.sourcePartitionName}: {dest.transferredQuantity} units
                    </span>
                    <button
                      onClick={() => removeDestTransfer(dest.sourcePartitionId)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("source-selection")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep("confirmation")}
          disabled={!canProceed}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            canProceed
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Proceed to Confirmation
        </button>
      </div>
    </div>
  );
}
