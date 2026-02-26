"use client";

import { useStockInStore } from "@/store/stock-in-store";
import type { VehicleInformation } from "@/components/warehouse/types";
import { useState } from "react";

interface VehicleInfoStepProps {
  onVehicleInfoSaved?: (vehicleInfo: VehicleInformation) => void;
}

export function VehicleInfoStep({ onVehicleInfoSaved }: VehicleInfoStepProps) {
  const { currentRequestId, requests, setCurrentStep, updateVehicleInfo } =
    useStockInStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const [vehicleInfo, setVehicleInfo] = useState<VehicleInformation>(
    currentRequest.vehicleInfo || {
      vehicleNumber: "",
      driverName: "",
      contactNumber: "",
      vehicleType: "",
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!vehicleInfo.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }
    if (!vehicleInfo.driverName.trim()) {
      newErrors.driverName = "Driver name is required";
    }
    if (!vehicleInfo.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d+$/.test(vehicleInfo.contactNumber)) {
      newErrors.contactNumber = "Contact number must be numeric";
    }
    if (!vehicleInfo.vehicleType.trim()) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveVehicleInfo = () => {
    if (validateForm()) {
      updateVehicleInfo(vehicleInfo);
      onVehicleInfoSaved?.(vehicleInfo);
      setCurrentStep("allocation");
    }
  };

  const handleInputChange = (field: keyof VehicleInformation, value: string) => {
    setVehicleInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Vehicle Information
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Product: {currentRequest.productName}
        </p>
        <p className="text-xs text-muted-foreground">
          Quantity: {currentRequest.quantity} {currentRequest.productUOM}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-3">
        {/* Vehicle Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Vehicle Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., KA-01-AB-1234"
            value={vehicleInfo.vehicleNumber}
            onChange={(e) =>
              handleInputChange("vehicleNumber", e.target.value)
            }
            className={`w-full px-3 py-2 text-xs border rounded bg-background text-foreground placeholder:text-muted-foreground transition-colors ${
              errors.vehicleNumber
                ? "border-red-500 focus:outline-none"
                : "border-input focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.vehicleNumber && (
            <p className="text-xs text-red-500">{errors.vehicleNumber}</p>
          )}
        </div>

        {/* Driver Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Driver Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., John Doe"
            value={vehicleInfo.driverName}
            onChange={(e) => handleInputChange("driverName", e.target.value)}
            className={`w-full px-3 py-2 text-xs border rounded bg-background text-foreground placeholder:text-muted-foreground transition-colors ${
              errors.driverName
                ? "border-red-500 focus:outline-none"
                : "border-input focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.driverName && (
            <p className="text-xs text-red-500">{errors.driverName}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g., 9876543210"
            value={vehicleInfo.contactNumber}
            onChange={(e) =>
              handleInputChange("contactNumber", e.target.value)
            }
            className={`w-full px-3 py-2 text-xs border rounded bg-background text-foreground placeholder:text-muted-foreground transition-colors ${
              errors.contactNumber
                ? "border-red-500 focus:outline-none"
                : "border-input focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.contactNumber && (
            <p className="text-xs text-red-500">{errors.contactNumber}</p>
          )}
        </div>

        {/* Vehicle Type */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <select
            value={vehicleInfo.vehicleType}
            onChange={(e) =>
              handleInputChange("vehicleType", e.target.value)
            }
            className={`w-full px-3 py-2 text-xs border rounded bg-background text-foreground transition-colors ${
              errors.vehicleType
                ? "border-red-500 focus:outline-none"
                : "border-input focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select a vehicle type</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="lorry">Lorry</option>
            <option value="tempo">Tempo</option>
            <option value="other">Other</option>
          </select>
          {errors.vehicleType && (
            <p className="text-xs text-red-500">{errors.vehicleType}</p>
          )}
        </div>
      </div>

      {/* Vehicle Info Summary */}
      <div className="border border-border rounded-lg p-3 bg-blue-50 space-y-2">
        <h4 className="text-xs font-medium text-blue-900">Vehicle Details</h4>
        <div className="space-y-1 text-xs text-blue-800">
          <p>
            <span className="font-medium">Vehicle:</span>{" "}
            {vehicleInfo.vehicleNumber || "Not entered"}
          </p>
          <p>
            <span className="font-medium">Driver:</span>{" "}
            {vehicleInfo.driverName || "Not entered"}
          </p>
          <p>
            <span className="font-medium">Contact:</span>{" "}
            {vehicleInfo.contactNumber || "Not entered"}
          </p>
          <p>
            <span className="font-medium">Type:</span>{" "}
            {vehicleInfo.vehicleType || "Not entered"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={() => setCurrentStep("request")}
          className="flex-1 px-3 py-2 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSaveVehicleInfo}
          className="flex-1 px-3 py-2 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
