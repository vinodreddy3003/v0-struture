"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight } from "lucide-react";

export function StockOutApprovalStep() {
  const { requests, currentRequestId, approveRequest, rejectRequest, startWorkflow, setCurrentStep } =
    useStockOutStore();

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const currentRequest = currentRequestId
    ? requests.find((r) => r.id === currentRequestId)
    : null;

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    startWorkflow(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
  };

  if (currentRequest && currentRequest.status === "approved") {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-success-soft-2 border border-success rounded-lg">
          <p className="text-sm font-medium text-success-on">
            ✓ Request {currentRequest.orderReference} approved
          </p>
          <p className="text-xs text-success-on mt-1 opacity-90">
            Proceeding to order selection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="p-3 bg-info rounded-md border border-info-ink">
        <p className="text-sm text-info-ink">
          Review and approve pending stock out requests below.
        </p>
      </div>

      {/* Pending Requests for Approval */}
      {pendingRequests.length > 0 ? (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              {/* Request Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{request.orderReference}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Product</p>
                    <p className="font-medium">{request.productName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{request.productType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">
                      {request.quantity} {request.productUOM}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{request.status}</p>
                  </div>
                </div>

                {request.notes && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <p className="text-muted-foreground font-medium mb-1">Notes:</p>
                    <p>{request.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  <Check size={14} className="mr-1.5" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(request.id)}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <X size={14} className="mr-1.5" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            No pending requests for approval
          </p>
        </div>
      )}

      {/* Approved/In Progress Requests */}
      {requests.length > pendingRequests.length && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">Recent Requests</h3>
          <div className="space-y-2">
            {requests
              .filter((r) => r.status !== "pending")
              .slice(0, 3)
              .map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md text-sm"
                >
                  <div>
                    <p className="font-medium">{req.orderReference}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {req.status}
                    </p>
                  </div>
                  {req.status === "approved" && (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
