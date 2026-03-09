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

  // Build zone structures from nodes and filter to only show those containing the requested product
  const filteredZoneStructures = useMemo(() => {
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

    let zoneStructures = Array.from(zoneMap.values());

    // Filter zones to only show those containing the requested product
    if (currentRequest) {
      zoneStructures = zoneStructures
        .map((zs) => ({
          ...zs,
          structures: zs.structures
            .map((structure) => ({
              ...structure,
              levels: structure.levels
                .map((level) => ({
                  ...level,
                  partitions: level.partitions.filter(
                    (partition) =>
                      partition.product_name === currentRequest.productName &&
                      partition.product_type === currentRequest.productType &&
                      partition.max_capacity > partition.used_capacity
                  ),
                }))
                .filter((level) => level.partitions.length > 0),
            }))
            .filter((structure) => structure.levels.length > 0),
        }))
        .filter((zs) => zs.structures.length > 0);
    }

    return zoneStructures;
  }, [nodes, currentRequest]);

  const selectedZone = selectedZoneId
    ? filteredZoneStructures.find((z) => {
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
    if (!selectedPartition || !selectedZone || !selectedStructure || !selectedStructureLevel || !currentRequest) return;

    const actualProductQuantity = selectedPartition.product_quantity || 0;

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
      availableQuantity: actualProductQuantity,
      productName: currentRequest.productName,
      productType: currentRequest.productType,
      productUom: currentRequest.productUOM,
      productQuantity: actualProductQuantity,
    };

    setSelectedPickingDetail(pickingDetail);
    setCurrentStep("picking");
  };

  if (!currentRequest) {
    return (
      <div className="p-4 bg-warning-soft border border-warning rounded-lg flex gap-2">
        <AlertCircle size={16} className="text-warning-strong flex-shrink-0 mt-0.5" />
        <p className="text-sm text-warning-ink">No active request found</p>
      </div>
    );
  }

  const availableStock =
    selectedPartition && currentRequest
      ? selectedPartition.product_quantity || 0
      : 0;

  const canProceed = selectedPartition !== undefined && availableStock > 0;

  return (
    <div className="space-y-4">
      {/* Request Summary */}
      <div className="p-3 bg-info rounded-lg border border-info-ink">
        <p className="text-sm font-medium text-info-ink">
          {currentRequest.orderReference}
        </p>
        <p className="text-xs text-info-ink mt-1 opacity-90">
          Need to pick: <span className="font-semibold">{currentRequest.quantity} {currentRequest.productUOM}</span>
        </p>
      </div>

      {/* Zone Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Zone (Showing zones with {currentRequest.productName})</label>
        {filteredZoneStructures.length === 0 ? (
          <div className="p-3 bg-danger rounded-lg flex gap-2">
            <AlertCircle size={16} className="text-card-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-card-foreground">Product not found in any zone</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredZoneStructures.map((zs) => {
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
                      ? "border-success bg-success-soft-2"
                      : "border-border hover:border-success-muted bg-card"
                  }`}
                >
                  <p className="text-sm font-medium">{zs.zone.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {zs.structures.length} structure{zs.structures.length !== 1 ? "s" : ""} with product
                  </p>
                </button>
              );
            })}
          </div>
        )}
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
                      ? "border-success bg-success-soft-2"
                      : "border-border hover:border-success-muted bg-card"
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
                      ? "border-success bg-success-soft-2"
                      : "border-border hover:border-success-muted bg-card"
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
          {selectedStructureLevel.partitions.length === 0 ? (
            <div className="p-3 bg-warning-soft border border-warning rounded-lg">
              <p className="text-sm text-warning-ink">No partitions with {currentRequest.productName} in this level</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedStructureLevel.partitions.map((partition) => {
                const isSelected = selectedPartitionId === partition.id;
                const actualProductQuantity = partition.product_quantity || 0;

                return (
                  <button
                    key={partition.id}
                    onClick={() => selectPartition(partition.id)}
                    disabled={actualProductQuantity <= 0}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      isSelected
                        ? "border-success bg-success-soft-2"
                        : actualProductQuantity > 0
                          ? "border-border hover:border-success-muted bg-card cursor-pointer"
                          : "border-danger bg-danger opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{partition.name}</p>
                        <div className="text-xs text-muted-foreground space-y-1 mt-1">
                          <p>{partition.product_name} ({partition.product_type})</p>
                          <p>Available: {actualProductQuantity} {partition.product_uom || "units"}</p>
                        </div>
                      </div>
                      {isSelected && <ChevronRight size={16} className="text-success" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
            <div className="text-xs text-warning-ink bg-warning-soft p-2 rounded">
              Available stock ({availableStock}) is less than requested ({currentRequest.quantity})
            </div>
          )}

          <Button
            onClick={handleSelectPartition}
            disabled={!canProceed}
            className="w-full bg-success hover:bg-success-alt text-card-foreground"
          >
            Proceed to Picking
          </Button>
        </div>
      )}
    </div>
  );
}
