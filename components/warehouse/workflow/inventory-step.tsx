"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { useStockInStore } from "@/store/stock-in-store";
import { ChevronRight } from "lucide-react";

export function InventoryStep() {
  const { setCurrentStep, selectItem, loadStructuresForItem } = useStockOutStore();
  const { requests: stockInRequests } = useStockInStore();

  // Extract available inventory from Stock In requests
  const availableItems = stockInRequests
    .filter((req) => req.status === "completed" && req.allocations.length > 0)
    .map((req) => ({
      id: req.id,
      productName: req.productName,
      productType: req.productType,
      productValue: req.productValue,
      productUOM: req.productUOM,
      quantity: req.allocations.reduce((sum, alloc) => sum + alloc.allocatedQuantity, 0),
      stockInRequestId: req.id,
      allocations: req.allocations,
    }))
    .filter((item) => item.quantity > 0);

  const handleSelectItem = (item: any) => {
    selectItem(item.id, item);
    
    // Go directly to structure selection (skip item-selection step)
    setCurrentStep("select-structure");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Available Inventory</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select an item to stock out
        </p>
      </div>

      {/* Items List */}
      {availableItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-xs">No items available for stock out</p>
          <p className="text-xs mt-2">Complete Stock In requests first to see available inventory</p>
        </div>
      ) : (
        <div className="space-y-2">
          {availableItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className="w-full p-3 border border-border rounded-lg bg-background hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                  <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                    <p>Type: {item.productType}</p>
                    <p>Available: {item.quantity} {item.productUOM}</p>
                    <p>Locations: {item.allocations.length}</p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground mt-1" size={16} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
