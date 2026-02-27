"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import type { StockOutRequest } from "@/components/warehouse/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface ApprovalDetailPanelProps {
  request: StockOutRequest;
  onBack: () => void;
}

export function ApprovalDetailPanel({ request, onBack }: ApprovalDetailPanelProps) {
  const { approveRequest, rejectRequest } = useStockOutStore();
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = () => {
    approveRequest(request.id);
    onBack();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    rejectRequest(request.id, rejectionReason);
    onBack();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Queue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>Request ID: {request.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Product Name</p>
              <p className="font-medium">{request.productName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Product Type</p>
              <p className="font-medium">{request.productType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="font-medium">
                {request.quantity} {request.productUOM}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Product Value</p>
              <p className="font-medium">${request.productValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="font-medium">{request.customer}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created By</p>
              <p className="font-medium">{request.createdBy}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created Date</p>
              <p className="font-medium">
                {new Date(request.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted p-2 rounded">{request.notes}</p>
            </div>
          )}

          {/* Approval Section */}
          <div className="border-t pt-6 space-y-4">
            {!isRejecting ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={() => setIsRejecting(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-900">Rejection Details</p>
                <Textarea
                  placeholder="Provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-24"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    onClick={() => {
                      setIsRejecting(false);
                      setRejectionReason("");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
