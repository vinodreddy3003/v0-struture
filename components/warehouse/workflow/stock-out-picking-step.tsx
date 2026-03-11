"use client";

import { useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { Trash2, Check } from "lucide-react";

export function StockOutPickingStep() {
  const {
    availableLocations,
    pickingAllocations,
    totalPickedQuantity,
    selectedRequestId,
    requests,
    addPickingAllocation,
    updatePickedQuantity,
    removePickingAllocation,
    confirmPicking,
  } = useStockOutStore();

  const selectedRequest = requests.find((req) => req.id === selectedRequestId);
  const [error, setError] = useState("");

  const handleAddLocation = (locationId: string, location: (typeof availableLocations)[0]) => {
    const existingAllocation = pickingAllocations.find((a) => a.locationId === locationId);
    if (!existingAllocation) {
      addPickingAllocation({
        locationId,
        location,
        pickedQuantity: 0,
      });
    }
  };

  const handleQuantityChange = (locationId: string, quantity: number) => {
    setError("");
    const location = availableLocations.find((l) =>
      l.partitionId === locationId
    );
    
    if (location && quantity > location.availableQuantity) {
      setError(`Quantity cannot exceed available quantity (${location.availableQuantity})`);
      return;
    }

    updatePickedQuantity(locationId, quantity);
  };

  const handleConfirm = () => {
    setError("");

    if (pickingAllocations.length === 0) {
      setError("Please add at least one picking location");
      return;
    }

    if (totalPickedQuantity === 0) {
      setError("Please pick at least one unit");
      return;
    }

    if (!selectedRequest || totalPickedQuantity > selectedRequest.quantity) {
      setError("Picked quantity cannot exceed requested quantity");
      return;
    }

    confirmPicking();
  };

  const remainingToPick = selectedRequest
    ? Math.max(0, selectedRequest.quantity - totalPickedQuantity)
    : 0;

  const progressPercentage = selectedRequest
    ? (totalPickedQuantity / selectedRequest.quantity) * 100
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Confirm Picking Order</h2>

      {/* Product Information */}
      {selectedRequest && (
        <div className="p-4 bg-background border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Product to Pick</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Product Name</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.productName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.productType}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Requested Quantity</p>
              <p className="text-sm font-semibold text-foreground">
                {selectedRequest.quantity} {selectedRequest.uom}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Vendor</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.vendor}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Picking Progress</span>
          <span className="text-sm font-semibold text-foreground">
            {totalPickedQuantity} / {selectedRequest?.quantity} {selectedRequest?.uom}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        {remainingToPick > 0 && (
          <p className="text-xs text-muted-foreground">
            Remaining: {remainingToPick} {selectedRequest?.uom}
          </p>
        )}
      </div>

      {/* Available Locations */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Select From Available Locations</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto border border-border rounded-lg p-3 bg-background">
          {availableLocations.map((location) => {
            const allocation = pickingAllocations.find((a) => a.locationId === location.partitionId);
            const isSelected = !!allocation;

            return (
              <div
                key={location.partitionId}
                className={`p-3 border rounded-md transition-colors ${
                  isSelected ? "bg-blue-50 border-blue-200" : "bg-background border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{location.partitionName}</p>
                    <p className="text-xs text-muted-foreground">
                      {location.zoneName} → {location.structureName} → {location.levelName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Available</p>
                    <p className="text-sm font-semibold text-foreground">{location.availableQuantity}</p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={location.availableQuantity}
                      value={allocation?.pickedQuantity || 0}
                      onChange={(e) =>
                        handleQuantityChange(location.partitionId, parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="flex-1 px-2 py-1.5 text-sm border border-border rounded-md bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removePickingAllocation(location.partitionId)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddLocation(location.partitionId, location)}
                    className="w-full px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Add from this location
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Pickings Summary */}
      {pickingAllocations.length > 0 && (
        <div className="p-4 bg-background border border-border rounded-lg space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">Picking Summary</h3>
          {pickingAllocations.map((allocation) => (
            <div key={allocation.locationId} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{allocation.location.partitionName}</span>
              <span className="font-semibold text-foreground">
                {allocation.pickedQuantity} {selectedRequest?.uom}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-foreground">Total Picked</span>
              <span className="text-blue-600">
                {totalPickedQuantity} {selectedRequest?.uom}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
      >
        <Check size={18} />
        Confirm Picking
      </button>
    </div>
  );
}
