"use client";

import { useStockTransferStore } from "@/store/stock-transfer-store";
import { AlertCircle } from "lucide-react";

export function ConfirmationStep() {
  const {
    currentRequestId,
    requests,
    sourceTransfers,
    destTransfers,
    destinationInfo,
    transferType,
    confirmationData,
    setConfirmationData,
    setCurrentStep,
  } = useStockTransferStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const totalQuantity = sourceTransfers.reduce((sum, t) => sum + t.transferredQuantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmationData(confirmationData);
    setCurrentStep("completion");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Confirm Transfer Details</h3>
        <p className="text-xs text-muted-foreground mt-1">Review all details before completing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transfer Summary */}
        <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-2">
          <h4 className="text-xs font-medium text-foreground">Transfer Summary</h4>
          
          <div className="space-y-1 text-xs text-foreground">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium">{currentRequest.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{transferType === "internal" ? "Internal" : "External"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{totalQuantity} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{currentRequest.date}</span>
            </div>
          </div>
        </div>

        {/* Source Details */}
        {sourceTransfers.length > 0 && (
          <div className="border border-border rounded-lg p-3 bg-blue-50 space-y-2">
            <h4 className="text-xs font-medium text-blue-900">Source Locations</h4>
            <div className="space-y-1">
              {sourceTransfers.map((transfer) => (
                <div key={transfer.sourcePartitionId} className="text-xs text-blue-800">
                  <span className="font-medium">{transfer.sourcePartitionName}</span>
                  {" - "}{transfer.transferredQuantity} units
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Destination Details */}
        {transferType === "internal" ? (
          destTransfers.length > 0 && (
            <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
              <h4 className="text-xs font-medium text-green-900">Destination Locations</h4>
              <div className="space-y-1">
                {destTransfers.map((dest) => (
                  <div key={dest.sourcePartitionId} className="text-xs text-green-800">
                    <span className="font-medium">{dest.sourcePartitionName}</span>
                    {" - "}{dest.transferredQuantity} units
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          destinationInfo && (
            <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
              <h4 className="text-xs font-medium text-green-900">External Destination</h4>
              <div className="text-xs text-green-800 space-y-1">
                <div>
                  <span className="font-medium">Location:</span> {destinationInfo.location}
                </div>
                {destinationInfo.zone && (
                  <div>
                    <span className="font-medium">Zone:</span> {destinationInfo.zone}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Confirmation Fields */}
        <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Reason</label>
            <input
              type="text"
              placeholder="e.g., Stock redistribution, Order fulfillment"
              value={confirmationData?.reason || ""}
              onChange={(e) =>
                setConfirmationData({
                  ...confirmationData,
                  reason: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Notes (Optional)</label>
            <textarea
              placeholder="Additional notes or comments"
              value={confirmationData?.notes || ""}
              onChange={(e) =>
                setConfirmationData({
                  ...confirmationData,
                  notes: e.target.value,
                })
              }
              rows={3}
              className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Transfer Date</label>
            <input
              type="date"
              value={confirmationData?.transferDate || currentRequest.date}
              onChange={(e) =>
                setConfirmationData({
                  ...confirmationData,
                  transferDate: e.target.value,
                })
              }
              className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
            />
          </div>
        </div>

        {/* Warning */}
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 flex gap-2">
          <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Please verify all details are correct before submitting. This action cannot be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => setCurrentStep("destination-selection")}
            className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Complete Transfer
          </button>
        </div>
      </form>
    </div>
  );
}
