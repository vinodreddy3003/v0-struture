"use client";

import { create } from "zustand";
import type { StockInRequest, AllocationDetail } from "@/components/warehouse/types";

export type AppMode = "design" | "stock-in";

type AssignmentStep = "request-list" | "zone-select" | "structure-select" | "partition-select" | "quantity-assign" | "review";

interface StockInStore {
  mode: AppMode;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  selectedPartition: {
    id: string;
    name: string;
    code: string;
    width: number;
    max_capacity: number;
    used_capacity: number;
  } | null;
  
  // Stock In Workflow State
  requests: StockInRequest[];
  currentAssignmentStep: AssignmentStep;
  currentRequestId: string | null;
  selectedZoneId: string | null;
  selectedAllocationStructureId: string | null;
  selectedAllocationPartitions: AllocationDetail[];
  remainingQuantity: number;
  highlightedZoneId: string | null;
  
  // Mode & Partition Selection
  setMode: (mode: AppMode) => void;
  selectPartition: (structureId: string, levelId: string, partition: any) => void;
  clearSelection: () => void;
  resetToDesignMode: () => void;
  
  // Stock In Workflow Actions
  addRequest: (request: StockInRequest) => void;
  updateRequestStatus: (requestId: string, status: StockInRequest["status"]) => void;
  startAssignment: (requestId: string) => void;
  setAssignmentStep: (step: AssignmentStep) => void;
  selectZone: (zoneId: string | null) => void;
  selectAllocationStructure: (structureId: string | null) => void;
  addAllocation: (allocation: AllocationDetail) => void;
  removeAllocation: (partitionId: string) => void;
  confirmAllocations: () => void;
  cancelAssignment: () => void;
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockInStore = create<StockInStore>((set, get) => ({
  // Mode & Partition Selection State
  mode: "design",
  selectedStructureId: null,
  selectedLevelId: null,
  selectedPartition: null,
  
  // Stock In Workflow State
  requests: [],
  currentAssignmentStep: "request-list",
  currentRequestId: null,
  selectedZoneId: null,
  selectedAllocationStructureId: null,
  selectedAllocationPartitions: [],
  remainingQuantity: 0,
  highlightedZoneId: null,
  
  // Mode & Partition Selection Actions
  setMode: (mode: AppMode) => set({ mode }),
  
  selectPartition: (structureId: string, levelId: string, partition: any) =>
    set({
      selectedStructureId: structureId,
      selectedLevelId: levelId,
      selectedPartition: partition,
    }),
  
  clearSelection: () =>
    set({
      selectedStructureId: null,
      selectedLevelId: null,
      selectedPartition: null,
    }),
  
  resetToDesignMode: () =>
    set({
      mode: "design",
      selectedStructureId: null,
      selectedLevelId: null,
      selectedPartition: null,
    }),
  
  // Stock In Workflow Actions
  addRequest: (request: StockInRequest) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),
  
  updateRequestStatus: (requestId: string, status: StockInRequest["status"]) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      ),
    })),
  
  startAssignment: (requestId: string) => {
    const request = get().requests.find((r) => r.id === requestId);
    if (request) {
      set({
        currentRequestId: requestId,
        currentAssignmentStep: "zone-select",
        remainingQuantity: request.quantity,
        selectedAllocationPartitions: [],
      });
    }
  },
  
  setAssignmentStep: (step: AssignmentStep) =>
    set({ currentAssignmentStep: step }),
  
  selectZone: (zoneId: string | null) =>
    set({ selectedZoneId: zoneId, highlightedZoneId: zoneId }),
  
  selectAllocationStructure: (structureId: string | null) =>
    set({ selectedAllocationStructureId: structureId }),
  
  addAllocation: (allocation: AllocationDetail) =>
    set((state) => {
      const remaining = state.remainingQuantity - allocation.allocatedQuantity;
      return {
        selectedAllocationPartitions: [...state.selectedAllocationPartitions, allocation],
        remainingQuantity: Math.max(0, remaining),
      };
    }),
  
  removeAllocation: (partitionId: string) =>
    set((state) => {
      const allocation = state.selectedAllocationPartitions.find(
        (a) => a.partitionId === partitionId
      );
      const request = state.requests.find((r) => r.id === state.currentRequestId);
      return {
        selectedAllocationPartitions: state.selectedAllocationPartitions.filter(
          (a) => a.partitionId !== partitionId
        ),
        remainingQuantity: allocation && request
          ? state.remainingQuantity + allocation.allocatedQuantity
          : state.remainingQuantity,
      };
    }),
  
  confirmAllocations: () => {
    const state = get();
    if (state.currentRequestId) {
      set({
        requests: state.requests.map((req) =>
          req.id === state.currentRequestId
            ? {
                ...req,
                allocations: state.selectedAllocationPartitions,
                status: "in-progress",
              }
            : req
        ),
        currentAssignmentStep: "request-list",
        currentRequestId: null,
        selectedZoneId: null,
        selectedAllocationStructureId: null,
        selectedAllocationPartitions: [],
        remainingQuantity: 0,
        highlightedZoneId: null,
      });
    }
  },
  
  cancelAssignment: () =>
    set({
      currentAssignmentStep: "request-list",
      currentRequestId: null,
      selectedZoneId: null,
      selectedAllocationStructureId: null,
      selectedAllocationPartitions: [],
      remainingQuantity: 0,
      highlightedZoneId: null,
    }),
  
  setHighlightedZone: (zoneId: string | null) =>
    set({ highlightedZoneId: zoneId }),
}));
