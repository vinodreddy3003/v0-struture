"use client";

import { create } from "zustand";
import type { StockOutRequest, PickDetail } from "@/components/warehouse/types";

export type AppMode = "design" | "stock-out";
export type StockOutWorkflowStep = "inventory" | "select-structure" | "quantity" | "completion";
export type UserRole = "manager" | "warehouse-staff";

interface PickState {
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  pickedQuantity: number;
}

interface StockOutStore {
  mode: AppMode;

  // 5-Step Workflow State
  currentStep: StockOutWorkflowStep;
  currentRequestId: string | null;
  requests: StockOutRequest[];

  // Manager/User state
  currentUserRole: UserRole;
  currentUserName: string;

  // Inventory step state
  availableItems: Array<{
    id: string;
    productName: string;
    productType: string;
    quantity: number;
    stockInRequestId: string;
  }>;

  // Item selection state
  selectedItemId: string | null;
  selectedItem: any | null;

  // Structure selection state
  selectedStructureId: string | null;
  structuresWithItem: Array<{
    structureId: string;
    structureName: string;
    availableQuantity: number;
  }>;

  // Quantity entry state
  requestedQuantity: number;

  // Remaining state
  verificationConfirmed: boolean;

  // UI state
  highlightedZoneId: string | null;

  // Mode & Workflow Actions
  setMode: (mode: AppMode) => void;
  setCurrentStep: (step: StockOutWorkflowStep) => void;

  // Request Management
  addRequest: (request: StockOutRequest) => void;
  resetWorkflow: () => void;

  // Manager Actions
  setUserRole: (role: UserRole) => void;
  setUserName: (name: string) => void;
  getPendingRequests: () => StockOutRequest[];
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  updateRequestStatus: (requestId: string, status: "pending" | "approved" | "rejected" | "in-progress" | "picked" | "completed") => void;

  // Inventory Actions
  loadAvailableItems: (items: any[]) => void;
  
  // Item Selection Actions
  selectItem: (itemId: string, item: any) => void;
  
  // Structure Selection Actions
  loadStructuresForItem: (structures: any[]) => void;
  selectStructure: (structureId: string) => void;
  
  // Quantity Actions
  setRequestedQuantity: (quantity: number) => void;
  
  // Verification Actions
  confirmVerification: () => void;
  completeWorkflow: () => void;

  // UI Actions
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockOutStore = create<StockOutStore>((set, get) => ({
  mode: "design",
  currentStep: "inventory",
  currentRequestId: null,
  requests: [],
  currentUserRole: "warehouse-staff",
  currentUserName: "",
  availableItems: [],
  selectedItemId: null,
  selectedItem: null,
  selectedStructureId: null,
  structuresWithItem: [],
  requestedQuantity: 0,
  verificationConfirmed: false,
  highlightedZoneId: null,

  // Mode & Workflow Actions
  setMode: (mode: AppMode) => set({ mode }),

  setCurrentStep: (step: StockOutWorkflowStep) => set({ currentStep: step }),

  // Request Management
  addRequest: (request: StockOutRequest) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),

  resetWorkflow: () =>
    set({
      currentStep: "inventory",
      currentRequestId: null,
      selectedItemId: null,
      selectedItem: null,
      selectedStructureId: null,
      structuresWithItem: [],
      requestedQuantity: 0,
      verificationConfirmed: false,
    }),

  // Manager Actions
  setUserRole: (role: UserRole) => set({ currentUserRole: role }),

  setUserName: (name: string) => set({ currentUserName: name }),

  getPendingRequests: () => {
    const state = get();
    return state.requests.filter((req) => req.status === "pending");
  },

  approveRequest: (requestId: string) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved" as const,
              approvedBy: state.currentUserName,
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : req
      ),
    }));
  },

  rejectRequest: (requestId: string, reason: string) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "rejected" as const,
              rejectionReason: reason,
              approvalDate: new Date().toISOString().split("T")[0],
            }
          : req
      ),
    }));
  },

  updateRequestStatus: (requestId: string, status: "pending" | "approved" | "rejected" | "in-progress" | "picked" | "completed") => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      ),
    }));
  },

  // Inventory Actions
  loadAvailableItems: (items: any[]) => set({ availableItems: items }),

  // Item Selection Actions
  selectItem: (itemId: string, item: any) =>
    set({
      selectedItemId: itemId,
      selectedItem: item,
      selectedStructureId: null,
      requestedQuantity: 0,
    }),

  // Structure Selection Actions
  loadStructuresForItem: (structures: any[]) =>
    set({ structuresWithItem: structures }),

  selectStructure: (structureId: string) =>
    set({ selectedStructureId: structureId, requestedQuantity: 0 }),

  // Quantity Actions
  setRequestedQuantity: (quantity: number) =>
    set({ requestedQuantity: quantity }),

  // Verification Actions
  confirmVerification: () => set({ verificationConfirmed: true }),

  completeWorkflow: () =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          id: `STO-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          productName: state.selectedItem?.productName || "",
          productType: state.selectedItem?.productType || "",
          productValue: state.selectedItem?.productValue || 0,
          productUOM: state.selectedItem?.productUOM || "",
          quantity: state.requestedQuantity,
          customer: "Stock Out",
          status: "completed" as const,
          picks: [],
          notes: `Picked from structure ${state.selectedStructureId}`,
          createdBy: state.currentUserName,
          createdDate: new Date().toISOString().split("T")[0],
        },
      ],
      currentStep: "completion",
    })),

  // UI Actions
  setHighlightedZone: (zoneId: string | null) => set({ highlightedZoneId: zoneId }),
}));
