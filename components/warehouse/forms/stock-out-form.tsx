"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface StockOutFormProps {
  onSubmit: (data: {
    productName: string;
    productType: string;
    productValue: number;
    productUOM: string;
    quantity: number;
    customer: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

export function StockOutForm({ onSubmit, onCancel }: StockOutFormProps) {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    productValue: "",
    productUOM: "",
    quantity: "",
    customer: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.productName.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.productType.trim()) {
      setError("Product type is required");
      return;
    }
    if (!formData.customer.trim()) {
      setError("Customer name is required");
      return;
    }
    if (!formData.quantity.trim()) {
      setError("Quantity is required");
      return;
    }

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    const productValue = formData.productValue ? parseFloat(formData.productValue) : 0;
    if (isNaN(productValue) || productValue < 0) {
      setError("Product value must be a non-negative number");
      return;
    }

    onSubmit({
      productName: formData.productName.trim(),
      productType: formData.productType.trim(),
      productValue,
      productUOM: formData.productUOM.trim() || "unit",
      quantity,
      customer: formData.customer.trim(),
      notes: formData.notes.trim(),
    });

    setFormData({
      productName: "",
      productType: "",
      productValue: "",
      productUOM: "",
      quantity: "",
      customer: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-2">Create Stock Out Request</h3>

      {/* Product Information */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Product Name *</label>
        <input
          type="text"
          value={formData.productName}
          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
          placeholder="Enter product name"
          className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Type *</label>
          <input
            type="text"
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            placeholder="e.g., Electronics"
            className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">UOM</label>
          <input
            type="text"
            value={formData.productUOM}
            onChange={(e) => setFormData({ ...formData, productUOM: e.target.value })}
            placeholder="e.g., box"
            className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Product Value (USD)</label>
        <input
          type="number"
          step="0.01"
          value={formData.productValue}
          onChange={(e) => setFormData({ ...formData, productValue: e.target.value })}
          placeholder="0.00"
          className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Order Information */}
      <div className="border-t border-border pt-3 mt-1">
        <p className="text-xs font-medium text-foreground mb-2">Order Information</p>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Customer Name *</label>
          <input
            type="text"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            placeholder="Enter customer name"
            className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Quantity to Pick *</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="Enter quantity"
            className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any special instructions..."
          rows={3}
          className="w-full px-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2 text-xs text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
        >
          <Check size={14} />
          Create Request
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
}
