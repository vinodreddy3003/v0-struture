"use client";

import { useStockTransferStore } from "@/store/stock-transfer-store";
import type { StockTransferRequest } from "@/components/warehouse/types";
import { Check, X, Plus } from "lucide-react";
import { useState } from "react";

interface StockTransferRequestStepProps {
  onAddRequest?: (request: Omit<StockTransferRequest, "id" | "status" | "transfers">) => void;
}

export function StockTransferRequestStep({ onAddRequest }: StockTransferRequestStepProps) {
  const { requests, approveRequest, rejectRequest, startWorkflow } = useStockTransferStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: "Sample Product",
    transferType: "internal" as const,
    quantity: 100,
    sourceLocation: "Zone A",
    destLocation: "Zone B",
    reason: "Stock redistribution",
    notes: "",
  });

  const handleAddRequest = () => {
    const newRequest: Omit<StockTransferRequest, "id" | "status" | "transfers"> = {
      date: new Date().toLocaleDateString(),
      ...formData,
    };
    onAddRequest?.(newRequest);
    setShowForm(false);
    setFormData({
      productName: "Sample Product",
      transferType: "internal",
      quantity: 100,
      sourceLocation: "Zone A",
      destLocation: "Zone B",
      reason: "Stock redistribution",
      notes: "",
    });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const otherRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Stock Transfer Requests</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={14} />
          New Request
        </button>
      </div>

      {/* Add Request Form */}
      {showForm && (
        <div className="border border-border rounded-lg p-3 bg-muted/30 space-y-2">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />
          
          <select
            value={formData.transferType}
            onChange={(e) => setFormData({ ...formData, transferType: e.target.value as any })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          >
            <option value="internal">Internal Transfer</option>
            <option value="external">External Transfer</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />

          <input
            type="text"
            placeholder="Source Location"
            value={formData.sourceLocation}
            onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />

          <input
            type="text"
            placeholder="Destination Location"
            value={formData.destLocation}
            onChange={(e) => setFormData({ ...formData, destLocation: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />

          <input
            type="text"
            placeholder="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAddRequest}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Add Request
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-xs">No pending requests</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Pending ({pendingRequests.length})</h4>
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="border border-border rounded-lg p-3 bg-background/50 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{req.productName}</p>
                  <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                    <p>Type: {req.transferType === "internal" ? "Internal" : "External"}</p>
                    <p>Quantity: {req.quantity}</p>
                    <p>From: {req.sourceLocation}</p>
                    <p>To: {req.destLocation}</p>
                    <p>Reason: {req.reason}</p>
                    <p>Date: {req.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    approveRequest(req.id);
                    startWorkflow(req.id);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <Check size={14} />
                  Approve & Start
                </button>
                <button
                  onClick={() => rejectRequest(req.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <X size={14} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Other Requests Summary */}
      {otherRequests.length > 0 && (
        <div className="border-t border-border pt-3">
          <details className="text-xs">
            <summary className="font-medium text-foreground cursor-pointer hover:text-indigo-600">
              Other Requests ({otherRequests.length})
            </summary>
            <div className="mt-2 space-y-1 pl-2 border-l border-muted">
              {otherRequests.map((req) => (
                <div
                  key={req.id}
                  className={`text-xs p-2 rounded ${
                    req.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : req.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <p className="font-medium">{req.productName}</p>
                  <p>Type: {req.transferType === "internal" ? "Internal" : "External"}</p>
                  <p>Status: {req.status}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
