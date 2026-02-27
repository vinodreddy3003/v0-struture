"use client";

import { useStockOutStore } from "@/store/stock-out-store";
import type { StockOutRequest } from "@/components/warehouse/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CreateStockOutRequestFormProps {
  onRequestCreated?: (request: StockOutRequest) => void;
  onCancel?: () => void;
}

export function CreateStockOutRequestForm({
  onRequestCreated,
  onCancel,
}: CreateStockOutRequestFormProps) {
  const { addRequest, currentUserName, currentUserRole } = useStockOutStore();
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    productValue: 0,
    productUOM: "pcs",
    quantity: 0,
    customer: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!formData.productType.trim()) {
      newErrors.productType = "Product type is required";
    }
    if (formData.productValue <= 0) {
      newErrors.productValue = "Product value must be greater than 0";
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.customer.trim()) {
      newErrors.customer = "Customer name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      notes: formData.notes || undefined,
      createdBy: currentUserName || "Unknown",
      createdDate: new Date().toISOString().split("T")[0],
    };

    addRequest(newRequest);
    onRequestCreated?.(newRequest);

    // Reset form
    setFormData({
      productName: "",
      productType: "",
      productValue: 0,
      productUOM: "pcs",
      quantity: 0,
      customer: "",
      notes: "",
    });
    setErrors({});
  };

  if (currentUserRole !== "manager") {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          Only managers can create stock out requests.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Stock Out Request</CardTitle>
        <CardDescription>Submit a new request for stock withdrawal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Product Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName" className="text-xs">
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  placeholder="e.g., Electronics Component"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productName: e.target.value }))
                  }
                  className={errors.productName ? "border-red-500" : ""}
                />
                {errors.productName && (
                  <p className="text-xs text-red-500 mt-1">{errors.productName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="productType" className="text-xs">
                  Product Type *
                </Label>
                <Input
                  id="productType"
                  placeholder="e.g., Semiconductor"
                  value={formData.productType}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productType: e.target.value }))
                  }
                  className={errors.productType ? "border-red-500" : ""}
                />
                {errors.productType && (
                  <p className="text-xs text-red-500 mt-1">{errors.productType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="productValue" className="text-xs">
                  Product Value *
                </Label>
                <Input
                  id="productValue"
                  type="number"
                  placeholder="0.00"
                  value={formData.productValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productValue: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className={errors.productValue ? "border-red-500" : ""}
                  step="0.01"
                  min="0"
                />
                {errors.productValue && (
                  <p className="text-xs text-red-500 mt-1">{errors.productValue}</p>
                )}
              </div>

              <div>
                <Label htmlFor="quantity" className="text-xs">
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={errors.quantity ? "border-red-500" : ""}
                  min="0"
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <Label htmlFor="productUOM" className="text-xs">
                  Unit of Measure
                </Label>
                <Input
                  id="productUOM"
                  placeholder="e.g., pcs"
                  value={formData.productUOM}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, productUOM: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Recipient Information</h3>

            <div>
              <Label htmlFor="customer" className="text-xs">
                Customer/Department *
              </Label>
              <Input
                id="customer"
                placeholder="e.g., Sales Department"
                value={formData.customer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, customer: e.target.value }))
                }
                className={errors.customer ? "border-red-500" : ""}
              />
              {errors.customer && (
                <p className="text-xs text-red-500 mt-1">{errors.customer}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Additional Information</h3>

            <div>
              <Label htmlFor="notes" className="text-xs">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes or special instructions..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="min-h-24"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1">
              Create Request
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
