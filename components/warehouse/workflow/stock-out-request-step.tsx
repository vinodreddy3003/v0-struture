"use client";

import { useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import type { StockOutRequest } from "@/store/stock-out-store";
import { Check, X } from "lucide-react";

interface StockOutRequestStepProps {
  onApprove?: (request: StockOutRequest) => void;
  onReject?: () => void;
}

export function StockOutRequestStep({ onApprove, onReject }: StockOutRequestStepProps) {
  const { addRequest } = useStockOutStore();
  
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productValue, setProductValue] = useState("");
  const [uom, setUom] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<StockOutRequest | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName.trim() || !productType.trim() || !quantity || !productValue || !uom.trim() || !vendor.trim()) {
      setError("All fields except notes are required");
      return;
    }

    const qty = parseFloat(quantity);
    const value = parseFloat(productValue);

    if (isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    if (isNaN(value) || value < 0) {
      setError("Product value must be a non-negative number");
      return;
    }

    const newRequest: StockOutRequest = {
      id: `stock-out-${Date.now()}`,
      productName: productName.trim(),
      productType: productType.trim(),
      quantity: qty,
      productValue: value,
      uom: uom.trim(),
      vendor: vendor.trim(),
      notes: notes.trim() || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setCurrentRequest(newRequest);
    setFormSubmitted(true);
  };

  const handleApprove = () => {
    if (!currentRequest) return;

    const approvedRequest: StockOutRequest = {
      ...currentRequest,
      status: "approved",
    };

    addRequest(approvedRequest);
    onApprove?.(approvedRequest);

    // Reset form
    setProductName("");
    setProductType("");
    setQuantity("");
    setProductValue("");
    setUom("");
    setVendor("");
    setNotes("");
    setFormSubmitted(false);
    setCurrentRequest(null);
  };

  const handleReject = () => {
    setProductName("");
    setProductType("");
    setQuantity("");
    setProductValue("");
    setUom("");
    setVendor("");
    setNotes("");
    setError("");
    setFormSubmitted(false);
    setCurrentRequest(null);
    onReject?.();
  };

  // Show request details for approval
  if (formSubmitted && currentRequest) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-6">Review Stock Out Request</h2>
        
        <div className="space-y-6">
          {/* Request Details */}
          <div className="p-4 bg-background border border-border rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Product Name</p>
                <p className="text-sm font-medium text-foreground">{currentRequest.productName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Product Type</p>
                <p className="text-sm font-medium text-foreground">{currentRequest.productType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                <p className="text-sm font-medium text-foreground">{currentRequest.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">UOM</p>
                <p className="text-sm font-medium text-foreground">{currentRequest.uom}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Product Value</p>
                <p className="text-sm font-medium text-foreground">${currentRequest.productValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                <p className="text-sm font-medium text-foreground">{currentRequest.vendor}</p>
              </div>
            </div>

            {currentRequest.notes && (
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Notes</p>
                <p className="text-sm text-foreground bg-muted p-2 rounded border border-border">
                  {currentRequest.notes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              <Check size={18} />
              Approve Request
            </button>
            <button
              onClick={handleReject}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <X size={18} />
              Reject Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show form for creating request
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-foreground mb-6">Stock Out Request & Approval</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Product Information Section */}
        <div className="space-y-4 p-4 bg-background border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-foreground">Product Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Type</label>
              <input
                type="text"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="Enter product type"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <input
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Value</label>
              <input
                type="number"
                step="0.01"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                placeholder="Enter product value"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">UOM</label>
              <input
                type="text"
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                placeholder="e.g., kg, box, unit"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Vendor</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Enter vendor name"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-2 p-4 bg-background border border-border rounded-lg">
          <label className="text-sm font-medium text-foreground">Note</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes (optional)"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Check size={18} />
          Create Request
        </button>
      </form>
    </div>
  );
}
