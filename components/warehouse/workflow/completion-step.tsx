"use client";

import { useStockIn } from "@/context/stock-in-context";
import { CheckCircle2, ArrowRight, Users, Boxes, Zap, Bell } from "lucide-react";

interface CompletionStepProps {
  onWorkflowComplete?: () => void;
}

export function CompletionStep({ onWorkflowComplete }: CompletionStepProps) {
  const {
    currentRequestId,
    requests,
    allocations,
    resetWorkflow,
  } = useStockInStore();

  const currentRequest = requests.find((r) => r.id === currentRequestId);
  if (!currentRequest) return null;

  const handleNewWorkflow = () => {
    resetWorkflow();
    onWorkflowComplete?.();
  };

  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedQuantity, 0);

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="text-green-600" size={24} />
          <h3 className="text-sm font-semibold text-foreground">Stock In Completed</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          All allocations have been confirmed and warehouse data updated
        </p>
      </div>

      {/* Completion Summary */}
      <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
        {/* Product Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">Product Details</h4>
          <div className="bg-white rounded p-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Product:</span>
              <span className="font-medium text-foreground">{currentRequest.productName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">{currentRequest.productType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Quantity:</span>
              <span className="font-medium text-foreground">
                {currentRequest.quantity} {currentRequest.productUOM}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-medium text-foreground">{currentRequest.vendor}</span>
            </div>
          </div>
        </div>

        {/* Allocations */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-900">Allocation Summary</h4>
          <div className="bg-white rounded p-2 space-y-1 max-h-40 overflow-y-auto">
            {allocations.map((alloc, idx) => (
              <div key={alloc.partitionId} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {idx + 1}. {alloc.partitionName}
                </span>
                <span className="font-medium text-foreground">
                  {alloc.allocatedQuantity} units
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-1 mt-1 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total Allocated:</span>
              <span className="font-bold text-green-700">{totalAllocated} units</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Request Status:</span>
            <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-800">
              COMPLETED
            </span>
          </div>
        </div>

        {/* Vehicle Information - Tracking */}
        {currentRequest.vehicleInfo && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-green-900">Vehicle Information</h4>
            <div className="bg-white rounded p-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Vehicle Number:</span>
                <span className="font-medium text-foreground">
                  {currentRequest.vehicleInfo.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Driver Name:</span>
                <span className="font-medium text-foreground">
                  {currentRequest.vehicleInfo.driverName}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-medium text-foreground">
                  {currentRequest.vehicleInfo.contactNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Vehicle Type:</span>
                <span className="font-medium text-foreground capitalize">
                  {currentRequest.vehicleInfo.vehicleType}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Handling Method Information */}
        {currentRequest.handlingMethodInfo && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-green-900">Handling Method</h4>
            <div className="bg-white rounded p-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentRequest.handlingMethodInfo.method === "manpower" && (
                    <>
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-foreground">Manual Handling</span>
                    </>
                  )}
                  {currentRequest.handlingMethodInfo.method === "conveyor" && (
                    <>
                      <Boxes className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-medium text-foreground">Conveyor Belt System</span>
                    </>
                  )}
                  {currentRequest.handlingMethodInfo.method === "machine" && (
                    <>
                      <Zap className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-foreground">Machinery Handling</span>
                    </>
                  )}
                </div>
              </div>

              {/* Assigned Employees */}
              {currentRequest.handlingMethodInfo.assignedEmployees.length > 0 && (
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Bell className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Notifications Sent to {currentRequest.handlingMethodInfo.assignedEmployees.length} Employee{currentRequest.handlingMethodInfo.assignedEmployees.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {currentRequest.handlingMethodInfo.assignedEmployees.map((emp) => (
                      <div key={emp.id} className="text-xs text-muted-foreground">
                        <span className="font-medium">{emp.name}</span> ({emp.role}) - {emp.email}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-1">
                Processed: {new Date(currentRequest.handlingMethodInfo.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warehouse Update Confirmation */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          Partition capacity has been automatically updated in the warehouse layout. 
          The changes are now visible in the canvas.
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-foreground">Next Steps</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Monitor partition capacity in warehouse view
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Process additional stock in requests as needed
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight size={12} className="flex-shrink-0" />
            Generate reports from completed transactions
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNewWorkflow}
        className="w-full px-4 py-2 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Process New Stock In Request
      </button>
    </div>
  );
}
