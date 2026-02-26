"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function QuantityEntryStep() {
  const { selectedItem, selectedStructureId, requestedQuantity, setRequestedQuantity, setCurrentStep, selectStructure } = useStockOutStore();
  const [error, setError] = useState("");

  if (!selectedItem || !selectedStructureId) return null;

  // Find available quantity in selected structure
  const availableInStructure = selectedItem.allocations
    .filter((alloc: any) => alloc.structureId === selectedStructureId)
    .reduce((sum: number, alloc: any) => sum + alloc.allocatedQuantity, 0);

  const handleBack = () => {
    selectStructure("");
    setCurrentStep("select-structure");
  };

  const handleNext = () => {
    const qty = parseInt(String(requestedQuantity), 10);
    
    if (isNaN(qty) || qty <= 0) {
      setError("Please enter a valid quantity");
      return;
    }
    
    if (qty > availableInStructure) {
      setError(`Quantity cannot exceed available stock (${availableInStructure})`);
      return;
    }
    
    setError("");
    setCurrentStep("completion");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mb-2"
        >
          <ChevronLeft size={14} />
          Back to Structures
        </button>
        <h3 className="text-sm font-semibold text-foreground">Enter Quantity</h3>
        <p className="text-xs text-muted-foreground mt-1">
          How many units to pick?
        </p>
      </div>

      {/* Item & Structure Info */}
      <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/30 space-y-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Product</p>
          <p className="text-sm font-semibold text-foreground">{selectedItem.productName}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Available in Structure</p>
          <p className="text-sm font-semibold text-foreground">
            {availableInStructure} {selectedItem.productUOM}
          </p>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground block">
          Stock Out Quantity
        </label>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <input
              type="number"
              min="1"
              max={availableInStructure}
              value={requestedQuantity || ""}
              onChange={(e) => {
                setRequestedQuantity(parseInt(e.target.value, 10) || 0);
                setError("");
              }}
              placeholder="Enter quantity"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max: {availableInStructure} {selectedItem.productUOM}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-2 rounded bg-red-50 border border-red-200">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Summary */}
        {requestedQuantity > 0 && !error && (
          <div className="p-2 rounded bg-green-50 border border-green-200">
            <p className="text-xs text-green-700">
              Ready to pick {requestedQuantity} {selectedItem.productUOM}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleNext}
          disabled={requestedQuantity <= 0 || !!error}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Confirmation
        </button>
      </div>
    </div>
  );
}
