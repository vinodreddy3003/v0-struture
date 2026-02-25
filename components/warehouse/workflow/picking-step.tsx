"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Node } from "@xyflow/react";

interface PickingStepProps {
  nodes: Node[];
}

export function PickingStep({ nodes }: PickingStepProps) {
  const {
    currentRequestId,
    requests,
    picks,
    remainingQuantity,
    selectedZoneId,
    selectedStructureId,
    selectedLevelId,
    selectZone,
    selectStructure,
    selectLevel,
    addPick,
    removePick,
    setCurrentStep,
  } = useStockOutStore();

  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [expandedStructure, setExpandedStructure] = useState<string | null>(null);
  const [pickQuantity, setPickQuantity] = useState("0");

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  // Get zones from nodes
  const zones = nodes.filter((n) => n.type === "zone");

  // Get structures for selected zone
  const structures = selectedZoneId
    ? nodes.filter(
        (n) =>
          n.type === "structure" &&
          n.parentNode === selectedZoneId
      )
    : [];

  // Get levels for selected structure (mock - in real app from warehouse data)
  const levels = selectedStructureId
    ? [
        {
          id: `level-1-${selectedStructureId}`,
          name: "Level 1",
          code: "L1",
        },
        {
          id: `level-2-${selectedStructureId}`,
          name: "Level 2",
          code: "L2",
        },
        {
          id: `level-3-${selectedStructureId}`,
          name: "Level 3",
          code: "L3",
        },
      ]
    : [];

  // Get partitions for selected level (mock - in real app from warehouse data)
  const partitions = selectedLevelId
    ? [
        {
          id: `part-1-${selectedLevelId}`,
          name: `Partition A`,
          code: "PA",
          usedCapacity: 45,
          maxCapacity: 100,
        },
        {
          id: `part-2-${selectedLevelId}`,
          name: `Partition B`,
          code: "PB",
          usedCapacity: 78,
          maxCapacity: 100,
        },
        {
          id: `part-3-${selectedLevelId}`,
          name: `Partition C`,
          code: "PC",
          usedCapacity: 32,
          maxCapacity: 100,
        },
      ]
    : [];

  const handleAddPick = (partitionId: string, partitionName: string) => {
    const quantity = parseInt(pickQuantity, 10);
    if (isNaN(quantity) || quantity <= 0 || quantity > remainingQuantity) {
      alert(
        `Please enter a valid quantity between 1 and ${remainingQuantity}`
      );
      return;
    }

    addPick({
      structureId: selectedStructureId!,
      levelId: selectedLevelId!,
      partitionId,
      partitionName,
      pickedQuantity: quantity,
    });

    setPickQuantity("0");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Picking Process</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select product locations and pick quantities from warehouse
        </p>
      </div>

      {/* Product Info */}
      <div className="border border-border rounded-lg p-3 bg-muted/30">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {currentRequest.productName}
          </p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Type: {currentRequest.productType}</p>
            <p>Total Required: {currentRequest.quantity} {currentRequest.productUOM}</p>
            <p>Customer: {currentRequest.customer}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-background border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Picking Progress</span>
          <span className="text-xs font-semibold text-foreground">
            {currentRequest.quantity - remainingQuantity} / {currentRequest.quantity}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${
                ((currentRequest.quantity - remainingQuantity) /
                  currentRequest.quantity) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Warehouse Navigation */}
      <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/10 max-h-96 overflow-y-auto">
        {/* Zones */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Zone</label>
          <div className="space-y-1">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => {
                  selectZone(selectedZoneId === zone.id ? null : zone.id);
                  setExpandedZone(
                    expandedZone === zone.id ? null : zone.id
                  );
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${
                  selectedZoneId === zone.id
                    ? "bg-blue-600 text-white"
                    : "bg-background border border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{zone.data?.label || zone.id}</span>
                  {expandedZone === zone.id && <ChevronDown size={14} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Structures */}
        {selectedZoneId && structures.length > 0 && (
          <div className="space-y-2 pl-2 border-l-2 border-blue-200">
            <label className="text-xs font-medium text-foreground">
              Structure
            </label>
            <div className="space-y-1">
              {structures.map((struct) => (
                <button
                  key={struct.id}
                  onClick={() => {
                    selectStructure(
                      selectedStructureId === struct.id ? null : struct.id
                    );
                    setExpandedStructure(
                      expandedStructure === struct.id ? null : struct.id
                    );
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${
                    selectedStructureId === struct.id
                      ? "bg-amber-600 text-white"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{struct.data?.label || struct.id}</span>
                    {expandedStructure === struct.id && (
                      <ChevronDown size={14} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Levels */}
        {selectedStructureId && levels.length > 0 && (
          <div className="space-y-2 pl-2 border-l-2 border-amber-200">
            <label className="text-xs font-medium text-foreground">Level</label>
            <div className="space-y-1">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    selectLevel(selectedLevelId === level.id ? null : level.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${
                    selectedLevelId === level.id
                      ? "bg-green-600 text-white"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{level.name}</span>
                    <span className="text-xs opacity-75">{level.code}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Partitions with Pick Quantity */}
        {selectedLevelId && partitions.length > 0 && (
          <div className="space-y-2 pl-2 border-l-2 border-green-200">
            <label className="text-xs font-medium text-foreground">
              Partitions
            </label>
            <div className="space-y-2">
              {partitions.map((partition) => {
                const isPicked = picks.some(
                  (p) => p.partitionId === partition.id
                );
                return (
                  <div
                    key={partition.id}
                    className={`border rounded-lg p-2 transition-colors ${
                      isPicked
                        ? "border-green-500 bg-green-50"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="text-xs font-medium mb-2">
                      <span className="text-foreground">{partition.name}</span>
                      <span className="text-muted-foreground ml-2">
                        ({partition.usedCapacity}/{partition.maxCapacity})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max={remainingQuantity}
                        value={pickQuantity}
                        onChange={(e) => setPickQuantity(e.target.value)}
                        placeholder="Qty"
                        className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background text-foreground"
                      />
                      <button
                        onClick={() =>
                          handleAddPick(partition.id, partition.name)
                        }
                        disabled={remainingQuantity === 0 || isPicked}
                        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                          remainingQuantity === 0 || isPicked
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Picked Items Summary */}
      {picks.length > 0 && (
        <div className="border border-border rounded-lg p-3 bg-green-50">
          <h4 className="text-xs font-semibold text-foreground mb-2">
            Picked Items ({picks.length})
          </h4>
          <div className="space-y-2">
            {picks.map((pick) => (
              <div
                key={pick.partitionId}
                className="flex items-center justify-between p-2 bg-white rounded border border-green-200"
              >
                <div className="text-xs">
                  <p className="font-medium text-foreground">
                    {pick.partitionName}
                  </p>
                  <p className="text-muted-foreground">
                    {pick.pickedQuantity} {currentRequest.productUOM}
                  </p>
                </div>
                <button
                  onClick={() => removePick(pick.partitionId)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
        <p className="text-xs text-blue-900">
          Navigate through zones, structures, and levels to locate products. Add picks by entering
          quantity and clicking the add button. Continue until you've picked the required quantity.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("request")}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back to Requests
        </button>
        <button
          onClick={() => setCurrentStep("verification")}
          disabled={remainingQuantity > 0 || picks.length === 0}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            remainingQuantity > 0 || picks.length === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Continue to Verification
        </button>
      </div>
    </div>
  );
}
