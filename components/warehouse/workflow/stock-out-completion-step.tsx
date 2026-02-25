"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { CheckCircle, Package, User, Calendar } from "lucide-react";

export function StockOutCompletionStep() {
  const { currentRequestId, requests, picks, resetWorkflow } = useStockOutStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const totalPickedQuantity = picks.reduce((sum, p) => sum + p.pickedQuantity, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Order Completed</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Stock out process successfully completed
        </p>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-green-900">Order Successfully Fulfilled</p>
            <p className="text-xs text-green-800 mt-1">
              All items have been picked, verified, and are ready for dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Order Summary</h4>

        {/* Product Info */}
        <div className="flex gap-3 bg-background p-3 rounded-lg">
          <Package className="text-blue-600 flex-shrink-0" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {currentRequest.productName}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentRequest.productType}
            </p>
          </div>
        </div>

        {/* Quantity & Customer */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Total Quantity</p>
            <p className="text-lg font-bold text-foreground mt-1">
              {totalPickedQuantity} <span className="text-xs text-muted-foreground">{currentRequest.productUOM}</span>
            </p>
          </div>
          <div className="bg-background p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-medium">Value</p>
            <p className="text-lg font-bold text-foreground mt-1">
              ${(currentRequest.productValue * totalPickedQuantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Customer & Date */}
        <div className="border-t border-border pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <User size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Customer:</span>
            <span className="text-xs font-semibold text-foreground">{currentRequest.customer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Date:</span>
            <span className="text-xs font-semibold text-foreground">{currentRequest.date}</span>
          </div>
        </div>
      </div>

      {/* Picked Items Details */}
      <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Picked Items Details</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {picks.map((pick, idx) => (
            <div
              key={pick.partitionId}
              className="flex items-center justify-between bg-background p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {pick.partitionName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Level {pick.levelId.split("-")[1]}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {pick.pickedQuantity} {currentRequest.productUOM}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
        <p className="text-xs font-medium text-blue-900 mb-2">Next Steps:</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Prepare items for packing</li>
          <li>• Generate shipping label</li>
          <li>• Update customer notification</li>
          <li>• Transfer to dispatch area</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={resetWorkflow}
          className="flex-1 px-3 py-2 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Start New Order
        </button>
        <button
          className="flex-1 px-3 py-2 text-xs font-medium rounded bg-background border border-border text-foreground hover:bg-muted transition-colors"
        >
          View Receipt
        </button>
      </div>
    </div>
  );
}
