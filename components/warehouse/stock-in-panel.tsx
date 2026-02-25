"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, PackageIcon, X } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { StructureData, Partition } from "@/components/warehouse/types";
import { StockInForm } from "./forms/stock-in-form";
import { useStockInStore } from "@/store/stock-in-store";

interface StockInPanelProps {
  isOpen: boolean;
  nodes: Node[];
  onPartitionUpdate: (structureId: string, levelId: string, partition: Partition) => void;
  onClose: () => void;
}

export function StockInPanel({
  isOpen,
  nodes,
  onPartitionUpdate,
  onClose,
}: StockInPanelProps) {
  const [expandedStructures, setExpandedStructures] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  
  const { selectedStructureId, selectedLevelId, selectedPartition, selectPartition, clearSelection } = useStockInStore();

  // Get all structures from nodes
  const structures = useMemo(
    () => nodes.filter((n) => n.type === "structure") as Node<StructureData>[],
    [nodes]
  );

  const toggleStructure = (structureId: string) => {
    const newSet = new Set(expandedStructures);
    if (newSet.has(structureId)) {
      newSet.delete(structureId);
    } else {
      newSet.add(structureId);
    }
    setExpandedStructures(newSet);
  };

  const toggleLevel = (levelId: string) => {
    const newSet = new Set(expandedLevels);
    if (newSet.has(levelId)) {
      newSet.delete(levelId);
    } else {
      newSet.add(levelId);
    }
    setExpandedLevels(newSet);
  };

  const getCapacityStatus = (used: number, max: number) => {
    const percentage = (used / max) * 100;
    if (percentage < 40) return { label: "Low", color: "text-green-600 bg-green-50 border-green-200" };
    if (percentage < 70) return { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "High", color: "text-red-600 bg-red-50 border-red-200" };
  };

  const handlePartitionClick = (partition: Partition, structureId: string, levelId: string) => {
    selectPartition(structureId, levelId, partition);
  };

  const handleUpdatePartition = (partition: Partition) => {
    if (selectedStructureId && selectedLevelId) {
      onPartitionUpdate(selectedStructureId, selectedLevelId, partition);
      clearSelection();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end md:items-center md:justify-end">
      <div className="w-full md:w-96 h-full md:h-auto md:rounded-lg bg-background border border-border shadow-xl flex flex-col max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <PackageIcon size={18} className="text-foreground" />
            <h2 className="font-semibold text-foreground">Stock In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedPartition && selectedStructureId && selectedLevelId ? (
            <div className="p-4">
              <StockInForm
                partition={selectedPartition}
                structureId={selectedStructureId}
                levelId={selectedLevelId}
                onUpdate={handleUpdatePartition}
                onCancel={clearSelection}
              />
            </div>
          ) : (
            <div className="p-4">
              {structures.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No structures available</p>
                  <p className="text-xs mt-1">Create structures in Design mode first</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {structures.map((structure) => {
                    const data = structure.data as StructureData;
                    const isExpanded = expandedStructures.has(structure.id);
                    const capacityPercentage = Math.round(
                      (data.used_capacity / data.max_capacity) * 100
                    );

                    return (
                      <div key={structure.id} className="border border-border rounded-md overflow-hidden">
                        {/* Structure Header */}
                        <button
                          onClick={() => toggleStructure(structure.id)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted transition-colors text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown size={16} className="text-muted-foreground" />
                            ) : (
                              <ChevronRight size={16} className="text-muted-foreground" />
                            )}
                            <div className="text-left">
                              <p className="font-medium text-foreground">{data.label}</p>
                              <p className="text-xs text-muted-foreground">{data.code}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium text-foreground">
                              {capacityPercentage}%
                            </span>
                          </div>
                        </button>

                        {/* Structure Content */}
                        {isExpanded && (
                          <div className="border-t border-border bg-muted/30">
                            {data.levels.map((level) => {
                              const isLevelExpanded = expandedLevels.has(level.id);
                              const levelCapacityPercentage = Math.round(
                                (level.partitions.reduce((sum, p) => sum + p.used_capacity, 0) /
                                  level.partitions.reduce((sum, p) => sum + p.max_capacity, 0)) *
                                  100
                              );

                              return (
                                <div key={level.id} className="border-t border-border">
                                  {/* Level Header */}
                                  <button
                                    onClick={() => toggleLevel(level.id)}
                                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors text-sm bg-muted/20"
                                  >
                                    <div className="flex items-center gap-2">
                                      {isLevelExpanded ? (
                                        <ChevronDown size={14} className="text-muted-foreground" />
                                      ) : (
                                        <ChevronRight size={14} className="text-muted-foreground" />
                                      )}
                                      <p className="text-xs font-medium text-foreground">{level.name}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {levelCapacityPercentage}%
                                    </span>
                                  </button>

                                  {/* Partitions */}
                                  {isLevelExpanded && (
                                    <div className="px-2 py-2 space-y-1 bg-muted/10">
                                      {level.partitions.map((partition) => {
                                        const status = getCapacityStatus(
                                          partition.used_capacity,
                                          partition.max_capacity
                                        );
                                        const percentage = Math.round(
                                          (partition.used_capacity / partition.max_capacity) * 100
                                        );

                                        return (
                                          <button
                                            key={partition.id}
                                            onClick={() =>
                                              handlePartitionClick(
                                                partition,
                                                structure.id,
                                                level.id
                                              )
                                            }
                                            className={`w-full text-left px-2 py-1.5 rounded-md border transition-all ${
                                              selectedPartition?.id === partition.id
                                                ? "ring-2 ring-blue-500 " + status.color
                                                : "border-border hover:bg-accent"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <div>
                                                <p className="text-xs font-medium text-foreground">
                                                  {partition.name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                  {partition.code}
                                                </p>
                                              </div>
                                              <span
                                                className={`text-xs font-bold px-1.5 py-0.5 rounded ${status.color} border`}
                                              >
                                                {status.label}
                                              </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] text-muted-foreground">
                                                {partition.used_capacity}/{partition.max_capacity}
                                              </span>
                                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
