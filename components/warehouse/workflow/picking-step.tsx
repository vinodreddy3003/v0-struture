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
              Partitions - Select & Pick Product
            </label>
            <div className="space-y-2">
              {partitions.map((partition) => {
                const isPicked = picks.some(
                  (p) => p.partitionId === partition.id
                );
                const availableQuantity = partition.maxCapacity - partition.usedCapacity;
                const canPick = availableQuantity > 0 && remainingQuantity > 0 && !isPicked;
                
                return (
                  <div
                    key={partition.id}
                    className={`border rounded-lg p-3 transition-all ${
                      isPicked
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : canPick
                          ? "border-border bg-background hover:border-green-300 hover:bg-green-50/30"
                          : "border-red-300 bg-red-50/20"
                    }`}
                  >
                    {/* Partition Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {partition.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Code: {partition.code}
                        </p>
                      </div>
                      {isPicked && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                          ✓ Picked
                        </span>
                      )}
                      {!canPick && !isPicked && availableQuantity === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                          Full
                        </span>
                      )}
                    </div>

                    {/* Capacity Info */}
                    <div className="mb-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium text-foreground">
                          {partition.usedCapacity} / {partition.maxCapacity}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            partition.usedCapacity / partition.maxCapacity > 0.8
                              ? "bg-red-500"
                              : partition.usedCapacity / partition.maxCapacity > 0.5
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${(partition.usedCapacity / partition.maxCapacity) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Available: {availableQuantity} units
                      </div>
                    </div>

                    {/* Pick Controls */}
                    {!isPicked && canPick && (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-foreground block mb-1">
                            Pick Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={Math.min(remainingQuantity, availableQuantity)}
                            value={pickQuantity}
                            onChange={(e) => setPickQuantity(e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Max: {Math.min(remainingQuantity, availableQuantity)} {currentRequest.productUOM}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleAddPick(partition.id, partition.name)
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors h-fit"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}

                    {isPicked && (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">Picked Quantity</p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            {picks.find((p) => p.partitionId === partition.id)?.pickedQuantity} {currentRequest.productUOM}
                          </p>
                        </div>
                        <button
                          onClick={() => removePick(partition.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors h-fit"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {!canPick && !isPicked && (
                      <div className="text-xs text-muted-foreground italic">
                        {availableQuantity === 0 
                          ? "Partition is at full capacity"
                          : "No remaining quantity to pick"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Picked Items Summary */}
      {picks.length > 0 && (
        <div className="border border-green-300 rounded-lg p-3 bg-green-50">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold">
              {picks.length}
            </span>
            Picked Locations
          </h4>
          <div className="space-y-2">
            {picks.map((pick, index) => (
              <div
                key={pick.partitionId}
                className="flex items-center justify-between p-2.5 bg-white rounded border border-green-200 hover:border-green-400 transition-colors"
              >
                <div className="text-xs flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-foreground">
                      {pick.partitionName}
                    </p>
                  </div>
                  <p className="text-muted-foreground pl-7">
                    Qty: <span className="font-medium text-green-600">{pick.pickedQuantity}</span> {currentRequest.productUOM}
                  </p>
                </div>
                <button
                  onClick={() => removePick(pick.partitionId)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove this pick"
                >
                  <Trash2 size={16} />
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
