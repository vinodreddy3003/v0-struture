"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Partition } from "@/components/warehouse/types";

interface PartitionLevelVisualizationProps {
  partition: Partition;
  isAllocated?: boolean;
}

export function PartitionLevelVisualization({
  partition,
  isAllocated = false,
}: PartitionLevelVisualizationProps) {
  const fillPercentage = (partition.used_capacity / partition.max_capacity) * 100;
  const remainingCapacity = partition.max_capacity - partition.used_capacity;

  const getCapacityColor = (percentage: number): string => {
    if (percentage < 40) return "#10b981"; // green
    if (percentage < 70) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getCapacityStatus = (percentage: number): string => {
    if (percentage < 40) return "Low";
    if (percentage < 70) return "Medium";
    return "High";
  };

  const tooltipContent = `
    Product: ${partition.product_name || "N/A"}
    Remaining: ${remainingCapacity}/${partition.max_capacity} units
    Status: ${getCapacityStatus(fillPercentage)}
  `;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col gap-1">
            {/* Partition Header */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{partition.name}</p>
                <p className="text-[10px] text-muted-foreground">{partition.code}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                fillPercentage < 40
                  ? "text-green-600 bg-green-50 border-green-200"
                  : fillPercentage < 70
                    ? "text-amber-600 bg-amber-50 border-amber-200"
                    : "text-red-600 bg-red-50 border-red-200"
              }`}>
                {getCapacityStatus(fillPercentage)}
              </span>
            </div>

            {/* Level Visualization Container */}
            <div className="relative w-full h-16 rounded-md border-2 overflow-hidden bg-muted/10"
              style={{
                borderColor: isAllocated ? "#3b82f6" : "#d1d5db",
              }}>
              {/* Fill Level */}
              <div
                className="absolute inset-y-0 left-0 transition-all duration-300"
                style={{
                  width: `${fillPercentage}%`,
                  backgroundColor: getCapacityColor(fillPercentage),
                  opacity: 0.7,
                }}
              />
              
              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <span className="text-xs font-bold text-foreground relative z-10">
                  {partition.used_capacity}/{partition.max_capacity}
                </span>
                <span className="text-[10px] text-muted-foreground relative z-10">
                  {fillPercentage.toFixed(0)}% filled
                </span>
              </div>
            </div>

            {/* Capacity Info */}
            <div className="text-[10px] text-muted-foreground text-center">
              {remainingCapacity} units available
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs whitespace-pre-line">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
