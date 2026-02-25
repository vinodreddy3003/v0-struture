"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Partition } from "@/components/warehouse/types";

interface StockInFormProps {
  partition: Partition;
  structureId: string;
  levelId: string;
  onUpdate: (partition: Partition) => void;
  onCancel: () => void;
}

export function StockInForm({
  partition,
  structureId,
  levelId,
  onUpdate,
  onCancel,
}: StockInFormProps) {
  const [usedCapacity, setUsedCapacity] = useState(partition.used_capacity.toString());
  const [productName, setProductName] = useState(partition.product_name || "");
  const [productType, setProductType] = useState(partition.product_type || "");
  const [productValue, setProductValue] = useState((partition.product_value || 0).toString());
  const [productUom, setProductUom] = useState(partition.product_uom || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const used = parseInt(usedCapacity, 10);

    if (isNaN(used)) {
      setError("Used capacity must be a number");
      return;
    }

    if (used < 0 || used > partition.max_capacity) {
      setError(`Used capacity must be between 0 and ${partition.max_capacity}`);
      return;
    }

    const updatedPartition: Partition = {
      ...partition,
      used_capacity: used,
      product_name: productName,
      product_type: productType,
      product_value: productValue ? parseFloat(productValue) : undefined,
      product_uom: productUom,
    };

    onUpdate(updatedPartition);
  };

  const capacityPercentage = Math.round((partition.used_capacity / partition.max_capacity) * 100);

  const getCapacityColor = (fillPercentage: number): string => {
    if (fillPercentage < 40) return "bg-green-100 border-green-300";
    if (fillPercentage < 70) return "bg-amber-100 border-amber-300";
    return "bg-red-100 border-red-300";
  };

  const getCapacityTextColor = (fillPercentage: number): string => {
    if (fillPercentage < 40) return "text-green-700";
    if (fillPercentage < 70) return "text-amber-700";
    return "text-red-700";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-card rounded-lg border border-border">
      {/* Partition Info Header */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">{partition.name}</h3>
        <p className="text-xs text-muted-foreground">Code: {partition.code}</p>
      </div>

      {/* Capacity Indicator */}
      <div className={`p-3 rounded-md border-2 ${getCapacityColor(capacityPercentage)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold ${getCapacityTextColor(capacityPercentage)}`}>
            Current Capacity
          </span>
          <span className={`text-sm font-bold ${getCapacityTextColor(capacityPercentage)}`}>
            {capacityPercentage}%
          </span>
        </div>
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-current transition-all duration-300"
            style={{
              width: `${capacityPercentage}%`,
              backgroundColor:
                capacityPercentage < 40
                  ? "#10b981"
                  : capacityPercentage < 70
                    ? "#f59e0b"
                    : "#ef4444",
            }}
          />
        </div>
      </div>

      {/* Used Capacity Input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-foreground">
          Used Capacity (0 - {partition.max_capacity})
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max={partition.max_capacity}
            value={usedCapacity}
            onChange={(e) => {
              setUsedCapacity(e.target.value);
              setError("");
            }}
            className="flex-1 px-2 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <span className="text-xs text-muted-foreground font-medium">
            / {partition.max_capacity}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="border-t border-border pt-3 mt-1">
        <p className="text-xs font-medium text-foreground mb-2">Product Information</p>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name"
            className="px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="Product type"
            className="px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.01"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
              placeholder="Value"
              className="px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={productUom}
              onChange={(e) => setProductUom(e.target.value)}
              placeholder="UOM"
              className="px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 text-xs text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Check size={14} />
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}
