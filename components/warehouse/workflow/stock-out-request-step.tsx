"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStockOutStore } from "@/store/stock-out-store";
import { StockOutForm } from "@/components/warehouse/forms/stock-out-form";
import { StockOutRequestsPanel } from "@/components/warehouse/panels/stock-out-requests-panel";
import type { StockOutRequest } from "@/components/warehouse/types";

export function StockOutRequestStep() {
  const { addRequest } = useStockOutStore();
  const [showForm, setShowForm] = useState(false);

  const handleCreateRequest = (formData: {
    productName: string;
    productType: string;
    productValue: number;
    productUOM: string;
    quantity: number;
    customer: string;
    notes: string;
  }) => {
    const newRequest: StockOutRequest = {
      id: `STO-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      productName: formData.productName,
      productType: formData.productType,
      productValue: formData.productValue,
      productUOM: formData.productUOM,
      quantity: formData.quantity,
      customer: formData.customer,
      status: "pending",
      picks: [],
      notes: formData.notes,
    };

    addRequest(newRequest);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Stock Out Requests</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Create and manage outbound order requests</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            <Plus size={14} />
            New Request
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <StockOutForm
          onSubmit={handleCreateRequest}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Requests Panel */}
      <StockOutRequestsPanel
        onPickingStart={() => setShowForm(false)}
      />
    </div>
  );
}
