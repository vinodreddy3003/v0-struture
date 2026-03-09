"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Plus } from "lucide-react";

export function StockOutCompletionStep() {
  const {
    currentRequestId,
    requests,
    selectedPickingDetail,
    pickedQuantity,
    resetWorkflow,
    setCurrentStep,
  } = useStockOutStore();

  const currentRequest = currentRequestId
    ? requests.find((r) => r.id === currentRequestId)
    : null;

  const handleNewRequest = () => {
    resetWorkflow();
    setCurrentStep("request");
  };

  const handlePrintSlip = () => {
    // In a real app, this would generate a PDF or print receipt
    console.log("Printing picking slip for:", currentRequest?.orderReference);
  };

  if (!currentRequest || !selectedPickingDetail) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-900">No completed request to display</p>
      </div>
    );
  }

  const shortageQuantity = Math.max(0, currentRequest.quantity - pickedQuantity);

  return (
    <div className="space-y-4">
      {/* Success Banner */}
      <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg flex gap-3">
        <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-emerald-900">Stock Out Completed</p>
          <p className="text-sm text-emerald-800">
            Successfully picked {pickedQuantity} {currentRequest.productUOM} from warehouse
          </p>
        </div>
      </div>

      {/* Request Summary */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Request Summary</h3>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Order Reference</p>
            <p className="font-medium">{currentRequest.orderReference}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Date</p>
            <p className="font-medium">
              {new Date(currentRequest.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Product</p>
            <p className="font-medium">{currentRequest.productName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium mb-1">Type</p>
            <p className="font-medium">{currentRequest.productType}</p>
          </div>
        </div>
      </div>

      {/* Picking Details */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Picking Details</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Requested Quantity</span>
            <span className="font-semibold">{currentRequest.quantity} {currentRequest.productUOM}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-muted-foreground">Picked Quantity</span>
            <span className="font-semibold text-emerald-600">{pickedQuantity} {currentRequest.productUOM}</span>
          </div>
          {shortageQuantity > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Shortage</span>
              <span className="font-semibold text-amber-600">{shortageQuantity} {currentRequest.productUOM}</span>
            </div>
          )}
        </div>
      </div>

      {/* Location Details */}
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="text-sm font-semibold">Picked From Location</h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Zone</span>
            <span className="font-medium">{selectedPickingDetail.zoneName}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Rack/Shelf</span>
            <span className="font-medium">{selectedPickingDetail.structureName}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Level</span>
            <span className="font-medium">{selectedPickingDetail.levelName}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Position</span>
            <span className="font-medium">{selectedPickingDetail.partitionName}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {currentRequest.notes && (
        <div className="p-4 border rounded-lg bg-card space-y-2">
          <h3 className="text-sm font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            {currentRequest.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t">
        <Button
          onClick={handlePrintSlip}
          variant="outline"
          className="w-full"
        >
          <Download size={16} className="mr-2" />
          Download Picking Slip
        </Button>
        <Button
          onClick={handleNewRequest}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Create New Request
        </Button>
      </div>

      {/* History Hint */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
        <p>
          This stock out request has been marked as completed. The inventory has
          been updated accordingly.
        </p>
      </div>
    </div>
  );
}
