"use client";

import { useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import type { StockOutRequest } from "@/store/stock-out-store";
import { Check, X } from "lucide-react";

interface StockOutRequestStepProps {
  onRequestCreated?: (request: StockOutRequest) => void;
}

export function StockOutRequestStep({ onRequestCreated }: StockOutRequestStepProps) {
  const { addRequest } = useStockOutStore();
  
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productValue, setProductValue] = useState("");
  const [uom, setUom] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName || !productType || !quantity || !productValue || !uom || !vendor) {
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
      productName,
      productType,
      quantity: qty,
      productValue: value,
      uom,
      vendor,
      notes: notes || undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addRequest(newRequest);
    onRequestCreated?.(newRequest);

    setSubmitted(true);
    setTimeout(() => {
      setProductName("");
      setProductType("");
      setQuantity("");
      setProductValue("");
      setUom("");
      setVendor("");
      setNotes("");
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Stock Out Request Created</h3>
        <p className="text-sm text-muted-foreground text-center">
          Your request has been successfully submitted for approval.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-foreground mb-6">Create Stock Out Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information Section */}
        <div className="space-y-4 p-4 bg-background border border-border rounded-lg">
          <h3 className="text-sm font-semibold text-foreground">Product Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Name *</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Product Type *</label>
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
              <label className="text-sm font-medium text-foreground">Quantity *</label>
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
              <label className="text-sm font-medium text-foreground">Product Value *</label>
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
              <label className="text-sm font-medium text-foreground">UOM *</label>
              <input
                type="text"
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                placeholder="e.g., kg, box, unit"
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Vendor *</label>
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
          <label className="text-sm font-medium text-foreground">Notes</label>
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
