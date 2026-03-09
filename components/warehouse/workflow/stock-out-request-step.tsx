"use client";

import { useState } from "react";
import { useStockOutStore } from "@/store/stock-out-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronRight } from "lucide-react";
import { nanoid } from "nanoid";

export function StockOutRequestStep() {
  const {
    formData,
    setFormData,
    requests,
    addRequest,
    resetFormData,
    setCurrentStep,
  } = useStockOutStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderReference.trim()) {
      newErrors.orderReference = "Order reference is required";
    }
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.productType.trim()) {
      newErrors.productType = "Product type is required";
    }
    if (!formData.productUOM.trim()) {
      newErrors.productUOM = "UOM is required";
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newRequest = {
      id: nanoid(),
      date: new Date().toISOString().split("T")[0],
      orderReference: formData.orderReference,
      productName: formData.productName,
      productType: formData.productType,
      productUOM: formData.productUOM,
      quantity: formData.quantity,
      status: "pending" as const,
      notes: formData.notes,
    };

    addRequest(newRequest);
    resetFormData();
    setCurrentStep("approval");
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderReference" className="text-sm font-medium">
            Order Reference *
          </Label>
          <Input
            id="orderReference"
            placeholder="e.g., PO-2024-001"
            value={formData.orderReference}
            onChange={(e) => setFormData({ orderReference: e.target.value })}
            className={errors.orderReference ? "border-red-500" : ""}
          />
          {errors.orderReference && (
            <p className="text-xs text-red-500">{errors.orderReference}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productName" className="text-sm font-medium">
            Product Name *
          </Label>
          <Input
            id="productName"
            placeholder="e.g., Widget A"
            value={formData.productName}
            onChange={(e) => setFormData({ productName: e.target.value })}
            className={errors.productName ? "border-red-500" : ""}
          />
          {errors.productName && (
            <p className="text-xs text-red-500">{errors.productName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="productType" className="text-sm font-medium">
              Product Type *
            </Label>
            <Input
              id="productType"
              placeholder="e.g., Electronics"
              value={formData.productType}
              onChange={(e) => setFormData({ productType: e.target.value })}
              className={errors.productType ? "border-red-500" : ""}
            />
            {errors.productType && (
              <p className="text-xs text-red-500">{errors.productType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUOM" className="text-sm font-medium">
              UOM *
            </Label>
            <Input
              id="productUOM"
              placeholder="e.g., Pieces"
              value={formData.productUOM}
              onChange={(e) => setFormData({ productUOM: e.target.value })}
              className={errors.productUOM ? "border-red-500" : ""}
            />
            {errors.productUOM && (
              <p className="text-xs text-red-500">{errors.productUOM}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity *
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="0"
            value={formData.quantity || ""}
            onChange={(e) =>
              setFormData({ quantity: parseInt(e.target.value) || 0 })
            }
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && (
            <p className="text-xs text-red-500">{errors.quantity}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ notes: e.target.value })}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Create Request
        </Button>
      </form>

      {/* Pending Requests List */}
      {pendingRequests.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold mb-3">Pending Requests</h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{req.orderReference}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.productName} - {req.quantity} {req.productUOM}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
