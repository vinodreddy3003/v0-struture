"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, Package, AlertCircle } from "lucide-react";
import { useStockOutStore } from "@/store/stock-out-store";
import type { StockOutRequest } from "@/components/warehouse/types";

interface StockOutRequestsPanelProps {
  onPickingStart?: () => void;
}

export function StockOutRequestsPanel({ onPickingStart }: StockOutRequestsPanelProps) {
  const { requests, currentRequestId, startWorkflow, approveRequest, rejectRequest } = useStockOutStore();
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const getStatusIcon = (status: StockOutRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-amber-500" />;
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-500" />;
      case "in-progress":
        return <Package size={16} className="text-blue-600" />;
      case "picked":
        return <CheckCircle size={16} className="text-purple-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-emerald-600" />;
    }
  };

  const getStatusColor = (status: StockOutRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 border-amber-200";
      case "approved":
        return "bg-green-50 border-green-200";
      case "rejected":
        return "bg-red-50 border-red-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      case "picked":
        return "bg-purple-50 border-purple-200";
      case "completed":
        return "bg-emerald-50 border-emerald-200";
    }
  };

  const getStatusBadgeColor = (status: StockOutRequest["status"]) => {
    switch (status) {
      case "pending":
        return "text-amber-700 bg-amber-100";
      case "approved":
        return "text-green-700 bg-green-100";
      case "rejected":
        return "text-red-700 bg-red-100";
      case "in-progress":
        return "text-blue-700 bg-blue-100";
      case "picked":
        return "text-purple-700 bg-purple-100";
      case "completed":
        return "text-emerald-700 bg-emerald-100";
    }
  };

  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    startWorkflow(requestId);
    onPickingStart?.();
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
  };

  return (
    <div className="space-y-2">
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">No Stock Out requests yet</p>
          <p className="text-xs mt-1">Create a request to begin the picking process</p>
        </div>
      ) : (
        requests.map((request) => {
          const isExpanded = expandedRequestId === request.id;
          const pickedTotal = request.picks.reduce((sum, p) => sum + p.pickedQuantity, 0);
          const isFullyPicked = pickedTotal >= request.quantity;

          return (
            <div
              key={request.id}
              className={`border rounded-lg overflow-hidden transition-all ${getStatusColor(request.status)}`}
            >
              {/* Request Header */}
              <button
                onClick={() => setExpandedRequestId(isExpanded ? null : request.id)}
                className="w-full flex items-center justify-between px-3 py-3 hover:bg-black/5 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 text-left">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <p className="text-sm font-medium text-foreground truncate">{request.productName}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qty: {request.quantity} {request.productUOM} | {request.date}
                    </p>
                  </div>
                </div>
              </button>

              {/* Request Details */}
              {isExpanded && (
                <div className="border-t border-current/20 bg-black/3 px-3 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground font-medium">Type</p>
                      <p className="text-foreground">{request.productType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Value</p>
                      <p className="text-foreground">${request.productValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Customer</p>
                      <p className="text-foreground">{request.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Picked</p>
                      <p className="text-foreground">{pickedTotal} / {request.quantity}</p>
                    </div>
                  </div>

                  {request.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Notes</p>
                      <p className="text-xs text-foreground bg-white/50 rounded p-1.5">{request.notes}</p>
                    </div>
                  )}

                  {/* Picks List */}
                  {request.picks.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Picks</p>
                      <div className="space-y-1">
                        {request.picks.map((pick, idx) => (
                          <div key={idx} className="text-xs bg-white/50 rounded p-1 flex justify-between">
                            <span className="text-foreground truncate">{pick.partitionName}</span>
                            <span className="text-muted-foreground flex-shrink-0 ml-1">{pick.pickedQuantity} units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {request.status !== "rejected" && request.status !== "completed" && (
                    <div className="flex gap-2 pt-2">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Approve & Start
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(request.status === "approved" || request.status === "in-progress") && (
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={isFullyPicked}
                          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                            isFullyPicked
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isFullyPicked ? "Fully Picked" : "Continue Picking"}
                        </button>
                      )}
                    </div>
                  )}

                  {request.status === "completed" && (
                    <div className="text-xs text-emerald-700 bg-emerald-100 rounded p-2 text-center font-medium">
                      Stock Out Completed
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
