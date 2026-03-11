"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle, Download, TrendingDown } from "lucide-react";

export function StockOutCompletionStep() {
  const { currentRequest, pickingAllocations, resetWorkflow } = useStockOutStore();

  if (!currentRequest) return null;

  const handleDownloadSummary = () => {
    if (!currentRequest || pickingAllocations.length === 0) return;

    const totalPicked = pickingAllocations.reduce((sum, a) => sum + a.pickedQuantity, 0);

    const summary = `
STOCK OUT COMPLETION SUMMARY
========================================
Date: ${new Date().toLocaleString()}
Request ID: ${currentRequest.id}

PRODUCT INFORMATION:
  Product Name: ${currentRequest.productName}
  Product Type: ${currentRequest.productType}
  Vendor: ${currentRequest.vendor}
  Product Value: $${currentRequest.productValue.toFixed(2)}
  UOM: ${currentRequest.uom}

REQUESTED vs PICKED:
  Requested Quantity: ${currentRequest.quantity} ${currentRequest.uom}
  Total Picked: ${totalPicked} ${currentRequest.uom}

PICKING DETAILS & REMAINING QUANTITIES:
${pickingAllocations
  .map((alloc) => {
    const remaining = Math.max(0, alloc.location.availableQuantity - alloc.pickedQuantity);
    return `
  Location: ${alloc.location.zoneName} / ${alloc.location.structureName} / ${alloc.location.levelName} / ${alloc.location.partitionName}
  Available: ${alloc.location.availableQuantity} ${currentRequest.uom}
  Picked: ${alloc.pickedQuantity} ${currentRequest.uom}
  Remaining: ${remaining} ${currentRequest.uom}
`;
  })
  .join("")}

Status: COMPLETED
========================================
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(summary));
    element.setAttribute("download", `stock-out-${currentRequest.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalPicked = pickingAllocations.reduce((sum, a) => sum + a.pickedQuantity, 0);

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-sm font-semibold text-foreground">Stock Out Completed</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          All picking has been confirmed and warehouse inventory updated
        </p>
      </div>

      {/* Completion Summary */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
        {/* Product Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">Product Details</h4>
          <div className="bg-white rounded p-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium text-foreground">{currentRequest.productName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">{currentRequest.productType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Requested Quantity:</span>
              <span className="font-medium text-foreground">
                {currentRequest.quantity} {currentRequest.uom}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Picked:</span>
              <span className="font-medium text-green-700 font-bold">{totalPicked} {currentRequest.uom}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-medium text-foreground">{currentRequest.vendor}</span>
            </div>
          </div>
        </div>

        {/* Picking Summary with Remaining Quantities */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">Picking & Remaining Inventory</h4>
          <div className="bg-white rounded p-2 space-y-1 max-h-48 overflow-y-auto">
            {pickingAllocations.map((alloc, idx) => {
              const remaining = Math.max(0, alloc.location.availableQuantity - alloc.pickedQuantity);
              return (
                <div key={alloc.locationId} className="border-b border-gray-100 pb-2 last:border-b-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">
                      {idx + 1}. {alloc.location.partitionName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {alloc.location.zoneName} → {alloc.location.structureName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 ml-3">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Available:</span>
                      <p className="font-medium text-foreground">{alloc.location.availableQuantity}</p>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Picked:</span>
                      <p className="font-medium text-green-700">-{alloc.pickedQuantity}</p>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Remaining:</span>
                      <p className="font-medium text-foreground">{remaining}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground text-xs">Total Picked:</span>
              <span className="font-bold text-green-700 text-xs">{totalPicked} units</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Request Status:</span>
            <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">
              COMPLETED
            </span>
          </div>
        </div>
      </div>

      {/* Warehouse Update Confirmation */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 flex gap-3">
        <TrendingDown className="text-blue-600 flex-shrink-0" size={20} />
        <p className="text-xs text-blue-900">
          Partition inventory has been automatically reduced in the warehouse layout. 
          The remaining quantities are now visible in the canvas.
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-foreground">Next Steps</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <TrendingDown size={12} className="flex-shrink-0" />
            Monitor partition inventory in warehouse view
          </li>
          <li className="flex items-center gap-2">
            <TrendingDown size={12} className="flex-shrink-0" />
            Process additional stock out requests as needed
          </li>
          <li className="flex items-center gap-2">
            <TrendingDown size={12} className="flex-shrink-0" />
            Generate reports from completed transactions
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={handleDownloadSummary}
          className="flex-1 px-4 py-2 text-xs font-semibold rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <Download size={14} className="inline mr-2" />
          Download Summary
        </button>
        <button
          onClick={resetWorkflow}
          className="flex-1 px-4 py-2 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          New Request
        </button>
      </div>
    </div>
  );
}
