"use client";

import { useStockIn } from "@/context/stock-in-context";
import type { StockInRequest } from "@/components/warehouse/types";
import { Check, X, Plus } from "lucide-react";
import { useState } from "react";

interface StockInRequestStepProps {
  onAddRequest?: (request: Omit<StockInRequest, "id" | "status" | "allocations">) => void;
}

export function StockInRequestStep({ onAddRequest }: StockInRequestStepProps) {
  const { requests, approveRequest, rejectRequest, startWorkflow } = useStockIn();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: "Sample Product",
    productType: "Electronics",
    productValue: 100,
    productUOM: "units",
    quantity: 500,
    vendor: "Test Vendor",
    notes: "",
  });

  const handleAddRequest = () => {
    const newRequest: Omit<StockInRequest, "id" | "status" | "allocations"> = {
      date: new Date().toLocaleDateString(),
      ...formData,
    };
    onAddRequest?.(newRequest);
    setShowForm(false);
    setFormData({
      productName: "Sample Product",
      productType: "Electronics",
      productValue: 100,
      productUOM: "units",
      quantity: 500,
      vendor: "Test Vendor",
      notes: "",
    });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const otherRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Stock In Requests</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
          <input
            type="text"
            placeholder="Product Type"
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
          />
          <input
            type="text"
            placeholder="Vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
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
                    <p>Type: {req.productType}</p>
                    <p>Quantity: {req.quantity} {req.productUOM}</p>
                    <p>Vendor: {req.vendor}</p>
                    <p>Value: ${req.productValue}</p>
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
                  Approve & Assign
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
            <summary className="font-medium text-foreground cursor-pointer hover:text-blue-600">
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
