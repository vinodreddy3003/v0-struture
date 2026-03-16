"use client";

import { create } from "zustand";
import type { StockTransferRequest, TransferDetail } from "@/components/warehouse/types";

export type StockTransferWorkflowStep = "request" | "source-selection" | "destination-selection" | "confirmation" | "completion";
export type TransferType = "internal" | "external";

interface TransferState {
  sourceStructureId: string;
  sourceLevelId: string;
  sourcePartitionId: string;
  sourcePartitionName: string;
  transferredQuantity: number;
}

interface StockTransferStore {
  // 4-Step Workflow State
  currentStep: StockTransferWorkflowStep;
  currentRequestId: string | null;
  requests: StockTransferRequest[];
  
  // Transfer type
  transferType: TransferType;
  
  // Source Selection step state
  selectedSourceZoneId: string | null;
  selectedSourceStructureId: string | null;
  selectedSourceLevelId: string | null;
  sourceTransfers: TransferState[];
  sourceProduct: { name: string; quantity: number } | null;
  remainingQuantity: number;
  
  // Destination Selection step state
  selectedDestZoneId: string | null;
  selectedDestStructureId: string | null;
  selectedDestLevelId: string | null;
  destTransfers: TransferState[];
  destinationInfo: { location?: string; zone?: string; details?: string } | null;
  
  // Confirmation state
  confirmationData: {
    reason?: string;
    notes?: string;
    transferDate?: string;
  } | null;
  
  // UI state
  highlightedZoneId: string | null;
  
  // Workflow Actions
  setCurrentStep: (step: StockTransferWorkflowStep) => void;
  setTransferType: (type: TransferType) => void;
  
  // Request Management
  addRequest: (request: StockTransferRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;
  
  // Source Selection Actions
  selectSourceZone: (zoneId: string | null) => void;
  selectSourceStructure: (structureId: string | null) => void;
  selectSourceLevel: (levelId: string | null) => void;
  addSourceTransfer: (transfer: TransferState) => void;
  removeSourceTransfer: (partitionId: string) => void;
  setSourceProduct: (product: { name: string; quantity: number } | null) => void;
  setRemainingQuantity: (quantity: number) => void;
  
  // Destination Selection Actions
  selectDestZone: (zoneId: string | null) => void;
  selectDestStructure: (structureId: string | null) => void;
  selectDestLevel: (levelId: string | null) => void;
  addDestTransfer: (transfer: TransferState) => void;
  removeDestTransfer: (partitionId: string) => void;
  setDestinationInfo: (info: { location?: string; zone?: string; details?: string } | null) => void;
  
  // Confirmation Actions
  setConfirmationData: (data: { reason?: string; notes?: string; transferDate?: string } | null) => void;
  completeWorkflow: (onTransferUpdate?: (transfer: TransferDetail) => void) => void;
  
  // UI Actions
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockTransferStore = create<StockTransferStore>((set, get) => ({
  currentStep: "request",
  currentRequestId: null,
  requests: [],
  transferType: "internal",
  selectedSourceZoneId: null,
  selectedSourceStructureId: null,
  selectedSourceLevelId: null,
  sourceTransfers: [],
  sourceProduct: null,
  remainingQuantity: 0,
  selectedDestZoneId: null,
  selectedDestStructureId: null,
  selectedDestLevelId: null,
  destTransfers: [],
  destinationInfo: null,
  confirmationData: null,
  highlightedZoneId: null,
  
  // Workflow Actions
  setCurrentStep: (step: StockTransferWorkflowStep) => set({ currentStep: step }),
  setTransferType: (type: TransferType) => set({ transferType: type }),
  
  // Request Management
  addRequest: (request: StockTransferRequest) =>
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
        currentStep: "source-selection",
        transferType: request.transferType,
        sourceProduct: { name: request.productName, quantity: request.quantity },
        remainingQuantity: request.quantity,
        sourceTransfers: [],
        destTransfers: [],
        destinationInfo: null,
        confirmationData: null,
      });
    }
  },
  
  resetWorkflow: () =>
    set({
      currentRequestId: null,
      currentStep: "request",
      transferType: "internal",
      selectedSourceZoneId: null,
      selectedSourceStructureId: null,
      selectedSourceLevelId: null,
      sourceTransfers: [],
      sourceProduct: null,
      remainingQuantity: 0,
      selectedDestZoneId: null,
      selectedDestStructureId: null,
      selectedDestLevelId: null,
      destTransfers: [],
      destinationInfo: null,
      confirmationData: null,
      highlightedZoneId: null,
    }),
  
  // Source Selection Actions
  selectSourceZone: (zoneId: string | null) =>
    set({ selectedSourceZoneId: zoneId, highlightedZoneId: zoneId }),
  
  selectSourceStructure: (structureId: string | null) =>
    set({ selectedSourceStructureId: structureId }),
  
  selectSourceLevel: (levelId: string | null) =>
    set({ selectedSourceLevelId: levelId }),
  
  addSourceTransfer: (transfer: TransferState) =>
    set((state) => ({
      sourceTransfers: [...state.sourceTransfers, transfer],
      remainingQuantity: Math.max(0, state.remainingQuantity - transfer.transferredQuantity),
    })),
  
  removeSourceTransfer: (partitionId: string) =>
    set((state) => {
      const transfer = state.sourceTransfers.find((t) => t.sourcePartitionId === partitionId);
      return {
        sourceTransfers: state.sourceTransfers.filter((t) => t.sourcePartitionId !== partitionId),
        remainingQuantity: transfer
          ? state.remainingQuantity + transfer.transferredQuantity
          : state.remainingQuantity,
      };
    }),
  
  setSourceProduct: (product: { name: string; quantity: number } | null) =>
    set({ sourceProduct: product }),
  
  setRemainingQuantity: (quantity: number) =>
    set({ remainingQuantity: quantity }),
  
  // Destination Selection Actions
  selectDestZone: (zoneId: string | null) =>
    set({ selectedDestZoneId: zoneId, highlightedZoneId: zoneId }),
  
  selectDestStructure: (structureId: string | null) =>
    set({ selectedDestStructureId: structureId }),
  
  selectDestLevel: (levelId: string | null) =>
    set({ selectedDestLevelId: levelId }),
  
  addDestTransfer: (transfer: TransferState) =>
    set((state) => ({
      destTransfers: [...state.destTransfers, transfer],
    })),
  
  removeDestTransfer: (partitionId: string) =>
    set((state) => ({
      destTransfers: state.destTransfers.filter((t) => t.sourcePartitionId !== partitionId),
    })),
  
  setDestinationInfo: (info: { location?: string; zone?: string; details?: string } | null) =>
    set({ destinationInfo: info }),
  
  // Confirmation Actions
  setConfirmationData: (data: { reason?: string; notes?: string; transferDate?: string } | null) =>
    set({ confirmationData: data }),
  
  completeWorkflow: (onTransferUpdate?: (transfer: TransferDetail) => void) => {
    const state = get();
    if (state.currentRequestId) {
      // Call callback for each transfer to update warehouse data
      state.sourceTransfers.forEach((transfer) => {
        if (onTransferUpdate) {
          onTransferUpdate({
            sourceStructureId: transfer.structureId,
            sourceLevelId: transfer.levelId,
            sourcePartitionId: transfer.sourcePartitionId,
            destStructureId: state.selectedDestStructureId || "",
            destLevelId: state.selectedDestLevelId || "",
            transferredQuantity: transfer.transferredQuantity,
          });
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
