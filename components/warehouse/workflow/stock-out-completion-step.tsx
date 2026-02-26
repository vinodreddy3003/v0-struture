"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle, Package, Calendar } from "lucide-react";

export function StockOutCompletionStep() {
  const { selectedItem, requestedQuantity, selectedStructureId, resetWorkflow } = useStockOutStore();

  if (!selectedItem) return null;

  const handleNewStockOut = () => {
    resetWorkflow();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Stock Out Completed</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Stock out process successfully completed
        </p>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-green-900">Stock Out Successfully Completed</p>
            <p className="text-xs text-green-800 mt-1">
              Items have been picked from the warehouse and inventory updated.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Transaction Summary</h4>

        {/* Product Info */}
        <div className="flex gap-3 bg-background p-3 rounded-lg">
          <Package className="text-blue-600 flex-shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {selectedItem.productName}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedItem.productType}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Quantity Picked</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {requestedQuantity} <span className="text-xs text-muted-foreground">{selectedItem.productUOM}</span>
            </p>
          </div>
          <div className="bg-background p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Total Value</p>
            <p className="text-lg font-bold text-foreground mt-1">
              ${(selectedItem.productValue * requestedQuantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Structure & Date */}
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Structure:</span>
            <span className="text-xs font-semibold text-foreground">{selectedStructureId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Date:</span>
            <span className="text-xs font-semibold text-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <button
          onClick={handleNewStockOut}
          className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Start New Stock Out
        </button>
      </div>
    </div>
  );
}
