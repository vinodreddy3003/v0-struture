"use client";

import { useState } from "react";
import { useStockOutStore, type PickingLocation } from "@/store/stock-out-store";
import { ChevronRight, MapPin } from "lucide-react";

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

interface Level {
  id: string;
  name: string;
  partitions?: Partition[];
}

interface Partition {
  id: string;
  name: string;
  availableQuantity: number;
}

// Mock data - in real app, this would come from props or context
const MOCK_ZONES: Zone[] = [
  {
    id: "zone-1",
    name: "Zone A - Raw Materials",
    structures: [
      {
        id: "struct-1",
        name: "Structure 1",
        levels: [
          {
            id: "level-1",
            name: "Level 1",
            partitions: [
              { id: "part-1", name: "Partition 1A", availableQuantity: 50 },
              { id: "part-2", name: "Partition 1B", availableQuantity: 30 },
            ],
          },
          {
            id: "level-2",
            name: "Level 2",
            partitions: [
              { id: "part-3", name: "Partition 2A", availableQuantity: 20 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "zone-2",
    name: "Zone B - Finished Goods",
    structures: [
      {
        id: "struct-2",
        name: "Structure 2",
        levels: [
          {
            id: "level-3",
            name: "Level 1",
            partitions: [
              { id: "part-4", name: "Partition 1A", availableQuantity: 100 },
            ],
          },
        ],
      },
    ],
  },
];

export function StockOutZoneSelectionStep() {
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

  const [expandedZone, setExpandedZone] = useState<string | null>(selectedZoneId || MOCK_ZONES[0]?.id);
  const [expandedStructure, setExpandedStructure] = useState<string | null>(selectedStructureId);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(selectedLevelId);

  const currentZone = MOCK_ZONES.find((z) => z.id === expandedZone);
  const currentStructure = currentZone?.structures?.find((s) => s.id === expandedStructure);
  const currentLevel = currentStructure?.levels?.find((l) => l.id === expandedLevel);

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
    if (!expandedZone || !expandedStructure || !expandedLevel) {
      return;
    }

    // Create picking locations from available partitions
    const zone = MOCK_ZONES.find((z) => z.id === expandedZone);
    const structure = zone?.structures?.find((s) => s.id === expandedStructure);
    const level = structure?.levels?.find((l) => l.id === expandedLevel);

    if (level?.partitions) {
      const locations: PickingLocation[] = level.partitions.map((partition) => ({
        zoneId: expandedZone,
        zoneName: zone?.name || "",
        structureId: expandedStructure,
        structureName: structure?.name || "",
        levelId: expandedLevel,
        levelName: level.name,
        partitionId: partition.id,
        partitionName: partition.name,
        availableQuantity: partition.availableQuantity,
      }));

      setAvailableLocations(locations);
      startPicking();
    }
  };

  const isLocationSelected = expandedZone && expandedStructure && expandedLevel;

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
            {MOCK_ZONES.map((zone) => (
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
            {currentZone?.structures ? (
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
            {currentStructure?.levels ? (
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
            {currentLevel.partitions && (
              <ul className="mt-2 space-y-1 pl-4 list-disc">
                {currentLevel.partitions.map((part) => (
                  <li key={part.id}>
                    {part.name} - {part.availableQuantity} units
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
