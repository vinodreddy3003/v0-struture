"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { Check, X, ChevronRight } from "lucide-react";

export function StockOutApprovalStep() {
  const { requests, selectedRequestId, approveRequest, rejectRequest, startZoneSelection } = useStockOutStore();
  
  const selectedRequest = requests.find((req) => req.id === selectedRequestId);
  const pendingRequests = requests.filter((req) => req.status === "pending");

  if (!selectedRequest) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Request Approval</h2>
        
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">No pending requests to approve</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 border border-border rounded-lg bg-background hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{request.productName}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {request.productType} | Qty: {request.quantity} {request.uom}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vendor: {request.vendor} | Value: ${request.productValue.toFixed(2)}
                    </p>
                    {request.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{request.notes}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Review Stock Out Request</h2>

      {/* Request Details */}
      <div className="p-4 bg-background border border-border rounded-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Product Name</p>
            <p className="text-sm font-semibold text-foreground">{selectedRequest.productName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Product Type</p>
            <p className="text-sm font-semibold text-foreground">{selectedRequest.productType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Quantity</p>
            <p className="text-sm font-semibold text-foreground">
              {selectedRequest.quantity} {selectedRequest.uom}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Product Value</p>
            <p className="text-sm font-semibold text-foreground">
              ${selectedRequest.productValue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Vendor</p>
            <p className="text-sm font-semibold text-foreground">{selectedRequest.vendor}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Created Date</p>
            <p className="text-sm font-semibold text-foreground">
              {new Date(selectedRequest.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {selectedRequest.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
            <p className="text-sm text-foreground">{selectedRequest.notes}</p>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
        <div className="w-2 h-2 rounded-full bg-yellow-600" />
        Pending Approval
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={() => rejectRequest(selectedRequest.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground bg-destructive/10 border border-destructive/20 rounded-md hover:bg-destructive/20 transition-colors"
        >
          <X size={18} />
          Reject
        </button>
        <button
          onClick={() => {
            approveRequest(selectedRequest.id);
            startZoneSelection();
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          <Check size={18} />
          Approve & Continue
        </button>
      </div>
    </div>
  );
}
