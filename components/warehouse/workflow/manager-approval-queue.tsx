"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ApprovalDetailPanel } from "./approval-detail-panel";

export function ManagerApprovalQueue() {
  const { getPendingRequests, currentUserRole } = useStockOutStore();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const pendingRequests = getPendingRequests();

  if (currentUserRole !== "manager") {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          You don't have permission to access this queue. Only managers can approve requests.
        </p>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No pending requests to review</p>
      </div>
    );
  }

  if (selectedRequestId) {
    const request = pendingRequests.find((r) => r.id === selectedRequestId);
    if (request) {
      return (
        <ApprovalDetailPanel
          request={request}
          onBack={() => setSelectedRequestId(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
          <p className="text-sm text-muted-foreground">
            {pendingRequests.length} request{pendingRequests.length !== 1 ? "s" : ""} awaiting approval
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {pendingRequests.map((request) => (
          <Card key={request.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{request.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.quantity} {request.productUOM} • Customer: {request.customer}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {request.createdBy}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequestId(request.id)}
                >
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
