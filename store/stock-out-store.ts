"use client";

import { create } from "zustand";
import type { StockOutRequest, PickingDetail } from "@/components/warehouse/types";

export type StockOutWorkflowStep = "request" | "product-selection" | "picking" | "completion";

interface PickingState {
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  pickedQuantity: number;
}

interface StockOutStore {
  // 4-Step Workflow State
  currentStep: StockOutWorkflowStep;
  currentRequestId: string | null;
  requests: StockOutRequest[];
  
  // Product Selection step state
  selectedProductName: string | null;
  selectedQuantity: number;
  remainingQuantity: number;
  
  // Picking step state
  pickingDetails: PickingState[];
  pickingConfirmed: boolean;
  
  // UI state
  highlightedZoneId: string | null;
  
  // Workflow Actions
  setCurrentStep: (step: StockOutWorkflowStep) => void;
  
  // Request Management
  addRequest: (request: StockOutRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;
  
  // Product Selection Actions
  selectProduct: (productName: string, quantity: number) => void;
  setRemainingQuantity: (quantity: number) => void;
  
  // Picking Actions
  addPickingDetail: (picking: PickingState) => void;
  removePickingDetail: (partitionId: string) => void;
  confirmPicking: () => void;
  completeWorkflow: (onPartitionUpdate?: (picking: PickingState) => void) => void;
  
  // UI Actions
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockOutStore = create<StockOutStore>((set, get) => ({
  currentStep: "request",
  currentRequestId: null,
  requests: [],
  selectedProductName: null,
  selectedQuantity: 0,
  remainingQuantity: 0,
  pickingDetails: [],
  pickingConfirmed: false,
  highlightedZoneId: null,
  
  // Workflow Actions
  setCurrentStep: (step: StockOutWorkflowStep) => set({ currentStep: step }),
  
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
        currentStep: "product-selection",
        selectedProductName: request.productName,
        selectedQuantity: request.quantity,
        remainingQuantity: request.quantity,
        pickingDetails: [],
        pickingConfirmed: false,
      });
    }
  },
  
  resetWorkflow: () =>
    set({
      currentRequestId: null,
      currentStep: "request",
      selectedProductName: null,
      selectedQuantity: 0,
      remainingQuantity: 0,
      pickingDetails: [],
      pickingConfirmed: false,
      highlightedZoneId: null,
    }),
  
  // Product Selection Actions
  selectProduct: (productName: string, quantity: number) =>
    set({
      selectedProductName: productName,
      selectedQuantity: quantity,
      remainingQuantity: quantity,
      currentStep: "picking",
    }),
  
  setRemainingQuantity: (quantity: number) =>
    set({ remainingQuantity: quantity }),
  
  // Picking Actions
  addPickingDetail: (picking: PickingState) =>
    set((state) => ({
      pickingDetails: [...state.pickingDetails, picking],
      remainingQuantity: Math.max(0, state.remainingQuantity - picking.pickedQuantity),
    })),
  
  removePickingDetail: (partitionId: string) =>
    set((state) => {
      const picking = state.pickingDetails.find((p) => p.partitionId === partitionId);
      return {
        pickingDetails: state.pickingDetails.filter((p) => p.partitionId !== partitionId),
        remainingQuantity: picking
          ? state.remainingQuantity + picking.pickedQuantity
          : state.remainingQuantity,
      };
    }),
  
  confirmPicking: () =>
    set({ pickingConfirmed: true, currentStep: "picking" }),
  
  completeWorkflow: (onPartitionUpdate?: (picking: PickingState) => void) => {
    const state = get();
    if (state.currentRequestId) {
      // Call callback for each picking detail to update warehouse data
      state.pickingDetails.forEach((picking) => {
        if (onPartitionUpdate) {
          onPartitionUpdate(picking);
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
