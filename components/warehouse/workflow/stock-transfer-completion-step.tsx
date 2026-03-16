"use client";

import { useStockTransferStore } from "@/store/stock-transfer-store";
import { CheckCircle, Plus } from "lucide-react";

interface StockTransferCompletionStepProps {
  onWorkflowComplete?: () => void;
}

export function StockTransferCompletionStep({
  onWorkflowComplete,
}: StockTransferCompletionStepProps) {
  const {
    currentRequestId,
    requests,
    sourceTransfers,
    destTransfers,
    transferType,
    confirmationData,
    resetWorkflow,
    setCurrentStep,
  } = useStockTransferStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const totalQuantity = sourceTransfers.reduce((sum, t) => sum + t.transferredQuantity, 0);

  const handleNewTransfer = () => {
    resetWorkflow();
    setCurrentStep("request");
  };

  const handleViewDetails = () => {
    onWorkflowComplete?.();
  };

  return (
    <div className="space-y-4">
      {/* Success Banner */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900">Transfer Completed!</h3>
            <p className="text-xs text-green-700 mt-1">
              Stock transfer has been successfully processed.
            </p>
          </div>
        </div>
      </div>

      {/* Completion Summary */}
      <div className="border border-border rounded-lg p-4 bg-background space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Transfer Summary</h4>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Transfer ID</p>
            <p className="font-medium text-foreground">{currentRequest.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Product</p>
            <p className="font-medium text-foreground">{currentRequest.productName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium text-foreground">
              {transferType === "internal" ? "Internal" : "External"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium text-foreground">{totalQuantity} units</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium text-foreground">
              {confirmationData?.transferDate || currentRequest.date}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Reason</p>
            <p className="font-medium text-foreground">
              {confirmationData?.reason || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Source Locations */}
      {sourceTransfers.length > 0 && (
        <div className="border border-border rounded-lg p-3 bg-blue-50 space-y-2">
          <h4 className="text-xs font-medium text-blue-900">Source Locations</h4>
          <div className="space-y-1">
            {sourceTransfers.map((transfer) => (
              <div
                key={transfer.sourcePartitionId}
                className="flex justify-between text-xs text-blue-800 bg-white p-2 rounded border border-blue-200"
              >
                <span>{transfer.sourcePartitionName}</span>
                <span className="font-medium">{transfer.transferredQuantity} units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destination Locations */}
      {transferType === "internal" ? (
        destTransfers.length > 0 && (
          <div className="border border-border rounded-lg p-3 bg-green-50 space-y-2">
            <h4 className="text-xs font-medium text-green-900">Destination Locations</h4>
            <div className="space-y-1">
              {destTransfers.map((dest) => (
                <div
                  key={dest.sourcePartitionId}
                  className="flex justify-between text-xs text-green-800 bg-white p-2 rounded border border-green-200"
                >
                  <span>{dest.sourcePartitionName}</span>
                  <span className="font-medium">{dest.transferredQuantity} units</span>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="border border-border rounded-lg p-3 bg-purple-50 space-y-2">
          <h4 className="text-xs font-medium text-purple-900">External Destination</h4>
          <div className="text-xs text-purple-800 bg-white p-2 rounded border border-purple-200 space-y-1">
            <div>
              <span className="font-medium">Location:</span> {currentRequest.destLocation}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {confirmationData?.notes && (
        <div className="border border-border rounded-lg p-3 bg-amber-50 space-y-1">
          <h4 className="text-xs font-medium text-amber-900">Notes</h4>
          <p className="text-xs text-amber-800">{confirmationData.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={handleViewDetails}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          View Details
        </button>
        <button
          onClick={handleNewTransfer}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} />
          New Transfer
        </button>
      </div>
    </div>
  );
}
