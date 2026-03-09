"use client";

import { create } from "zustand";
import type { StockOutRequest, StockOutPickingDetail } from "@/components/warehouse/types";

export type StockOutWorkflowStep = "request" | "approval" | "order-selection" | "picking" | "completion";

interface StockOutStore {
  // Workflow state
  currentStep: StockOutWorkflowStep;
  currentRequestId: string | null;
  requests: StockOutRequest[];
  
  // Request step state
  formData: {
    orderReference: string;
    productName: string;
    productType: string;
    productUOM: string;
    quantity: number;
    notes: string;
  };
  
  // Order selection step state
  selectedZoneId: string | null;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  selectedPartitionId: string | null;
  selectedPickingDetail: StockOutPickingDetail | null;
  
  // Picking step state
  pickedQuantity: number;
  pickingConfirmed: boolean;
  pickingHistory: Array<{
    partitionId: string;
    partitionName: string;
    quantity: number;
    timestamp: string;
  }>;
  
  // UI state
  highlightedZoneId: string | null;
  
  // Request Management
  addRequest: (request: StockOutRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;
  updateRequest: (requestId: string, updates: Partial<StockOutRequest>) => void;
  
  // Form actions
  setFormData: (data: Partial<StockOutStore["formData"]>) => void;
  resetFormData: () => void;
  
  // Workflow navigation
  setCurrentStep: (step: StockOutWorkflowStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Order selection actions
  selectZone: (zoneId: string | null) => void;
  selectStructure: (structureId: string | null) => void;
  selectLevel: (levelId: string | null) => void;
  selectPartition: (partitionId: string | null) => void;
  setSelectedPickingDetail: (detail: StockOutPickingDetail | null) => void;
  
  // Picking actions
  setPickedQuantity: (quantity: number) => void;
  confirmPicking: () => void;
  addPickingHistory: (partitionId: string, partitionName: string, quantity: number) => void;
  clearPickingHistory: () => void;
  
  // UI actions
  setHighlightedZone: (zoneId: string | null) => void;
  
  // Completion
  completeWorkflow: () => void;
}

const defaultFormData = {
  orderReference: "",
  productName: "",
  productType: "",
  productUOM: "",
  quantity: 0,
  notes: "",
};

const WORKFLOW_STEPS: StockOutWorkflowStep[] = ["request", "approval", "order-selection", "picking", "completion"];

export const useStockOutStore = create<StockOutStore>((set, get) => ({
  currentStep: "request",
  currentRequestId: null,
  requests: [],
  formData: defaultFormData,
  selectedZoneId: null,
  selectedStructureId: null,
  selectedLevelId: null,
  selectedPartitionId: null,
  selectedPickingDetail: null,
  pickedQuantity: 0,
  pickingConfirmed: false,
  pickingHistory: [],
  highlightedZoneId: null,
  
  // Request Management
  addRequest: (request: StockOutRequest) =>
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
        currentStep: "order-selection",
        selectedZoneId: null,
        selectedStructureId: null,
        selectedLevelId: null,
        selectedPartitionId: null,
        selectedPickingDetail: null,
        pickedQuantity: 0,
        pickingConfirmed: false,
      });
    }
  },
  
  resetWorkflow: () =>
    set({
      currentRequestId: null,
      currentStep: "request",
      formData: defaultFormData,
      selectedZoneId: null,
      selectedStructureId: null,
      selectedLevelId: null,
      selectedPartitionId: null,
      selectedPickingDetail: null,
      pickedQuantity: 0,
      pickingConfirmed: false,
      pickingHistory: [],
      highlightedZoneId: null,
    }),

  updateRequest: (requestId: string, updates: Partial<StockOutRequest>) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, ...updates } : req
      ),
    })),
  
  // Form actions
  setFormData: (data: Partial<StockOutStore["formData"]>) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  
  resetFormData: () => set({ formData: defaultFormData }),
  
  // Workflow navigation
  setCurrentStep: (step: StockOutWorkflowStep) => set({ currentStep: step }),
  
  nextStep: () => {
    const state = get();
    const currentIndex = WORKFLOW_STEPS.indexOf(state.currentStep);
    if (currentIndex < WORKFLOW_STEPS.length - 1) {
      set({ currentStep: WORKFLOW_STEPS[currentIndex + 1] });
    }
  },
  
  previousStep: () => {
    const state = get();
    const currentIndex = WORKFLOW_STEPS.indexOf(state.currentStep);
    if (currentIndex > 0) {
      set({ currentStep: WORKFLOW_STEPS[currentIndex - 1] });
    }
  },
  
  // Order selection actions
  selectZone: (zoneId: string | null) =>
    set({ selectedZoneId: zoneId, highlightedZoneId: zoneId }),
  
  selectStructure: (structureId: string | null) =>
    set({ selectedStructureId: structureId }),
  
  selectLevel: (levelId: string | null) =>
    set({ selectedLevelId: levelId }),
  
  selectPartition: (partitionId: string | null) =>
    set({ selectedPartitionId: partitionId }),
  
  setSelectedPickingDetail: (detail: StockOutPickingDetail | null) =>
    set({ selectedPickingDetail: detail }),
  
  // Picking actions
  setPickedQuantity: (quantity: number) =>
    set({ pickedQuantity: Math.max(0, quantity) }),
  
  confirmPicking: () =>
    set({ pickingConfirmed: true, currentStep: "completion" }),

  addPickingHistory: (partitionId: string, partitionName: string, quantity: number) =>
    set((state) => ({
      pickingHistory: [
        ...state.pickingHistory,
        {
          partitionId,
          partitionName,
          quantity,
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  clearPickingHistory: () =>
    set({ pickingHistory: [] }),
  
  // UI actions
  setHighlightedZone: (zoneId: string | null) =>
    set({ highlightedZoneId: zoneId }),
  
  // Completion
  completeWorkflow: () => {
    const state = get();
    if (state.currentRequestId && state.selectedPickingDetail) {
      set((state) => ({
        requests: state.requests.map((req) =>
          req.id === state.currentRequestId
            ? { ...req, status: "completed", pickingDetails: state.selectedPickingDetail }
            : req
        ),
        currentStep: "completion",
      }));
    }
  },
}));
