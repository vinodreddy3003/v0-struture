"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { ChevronLeft } from "lucide-react";

export function ItemSelectionStep() {
  const { selectedItem, setCurrentStep, selectItem } = useStockOutStore();

  if (!selectedItem) return null;

  const handleBack = () => {
    selectItem("", null);
    setCurrentStep("inventory");
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
          Back to Inventory
        </button>
        <h3 className="text-sm font-semibold text-foreground">Select Location</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Choose where to pick {selectedItem.productName} from
        </p>
      </div>

      {/* Selected Item Info */}
      <div className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
        <p className="text-sm font-semibold text-foreground">{selectedItem.productName}</p>
        <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
          <p>Type: {selectedItem.productType}</p>
          <p>Total Available: {selectedItem.quantity} {selectedItem.productUOM}</p>
        </div>
      </div>

      {/* Selection Guidance */}
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-xs">Click on a structure below to select where to pick from</p>
      </div>
    </div>
  );
}
