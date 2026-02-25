"use client";

import { create } from "zustand";
import type { StockInRequest, AllocationDetail } from "@/components/warehouse/types";

export type AppMode = "design" | "stock-in";
export type WorkflowStep = "request" | "allocation" | "putaway" | "completion";

interface AllocationState {
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  allocatedQuantity: number;
}

interface StockInStore {
  mode: AppMode;
  
  // 4-Step Workflow State
  currentStep: WorkflowStep;
  currentRequestId: string | null;
  requests: StockInRequest[];
  
  // Allocation step state
  selectedZoneId: string | null;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  allocations: AllocationState[];
  remainingQuantity: number;
  
  // Putaway step state
  putawayConfirmed: boolean;
  
  // UI state
  highlightedZoneId: string | null;
  
  // Mode & Workflow Actions
  setMode: (mode: AppMode) => void;
  setCurrentStep: (step: WorkflowStep) => void;
  
  // Request Management
  addRequest: (request: StockInRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;
  
  // Allocation Actions
  selectZone: (zoneId: string | null) => void;
  selectStructure: (structureId: string | null) => void;
  selectLevel: (levelId: string | null) => void;
  addAllocation: (allocation: AllocationState) => void;
  removeAllocation: (partitionId: string) => void;
  setRemainingQuantity: (quantity: number) => void;
  
  // Putaway Actions
  confirmPutaway: () => void;
  completeWorkflow: (onPartitionUpdate?: (allocation: AllocationState) => void) => void;
  
  // UI Actions
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockInStore = create<StockInStore>((set, get) => ({
  mode: "design",
  currentStep: "request",
  currentRequestId: null,
  requests: [],
  selectedZoneId: null,
  selectedStructureId: null,
  selectedLevelId: null,
  allocations: [],
  remainingQuantity: 0,
  putawayConfirmed: false,
  highlightedZoneId: null,
  
  // Mode & Workflow Actions
  setMode: (mode: AppMode) => set({ mode }),
  
  setCurrentStep: (step: WorkflowStep) => set({ currentStep: step }),
  
  // Request Management
  addRequest: (request: StockInRequest) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  
  approveRequest: (requestId: string) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      ),
    })),
  
  rejectRequest: (requestId: string) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      ),
    })),
  
  startWorkflow: (requestId: string) => {
    const request = get().requests.find((r) => r.id === requestId);
    if (request) {
      set({
        currentRequestId: requestId,
        currentStep: "allocation",
        allocations: [],
        remainingQuantity: request.quantity,
        putawayConfirmed: false,
      });
    }
  },
  
  resetWorkflow: () =>
    set({
      currentRequestId: null,
      currentStep: "request",
      selectedZoneId: null,
      selectedStructureId: null,
      selectedLevelId: null,
      allocations: [],
      remainingQuantity: 0,
      putawayConfirmed: false,
      highlightedZoneId: null,
    }),
  
  // Allocation Actions
  selectZone: (zoneId: string | null) =>
    set({ selectedZoneId: zoneId, highlightedZoneId: zoneId }),
  
  selectStructure: (structureId: string | null) =>
    set({ selectedStructureId: structureId }),
  
  selectLevel: (levelId: string | null) =>
    set({ selectedLevelId: levelId }),
  
  addAllocation: (allocation: AllocationState) =>
    set((state) => ({
      allocations: [...state.allocations, allocation],
      remainingQuantity: Math.max(0, state.remainingQuantity - allocation.allocatedQuantity),
    })),
  
  removeAllocation: (partitionId: string) =>
    set((state) => {
      const allocation = state.allocations.find((a) => a.partitionId === partitionId);
      return {
        allocations: state.allocations.filter((a) => a.partitionId !== partitionId),
        remainingQuantity: allocation
          ? state.remainingQuantity + allocation.allocatedQuantity
          : state.remainingQuantity,
      };
    }),
  
  setRemainingQuantity: (quantity: number) =>
    set({ remainingQuantity: quantity }),
  
  // Putaway Actions
  confirmPutaway: () =>
    set({ putawayConfirmed: true, currentStep: "putaway" }),
  
  completeWorkflow: (onPartitionUpdate?: (allocation: AllocationState) => void) => {
    const state = get();
    if (state.currentRequestId) {
      // Call callback for each allocation to update warehouse data
      state.allocations.forEach((alloc) => {
        if (onPartitionUpdate) {
          onPartitionUpdate(alloc);
        }
      });
      
      // Mark request as completed
      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === state.currentRequestId
            ? { ...req, status: "completed" }
            : req
        ),
        currentStep: "completion",
      }));
    }
  },
  
  // UI Actions
  setHighlightedZone: (zoneId: string | null) =>
    set({ highlightedZoneId: zoneId }),
}));
