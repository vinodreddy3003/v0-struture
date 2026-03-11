"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle, Download } from "lucide-react";

export function StockOutCompletionStep() {
  const { selectedRequestId, requests, pickingAllocations, resetWorkflow } = useStockOutStore();

  const selectedRequest = requests.find((req) => req.id === selectedRequestId);

  const handleDownloadSummary = () => {
    if (!selectedRequest || pickingAllocations.length === 0) return;

    const summary = `
STOCK OUT COMPLETION SUMMARY
========================================
Date: ${new Date().toLocaleString()}
Request ID: ${selectedRequest.id}

PRODUCT INFORMATION:
  Product Name: ${selectedRequest.productName}
  Product Type: ${selectedRequest.productType}
  Vendor: ${selectedRequest.vendor}
  Product Value: $${selectedRequest.productValue.toFixed(2)}
  UOM: ${selectedRequest.uom}

REQUESTED vs PICKED:
  Requested Quantity: ${selectedRequest.quantity} ${selectedRequest.uom}
  Total Picked: ${pickingAllocations.reduce((sum, a) => sum + a.pickedQuantity, 0)} ${selectedRequest.uom}

PICKING DETAILS:
${pickingAllocations
  .map(
    (alloc) => `
  Location: ${alloc.location.zoneName} / ${alloc.location.structureName} / ${alloc.location.levelName} / ${alloc.location.partitionName}
  Picked Quantity: ${alloc.pickedQuantity} ${selectedRequest.uom}
`
  )
  .join("")}

Status: COMPLETED
========================================
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(summary));
    element.setAttribute("download", `stock-out-${selectedRequest.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalPicked = pickingAllocations.reduce((sum, a) => sum + a.pickedQuantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Stock Out Complete!</h2>
        <p className="text-center text-muted-foreground">
          Your stock out workflow has been successfully completed.
        </p>
      </div>

      {/* Summary Card */}
      {selectedRequest && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Workflow Summary</h3>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-green-200">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Product Name</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.productName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Product Type</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.productType}</p>
            </div>
          </div>

          {/* Quantity Details */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-green-200">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Requested Quantity</p>
              <p className="text-lg font-bold text-foreground">
                {selectedRequest.quantity} {selectedRequest.uom}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Total Picked</p>
              <p className="text-lg font-bold text-green-600">
                {totalPicked} {selectedRequest.uom}
              </p>
            </div>
          </div>

          {/* Vendor & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Vendor</p>
              <p className="text-sm font-semibold text-foreground">{selectedRequest.vendor}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Product Value</p>
              <p className="text-sm font-semibold text-foreground">
                ${selectedRequest.productValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Picking Details */}
      <div className="p-4 bg-background border border-border rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Picking Details</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {pickingAllocations.map((allocation, idx) => (
            <div key={allocation.locationId} className="p-3 bg-muted/30 rounded-md border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {idx + 1}. {allocation.location.partitionName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {allocation.location.zoneName} → {allocation.location.structureName} →{" "}
                    {allocation.location.levelName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Picked Quantity</p>
                  <p className="text-sm font-bold text-green-600">
                    {allocation.pickedQuantity} {selectedRequest?.uom}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
        <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
        Status: Completed
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleDownloadSummary}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Download size={18} />
          Download Summary
        </button>
        <button
          onClick={resetWorkflow}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          New Request
        </button>
      </div>
    </div>
  );
}
