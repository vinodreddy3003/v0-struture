"use client";

import { create } from "zustand";

export type StockOutStatus = "pending" | "approved" | "rejected" | "picking" | "completed";
export type WorkflowStep = "request" | "zone-selection" | "picking" | "completion";

export interface StockOutRequest {
  id: string;
  productName: string;
  productType: string;
  quantity: number;
  productValue: number;
  uom: string;
  vendor: string;
  notes?: string;
  status: StockOutStatus;
  createdAt: string;
}

export interface PickingLocation {
  zoneId: string;
  zoneName: string;
  structureId: string;
  structureName: string;
  levelId: string;
  levelName: string;
  partitionId: string;
  partitionName: string;
  availableQuantity: number;
}

export interface PickingAllocation {
  locationId: string;
  location: PickingLocation;
  pickedQuantity: number;
}

interface StockOutStore {
  // Workflow State
  currentStep: WorkflowStep;
  currentRequestId: string | null;
  currentRequest: StockOutRequest | null;
  requests: StockOutRequest[];
  
  // Approval step state
  selectedRequestId: string | null;
  
  // Zone selection state
  selectedZoneId: string | null;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  selectedPartitionId: string | null;
  availableLocations: PickingLocation[];
  
  // Picking step state
  pickingAllocations: PickingAllocation[];
  totalPickedQuantity: number;
  remainingQuantity: number;
  
  // Request Management
  addRequest: (request: StockOutRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  
  // Workflow Navigation
  setCurrentStep: (step: WorkflowStep) => void;
  startApprovalFlow: (requestId: string) => void;
  startZoneSelection: () => void;
  startPicking: () => void;
  resetWorkflow: () => void;
  
  // Zone Selection Actions
  selectZone: (zoneId: string) => void;
  selectStructure: (structureId: string) => void;
  selectLevel: (levelId: string) => void;
  selectPartition: (partitionId: string) => void;
  setAvailableLocations: (locations: PickingLocation[]) => void;
  
  // Picking Actions
  addPickingAllocation: (allocation: PickingAllocation) => void;
  updatePickedQuantity: (locationId: string, quantity: number) => void;
  removePickingAllocation: (locationId: string) => void;
  confirmPicking: () => void;
  completeWorkflow: () => void;
}

export const useStockOutStore = create<StockOutStore>((set, get) => ({
  currentStep: "request",
  currentRequestId: null,
  currentRequest: null,
  requests: [],
  selectedRequestId: null,
  selectedZoneId: null,
  selectedStructureId: null,
  selectedLevelId: null,
  selectedPartitionId: null,
  availableLocations: [],
  pickingAllocations: [],
  totalPickedQuantity: 0,
  remainingQuantity: 0,
  
  // Request Management
  addRequest: (request: StockOutRequest) =>
    set((state) => ({
      requests: [...state.requests, request],
      currentRequest: request,
      currentRequestId: request.id,
    })),
  
  approveRequest: (requestId: string) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req
      ),
      currentStep: "zone-selection",
    })),
  
  rejectRequest: (requestId: string) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req
      ),
      currentStep: "request",
    })),
  
  // Workflow Navigation
  setCurrentStep: (step: WorkflowStep) => set({ currentStep: step }),
  
  startApprovalFlow: (requestId: string) => {
    set({
      selectedRequestId: requestId,
      currentStep: "zone-selection",
    });
  },
  
  startZoneSelection: () => {
    set({ currentStep: "zone-selection" });
  },
  
  startPicking: () => {
    set({ currentStep: "picking" });
  },
  
  resetWorkflow: () =>
    set({
      currentStep: "request",
      currentRequestId: null,
      selectedRequestId: null,
      selectedZoneId: null,
      selectedStructureId: null,
      selectedLevelId: null,
      selectedPartitionId: null,
      availableLocations: [],
      pickingAllocations: [],
      totalPickedQuantity: 0,
      remainingQuantity: 0,
    }),
  
  // Zone Selection Actions
  selectZone: (zoneId: string) =>
    set({ selectedZoneId: zoneId, selectedStructureId: null, selectedLevelId: null, selectedPartitionId: null }),
  
  selectStructure: (structureId: string) =>
    set({ selectedStructureId: structureId, selectedLevelId: null, selectedPartitionId: null }),
  
  selectLevel: (levelId: string) =>
    set({ selectedLevelId: levelId, selectedPartitionId: null }),
  
  selectPartition: (partitionId: string) =>
    set({ selectedPartitionId: partitionId }),
  
  setAvailableLocations: (locations: PickingLocation[]) =>
    set({ availableLocations: locations }),
  
  // Picking Actions
  addPickingAllocation: (allocation: PickingAllocation) =>
    set((state) => {
      const existing = state.pickingAllocations.find((a) => a.locationId === allocation.locationId);
      let updated: PickingAllocation[];
      
      if (existing) {
        updated = state.pickingAllocations.map((a) =>
          a.locationId === allocation.locationId ? allocation : a
        );
      } else {
        updated = [...state.pickingAllocations, allocation];
      }
      
      const totalPicked = updated.reduce((sum, a) => sum + a.pickedQuantity, 0);
      
      return {
        pickingAllocations: updated,
        totalPickedQuantity: totalPicked,
      };
    }),
  
  updatePickedQuantity: (locationId: string, quantity: number) =>
    set((state) => {
      const allocation = state.pickingAllocations.find((a) => a.locationId === locationId);
      if (!allocation) return state;
      
      const updated = state.pickingAllocations.map((a) =>
        a.locationId === locationId ? { ...a, pickedQuantity: quantity } : a
      );
      
      const totalPicked = updated.reduce((sum, a) => sum + a.pickedQuantity, 0);
      
      return {
        pickingAllocations: updated,
        totalPickedQuantity: totalPicked,
      };
    }),
  
  removePickingAllocation: (locationId: string) =>
    set((state) => {
      const updated = state.pickingAllocations.filter((a) => a.locationId !== locationId);
      const totalPicked = updated.reduce((sum, a) => sum + a.pickedQuantity, 0);
      
      return {
        pickingAllocations: updated,
        totalPickedQuantity: totalPicked,
      };
    }),
  
  confirmPicking: () => {
    set({ currentStep: "completion" });
  },
  
  completeWorkflow: () => {
    const state = get();
    if (state.selectedRequestId) {
      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === state.selectedRequestId
            ? { ...req, status: "completed" }
            : req
        ),
      }));
    }
  },
}));
