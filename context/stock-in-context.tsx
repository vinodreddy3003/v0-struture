"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { StockInRequest, AllocationDetail, HandlingMethodType, AssignedEmployee } from "@/components/warehouse/types";

export type AppMode = "design" | "stock-in";
export type WorkflowStep = "request" | "vehicle" | "allocation" | "handling" | "putaway" | "completion";

export interface AllocationState {
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  allocatedQuantity: number;
}

interface StockInContextType {
  mode: AppMode;
  currentStep: WorkflowStep;
  currentRequestId: string | null;
  requests: StockInRequest[];
  selectedZoneId: string | null;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  allocations: AllocationState[];
  remainingQuantity: number;
  putawayConfirmed: boolean;
  selectedHandlingMethod: HandlingMethodType | null;
  assignedEmployees: AssignedEmployee[];
  highlightedZoneId: string | null;
  
  // Actions
  setMode: (mode: AppMode) => void;
  setCurrentStep: (step: WorkflowStep) => void;
  addRequest: (request: StockInRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;
  selectZone: (zoneId: string | null) => void;
  selectStructure: (structureId: string | null) => void;
  selectLevel: (levelId: string | null) => void;
  addAllocation: (allocation: AllocationState) => void;
  removeAllocation: (partitionId: string) => void;
  setRemainingQuantity: (quantity: number) => void;
  updateVehicleInfo: (vehicleInfo: any) => void;
  selectHandlingMethod: (method: HandlingMethodType) => void;
  addAssignedEmployee: (employee: AssignedEmployee) => void;
  removeAssignedEmployee: (employeeId: string) => void;
  saveHandlingMethod: () => void;
  confirmPutaway: () => void;
  completeWorkflow: (onPartitionUpdate?: (allocation: AllocationState) => void) => void;
  setHighlightedZone: (zoneId: string | null) => void;
}

const StockInContext = createContext<StockInContextType | undefined>(undefined);

export function StockInProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>("design");
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("request");
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<StockInRequest[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<AllocationState[]>([]);
  const [remainingQuantity, setRemainingQuantity] = useState<number>(0);
  const [putawayConfirmed, setPutawayConfirmed] = useState<boolean>(false);
  const [selectedHandlingMethod, setSelectedHandlingMethod] = useState<HandlingMethodType | null>(null);
  const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([]);
  const [highlightedZoneId, setHighlightedZoneId] = useState<string | null>(null);

  const addRequest = useCallback((request: StockInRequest) => {
    setRequests((prev) => [...prev, request]);
  }, []);

  const approveRequest = useCallback((requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
  }, []);

  const rejectRequest = useCallback((requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      )
    );
  }, []);

  const startWorkflow = useCallback((requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (request) {
      setCurrentRequestId(requestId);
      setCurrentStep("vehicle");
      setAllocations([]);
      setRemainingQuantity(request.quantity);
      setPutawayConfirmed(false);
      setSelectedHandlingMethod(null);
      setAssignedEmployees([]);
    }
  }, [requests]);

  const resetWorkflow = useCallback(() => {
    setCurrentRequestId(null);
    setCurrentStep("request");
    setSelectedZoneId(null);
    setSelectedStructureId(null);
    setSelectedLevelId(null);
    setAllocations([]);
    setRemainingQuantity(0);
    setPutawayConfirmed(false);
    setSelectedHandlingMethod(null);
    setAssignedEmployees([]);
    setHighlightedZoneId(null);
  }, []);

  const selectZone = useCallback((zoneId: string | null) => {
    setSelectedZoneId(zoneId);
    setHighlightedZoneId(zoneId);
  }, []);

  const addAllocation = useCallback((allocation: AllocationState) => {
    setAllocations((prev) => [...prev, allocation]);
    setRemainingQuantity((prev) => Math.max(0, prev - allocation.allocatedQuantity));
  }, []);

  const removeAllocation = useCallback((partitionId: string) => {
    setAllocations((prev) => {
      const allocation = prev.find((a) => a.partitionId === partitionId);
      if (allocation) {
        setRemainingQuantity((q) => q + allocation.allocatedQuantity);
      }
      return prev.filter((a) => a.partitionId !== partitionId);
    });
  }, []);

  const updateVehicleInfo = useCallback((vehicleInfo: any) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === currentRequestId ? { ...req, vehicleInfo } : req
      )
    );
  }, [currentRequestId]);

  const selectHandlingMethodFn = useCallback((method: HandlingMethodType) => {
    setSelectedHandlingMethod(method);
    setAssignedEmployees([]);
  }, []);

  const addAssignedEmployee = useCallback((employee: AssignedEmployee) => {
    setAssignedEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      if (exists) return prev;
      return [...prev, employee];
    });
  }, []);

  const removeAssignedEmployee = useCallback((employeeId: string) => {
    setAssignedEmployees((prev) => prev.filter((e) => e.id !== employeeId));
  }, []);

  const saveHandlingMethod = useCallback(() => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === currentRequestId
          ? {
              ...req,
              handlingMethodInfo: {
                method: selectedHandlingMethod!,
                assignedEmployees,
                timestamp: new Date().toISOString(),
              },
            }
          : req
      )
    );
  }, [currentRequestId, selectedHandlingMethod, assignedEmployees]);

  const completeWorkflow = useCallback(
    (onPartitionUpdate?: (allocation: AllocationState) => void) => {
      allocations.forEach((alloc) => {
        if (onPartitionUpdate) {
          onPartitionUpdate(alloc);
        }
      });

      if (currentRequestId) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === currentRequestId ? { ...req, status: "completed" } : req
          )
        );
        setCurrentStep("completion");
      }
    },
    [allocations, currentRequestId]
  );

  const value: StockInContextType = {
    mode,
    currentStep,
    currentRequestId,
    requests,
    selectedZoneId,
    selectedStructureId,
    selectedLevelId,
    allocations,
    remainingQuantity,
    putawayConfirmed,
    selectedHandlingMethod,
    assignedEmployees,
    highlightedZoneId,
    setMode,
    setCurrentStep,
    addRequest,
    approveRequest,
    rejectRequest,
    startWorkflow,
    resetWorkflow,
    selectZone,
    selectStructure: setSelectedStructureId,
    selectLevel: setSelectedLevelId,
    addAllocation,
    removeAllocation,
    setRemainingQuantity,
    updateVehicleInfo,
    selectHandlingMethod: selectHandlingMethodFn,
    addAssignedEmployee,
    removeAssignedEmployee,
    saveHandlingMethod,
    confirmPutaway: () => {
      setPutawayConfirmed(true);
      setCurrentStep("putaway");
    },
    completeWorkflow,
    setHighlightedZone,
  };

  return (
    <StockInContext.Provider value={value}>{children}</StockInContext.Provider>
  );
}

export function useStockIn() {
  const context = useContext(StockInContext);
  if (!context) {
    throw new Error("useStockIn must be used within StockInProvider");
  }
  return context;
}
