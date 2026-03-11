"use client";

import { useState, useMemo } from "react";
import { useStockOutStore, type PickingLocation } from "@/store/stock-out-store";
import { ChevronRight, MapPin, AlertCircle } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { ZoneData, StructureData, Level, Partition } from "@/components/warehouse/types";

interface Zone {
  id: string;
  name: string;
  structures?: Structure[];
}

interface Structure {
  id: string;
  name: string;
  levels?: Level[];
}

interface StockOutZoneSelectionStepProps {
  nodes?: Node[];
}

export function StockOutZoneSelectionStep({ nodes = [] }: StockOutZoneSelectionStepProps) {
  const {
    selectedZoneId,
    selectedStructureId,
    selectedLevelId,
    selectZone,
    selectStructure,
    selectLevel,
    startPicking,
    setAvailableLocations,
  } = useStockOutStore();

  // Transform nodes into zone hierarchy
  const zones = useMemo(() => {
    const zoneList: Zone[] = [];

    // Get zone nodes
    const zoneNodes = nodes.filter((n) => n.type === "zone");

    zoneNodes.forEach((zoneNode) => {
      const zoneData = zoneNode.data as ZoneData;
      const structures: Structure[] = [];

      // Get structures within this zone
      const structureNodes = nodes.filter(
        (n) => n.type === "structure" && n.data && (n.data as StructureData).parentZoneId === zoneNode.id
      );

      structureNodes.forEach((structureNode) => {
        const structureData = structureNode.data as StructureData;
        structures.push({
          id: structureNode.id,
          name: structureData.label,
          levels: structureData.levels || [],
        });
      });

      zoneList.push({
        id: zoneNode.id,
        name: zoneData.label,
        structures,
      });
    });

    return zoneList;
  }, [nodes]);

  const [expandedZone, setExpandedZone] = useState<string | null>(selectedZoneId || zones[0]?.id || null);
  const [expandedStructure, setExpandedStructure] = useState<string | null>(selectedStructureId);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(selectedLevelId);

  const currentZone = zones.find((z) => z.id === expandedZone);
  const currentStructure = currentZone?.structures?.find((s) => s.id === expandedStructure);
  const currentLevel = currentStructure?.levels?.find((l) => l.id === expandedLevel);

  // Check if warehouse is configured
  const hasWarehouse = nodes.some((n) => n.type === "warehouse");
  const hasZones = zones.length > 0;

  const handleZoneSelect = (zoneId: string) => {
    selectZone(zoneId);
    setExpandedZone(zoneId);
    setExpandedStructure(null);
    setExpandedLevel(null);
  };

  const handleStructureSelect = (structureId: string) => {
    selectStructure(structureId);
    setExpandedStructure(structureId);
    setExpandedLevel(null);
  };

  const handleLevelSelect = (levelId: string) => {
    selectLevel(levelId);
    setExpandedLevel(levelId);
  };

  const handleConfirmLocation = () => {
    if (!expandedZone || !expandedStructure || !expandedLevel || !currentLevel) {
      return;
    }

    // Create picking locations from available partitions
    const zone = zones.find((z) => z.id === expandedZone);
    const structure = zone?.structures?.find((s) => s.id === expandedStructure);

    if (currentLevel.partitions && currentLevel.partitions.length > 0) {
      const locations: PickingLocation[] = currentLevel.partitions.map((partition) => ({
        zoneId: expandedZone,
        zoneName: zone?.name || "",
        structureId: expandedStructure,
        structureName: structure?.name || "",
        levelId: expandedLevel,
        levelName: currentLevel.name,
        partitionId: partition.id,
        partitionName: partition.name,
        availableQuantity: partition.used_capacity || 0, // Use current stock as available
      }));

      setAvailableLocations(locations);
      startPicking();
    }
  };

  const isLocationSelected = expandedZone && expandedStructure && expandedLevel;

  if (!hasWarehouse) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Select Warehouse Location</h2>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">No warehouse configured</p>
            <p>Create a warehouse design first to select locations for picking.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasZones) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Select Warehouse Location</h2>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">No zones available</p>
            <p>Create zones and structures in design mode to select picking locations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Select Warehouse Location</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Zones */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin size={16} />
            Zones
          </h3>
          <div className="space-y-2 border border-border rounded-lg p-3 bg-background">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneSelect(zone.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  expandedZone === zone.id
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>

        {/* Structures */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Structures</h3>
          <div className="space-y-2 border border-border rounded-lg p-3 bg-background min-h-[200px]">
            {currentZone?.structures && currentZone.structures.length > 0 ? (
              currentZone.structures.map((structure) => (
                <button
                  key={structure.id}
                  onClick={() => handleStructureSelect(structure.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    expandedStructure === structure.id
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {structure.name}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Select a zone first</p>
            )}
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Levels</h3>
          <div className="space-y-2 border border-border rounded-lg p-3 bg-background min-h-[200px]">
            {currentStructure?.levels && currentStructure.levels.length > 0 ? (
              currentStructure.levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    expandedLevel === level.id
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {level.name}
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Select a structure first</p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Location Summary */}
      {isLocationSelected && currentLevel && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Selected Location</h3>
          <div className="space-y-1 text-xs text-blue-800">
            <p>
              <span className="font-medium">Zone:</span> {currentZone?.name}
            </p>
            <p>
              <span className="font-medium">Structure:</span> {currentStructure?.name}
            </p>
            <p>
              <span className="font-medium">Level:</span> {currentLevel.name}
            </p>
            <p className="mt-2">
              <span className="font-medium">Available Partitions:</span> {currentLevel.partitions?.length || 0}
            </p>
            {currentLevel.partitions && currentLevel.partitions.length > 0 && (
              <ul className="mt-2 space-y-1 pl-4 list-disc">
                {currentLevel.partitions.map((part) => (
                  <li key={part.id}>
                    {part.name} - {part.used_capacity || 0} units
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirmLocation}
        disabled={!isLocationSelected}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={18} />
        Continue to Picking
      </button>
    </div>
  );
}
