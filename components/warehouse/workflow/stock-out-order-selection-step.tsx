"use client";

import { useMemo } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight, AlertCircle } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { StructureData, Partition, Level, ZoneData } from "@/components/warehouse/types";

interface StockOutOrderSelectionStepProps {
  nodes: Node[];
}

export function StockOutOrderSelectionStep({ nodes }: StockOutOrderSelectionStepProps) {
  const {
    currentRequestId,
    requests,
    selectZone,
    selectStructure,
    selectLevel,
    selectPartition,
    setSelectedPickingDetail,
    selectedZoneId,
    selectedStructureId,
    selectedLevelId,
    selectedPartitionId,
    setCurrentStep,
    nextStep,
  } = useStockOutStore();

  const currentRequest = currentRequestId
    ? requests.find((r) => r.id === currentRequestId)
    : null;

  // Build location data from nodes
  const zoneStructures = useMemo(() => {
    const zoneMap = new Map<string, { zone: ZoneData; structures: (StructureData & { nodeId: string })[] }>();

    nodes.forEach((node) => {
      if (node.type === "zone") {
        const zoneData = node.data as ZoneData;
        if (!zoneMap.has(node.id)) {
          zoneMap.set(node.id, {
            zone: zoneData,
            structures: [],
          });
        }
      }

      if (node.type === "structure" && node.parentId) {
        const structureData = (node.data as StructureData) || {};
        const parentZone = nodes.find((n) => n.id === node.parentId);
        if (parentZone) {
          const zoneData = parentZone.data as ZoneData;
          if (!zoneMap.has(node.parentId)) {
            zoneMap.set(node.parentId, {
              zone: zoneData,
              structures: [],
            });
          }
          zoneMap.get(node.parentId)!.structures.push({
            ...(structureData as StructureData),
            nodeId: node.id,
          });
        }
      }
    });

    return Array.from(zoneMap.values());
  }, [nodes]);

  const selectedZone = selectedZoneId
    ? zoneStructures.find((z) => {
        const zoneNode = nodes.find((n) => n.id === selectedZoneId);
        return zoneNode?.id === selectedZoneId;
      })
    : null;

  const selectedStructure = selectedStructureId
    ? selectedZone?.structures.find((s) => s.nodeId === selectedStructureId)
    : null;

  const selectedStructureLevel = selectedLevelId && selectedStructure
    ? selectedStructure.levels.find((l) => l.id === selectedLevelId)
    : null;

  const selectedPartition = selectedPartitionId && selectedStructureLevel
    ? selectedStructureLevel.partitions.find((p) => p.id === selectedPartitionId)
    : null;

  const handleSelectPartition = () => {
    if (!selectedPartition || !selectedZone || !selectedStructure || !selectedStructureLevel) return;

    const pickingDetail = {
      structureId: selectedStructure.nodeId,
      structureName: selectedStructure.label,
      levelId: selectedStructureLevel.id,
      levelName: selectedStructureLevel.name,
      partitionId: selectedPartition.id,
      partitionName: selectedPartition.name,
      zoneId: selectedZoneId!,
      zoneName: selectedZone.zone.label,
      zoneType: selectedZone.zone.zoneType,
      pickedQuantity: 0,
      availableQuantity: selectedPartition.max_capacity - selectedPartition.used_capacity,
    };

    setSelectedPickingDetail(pickingDetail);
    setCurrentStep("picking");
  };

  if (!currentRequest) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
        <AlertCircle size={16} className="text-yellow-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">No active request found</p>
      </div>
    );
  }

  const availableStock =
    selectedPartition && currentRequest
      ? Math.min(
          selectedPartition.max_capacity - selectedPartition.used_capacity,
          currentRequest.quantity
        )
      : 0;

  const canProceed = selectedPartition !== undefined && availableStock > 0;

  return (
    <div className="space-y-4">
      {/* Request Summary */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900">
          {currentRequest.orderReference}
        </p>
        <p className="text-xs text-blue-800 mt-1">
          Need to pick: <span className="font-semibold">{currentRequest.quantity} {currentRequest.productUOM}</span>
        </p>
      </div>

      {/* Zone Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Zone</label>
        <div className="space-y-2">
          {zoneStructures.map((zs) => {
            const zoneNode = nodes.find((n) => n.id === selectedZoneId);
            const isSelected = zoneNode?.data?.label === zs.zone.label;

            return (
              <button
                key={zs.zone.label}
                onClick={() => {
                  const zoneNodeId = nodes.find((n) => n.type === "zone" && (n.data as ZoneData).label === zs.zone.label)?.id;
                  if (zoneNodeId) {
                    selectZone(zoneNodeId);
                    selectStructure(null);
                    selectLevel(null);
                    selectPartition(null);
                  }
                }}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-border hover:border-emerald-300 bg-card"
                }`}
              >
                <p className="text-sm font-medium">{zs.zone.label}</p>
                <p className="text-xs text-muted-foreground">
                  {zs.structures.length} structure{zs.structures.length !== 1 ? "s" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structure Selection */}
      {selectedZone && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Structure</label>
          <div className="space-y-2">
            {selectedZone.structures.map((structure) => {
              const isSelected = selectedStructureId === structure.nodeId;
              return (
                <button
                  key={structure.nodeId}
                  onClick={() => {
                    selectStructure(structure.nodeId);
                    selectLevel(null);
                    selectPartition(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-border hover:border-emerald-300 bg-card"
                  }`}
                >
                  <p className="text-sm font-medium">{structure.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {structure.levels.length} level{structure.levels.length !== 1 ? "s" : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Level Selection */}
      {selectedStructure && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Level</label>
          <div className="space-y-2">
            {selectedStructure.levels.map((level) => {
              const isSelected = selectedLevelId === level.id;
              const totalCapacity = level.partitions.reduce((sum, p) => sum + p.max_capacity, 0);
              const usedCapacity = level.partitions.reduce((sum, p) => sum + p.used_capacity, 0);

              return (
                <button
                  key={level.id}
                  onClick={() => {
                    selectLevel(level.id);
                    selectPartition(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-border hover:border-emerald-300 bg-card"
                  }`}
                >
                  <p className="text-sm font-medium">{level.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {level.partitions.length} partition{level.partitions.length !== 1 ? "s" : ""} • {usedCapacity}/{totalCapacity} capacity
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Partition Selection */}
      {selectedStructureLevel && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Partition</label>
          <div className="space-y-2">
            {selectedStructureLevel.partitions.map((partition) => {
              const isSelected = selectedPartitionId === partition.id;
              const availableInPartition = partition.max_capacity - partition.used_capacity;

              return (
                <button
                  key={partition.id}
                  onClick={() => selectPartition(partition.id)}
                  disabled={availableInPartition <= 0}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50"
                      : availableInPartition > 0
                        ? "border-border hover:border-emerald-300 bg-card cursor-pointer"
                        : "border-red-200 bg-red-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{partition.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {partition.product_name && `${partition.product_name} • `}
                        {availableInPartition} available
                      </p>
                    </div>
                    {isSelected && <ChevronRight size={16} className="text-emerald-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Info and Proceed */}
      {selectedPartition && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">Location Selected:</p>
            <p className="font-semibold">
              {selectedZone?.zone.label} → {selectedStructure?.label} → {selectedStructureLevel?.name} → {selectedPartition.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t">
            <div>
              <p className="text-muted-foreground">Product</p>
              <p className="font-medium">{selectedPartition.product_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Available</p>
              <p className="font-medium">{availableStock}</p>
            </div>
          </div>

          {availableStock < currentRequest.quantity && (
            <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
              Available stock ({availableStock}) is less than requested ({currentRequest.quantity})
            </div>
          )}

          <Button
            onClick={handleSelectPartition}
            disabled={!canProceed}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Proceed to Picking
          </Button>
        </div>
      )}
    </div>
  );
}
