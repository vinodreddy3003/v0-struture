"use client";

import { useState } from "react";
import { useStockInStore } from "@/store/stock-in-store";
import { Bell, Users, Zap, Boxes, ChevronDown } from "lucide-react";
import type { HandlingMethodType, AssignedEmployee } from "@/components/warehouse/types";

// Mock employee data
const MOCK_EMPLOYEES: AssignedEmployee[] = [
  {
    id: "emp001",
    name: "John Smith",
    email: "john.smith@warehouse.com",
    contactNumber: "+1-555-0101",
    role: "Material Handler",
  },
  {
    id: "emp002",
    name: "Sarah Johnson",
    email: "sarah.johnson@warehouse.com",
    contactNumber: "+1-555-0102",
    role: "Logistics Coordinator",
  },
  {
    id: "emp003",
    name: "Mike Chen",
    email: "mike.chen@warehouse.com",
    contactNumber: "+1-555-0103",
    role: "Forklift Operator",
  },
  {
    id: "emp004",
    name: "Emily Davis",
    email: "emily.davis@warehouse.com",
    contactNumber: "+1-555-0104",
    role: "Material Handler",
  },
  {
    id: "emp005",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@warehouse.com",
    contactNumber: "+1-555-0105",
    role: "Warehouse Supervisor",
  },
];

export function HandlingMethodStep() {
  const {
    currentRequestId,
    requests,
    selectedHandlingMethod,
    assignedEmployees,
    selectHandlingMethod,
    addAssignedEmployee,
    removeAssignedEmployee,
    setCurrentStep,
    saveHandlingMethod,
  } = useStockInStore();

  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const currentRequest = requests.find((r) => r.id === currentRequestId);

  if (!currentRequest) {
    return <div className="text-center py-8 text-muted-foreground">No request found</div>;
  }

  const handleMethodSelect = (method: HandlingMethodType) => {
    selectHandlingMethod(method);
    setValidationError("");
  };

  const handleToggleEmployee = (employee: AssignedEmployee) => {
    if (assignedEmployees.some((e) => e.id === employee.id)) {
      removeAssignedEmployee(employee.id);
    } else {
      addAssignedEmployee(employee);
    }
  };

  const handleSaveAndContinue = () => {
    // Validate if manpower is selected
    if (selectedHandlingMethod === "manpower" && assignedEmployees.length === 0) {
      setValidationError("Please assign at least one employee for manual handling.");
      return;
    }

    if (!selectedHandlingMethod) {
      setValidationError("Please select a handling method.");
      return;
    }

    // Save handling method
    saveHandlingMethod();
    setShowNotificationToast(true);

    // Proceed to putaway step after a short delay
    setTimeout(() => {
      setCurrentStep("putaway");
    }, 1500);
  };

  const handleBack = () => {
    setCurrentStep("putaway");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-foreground">Handling Method Selection</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how goods will be moved: manual handling, conveyor system, or machinery
        </p>
      </div>

      {/* Handling Method Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Select Handling Method</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* Manpower Option */}
          <button
            onClick={() => handleMethodSelect("manpower")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedHandlingMethod === "manpower"
                ? "border-blue-500 bg-blue-50"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold text-sm">Manpower</p>
            <p className="text-xs text-muted-foreground mt-1">Manual handling</p>
          </button>

          {/* Conveyor Belt Option */}
          <button
            onClick={() => handleMethodSelect("conveyor")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedHandlingMethod === "conveyor"
                ? "border-amber-500 bg-amber-50"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Boxes className="w-6 h-6 mx-auto mb-2 text-amber-600" />
            <p className="font-semibold text-sm">Conveyor Belts</p>
            <p className="text-xs text-muted-foreground mt-1">Automated system</p>
          </button>

          {/* Machine Option */}
          <button
            onClick={() => handleMethodSelect("machine")}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedHandlingMethod === "machine"
                ? "border-purple-500 bg-purple-50"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold text-sm">Machines</p>
            <p className="text-xs text-muted-foreground mt-1">Machinery handling</p>
          </button>
        </div>
      </div>

      {/* Conditional Employee Selection for Manpower */}
      {selectedHandlingMethod === "manpower" && (
        <div className="space-y-3 border border-blue-200 rounded-lg p-4 bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-900">Assign Employees</h3>
          <p className="text-xs text-blue-800">
            Select one or more employees to handle this stock-in job
          </p>

          {/* Employee List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {MOCK_EMPLOYEES.map((employee) => (
              <div
                key={employee.id}
                className="flex items-start gap-3 p-2 bg-white rounded border border-blue-100 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleToggleEmployee(employee)}
              >
                <input
                  type="checkbox"
                  checked={assignedEmployees.some((e) => e.id === employee.id)}
                  onChange={() => {}}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.role}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span>{employee.contactNumber}</span>
                    <span>•</span>
                    <span className="truncate">{employee.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Employees Summary */}
          {assignedEmployees.length > 0 && (
            <div className="border-t border-blue-200 pt-3">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                {assignedEmployees.length} employee{assignedEmployees.length !== 1 ? "s" : ""} assigned:
              </p>
              <div className="space-y-1">
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between bg-white p-2 rounded text-sm"
                  >
                    <span className="text-foreground">{emp.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAssignedEmployee(emp.id);
                      }}
                      className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Notification Preview */}
              <div className="mt-3 p-2 rounded bg-white border border-blue-200">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">Notifications will be sent to:</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      {assignedEmployees.map((emp) => (
                        <li key={emp.id}>• {emp.email}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation for Non-Manpower Methods */}
      {selectedHandlingMethod && selectedHandlingMethod !== "manpower" && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedHandlingMethod === "conveyor" ? "bg-amber-100" : "bg-purple-100"
              }`}
            >
              {selectedHandlingMethod === "conveyor" ? (
                <Boxes className={`w-5 h-5 ${selectedHandlingMethod === "conveyor" ? "text-amber-600" : "text-purple-600"}`} />
              ) : (
                <Zap className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {selectedHandlingMethod === "conveyor" ? "Conveyor Belt System" : "Machinery Handling"} Selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedHandlingMethod === "conveyor"
                  ? "Goods will be moved using automated conveyor system. No employee assignment required."
                  : "Goods will be moved using machinery. No employee assignment required."}
              </p>
              <p className="text-xs text-green-700 font-medium mt-2">
                Ready to proceed to completion
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{validationError}</p>
        </div>
      )}

      {/* Notification Toast */}
      {showNotificationToast && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-green-900">Notifications Sent</p>
              <p className="text-xs text-green-800 mt-1">
                {selectedHandlingMethod === "manpower"
                  ? `Notification sent to ${assignedEmployees.length} employee${
                      assignedEmployees.length !== 1 ? "s" : ""
                    } with task details`
                  : `Handling method recorded for tracking and audit purposes`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={handleBack}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!selectedHandlingMethod}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
