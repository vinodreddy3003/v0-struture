"use client";

import { create } from "zustand";
import type { StockOutRequest, PickDetail } from "@/components/warehouse/types";

export type AppMode = "design" | "stock-out";
export type WorkflowStep = "request" | "picking" | "verification" | "completion";

interface PickState {
  structureId: string;
  levelId: string;
  partitionId: string;
  partitionName: string;
  pickedQuantity: number;
}

interface StockOutStore {
  mode: AppMode;

  // 4-Step Workflow State
  currentStep: WorkflowStep;
  currentRequestId: string | null;
  requests: StockOutRequest[];

  // Picking step state
  selectedZoneId: string | null;
  selectedStructureId: string | null;
  selectedLevelId: string | null;
  picks: PickState[];
  remainingQuantity: number;

  // Verification step state
  verificationConfirmed: boolean;

  // UI state
  highlightedZoneId: string | null;

  // Mode & Workflow Actions
  setMode: (mode: AppMode) => void;
  setCurrentStep: (step: WorkflowStep) => void;

  // Request Management
  addRequest: (request: StockOutRequest) => void;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  startWorkflow: (requestId: string) => void;
  resetWorkflow: () => void;

  // Picking Actions
  selectZone: (zoneId: string | null) => void;
  selectStructure: (structureId: string | null) => void;
  selectLevel: (levelId: string | null) => void;
  addPick: (pick: PickState) => void;
  removePick: (partitionId: string) => void;
  setRemainingQuantity: (quantity: number) => void;

  // Verification Actions
  confirmVerification: () => void;
  completeWorkflow: (onPartitionUpdate?: (pick: PickState) => void) => void;

  // UI Actions
  setHighlightedZone: (zoneId: string | null) => void;
}

export const useStockOutStore = create<StockOutStore>((set, get) => ({
  mode: "design",
  currentStep: "request",
  currentRequestId: null,
  requests: [],
  selectedZoneId: null,
  selectedStructureId: null,
  selectedLevelId: null,
  picks: [],
  remainingQuantity: 0,
  verificationConfirmed: false,
  highlightedZoneId: null,

  // Mode & Workflow Actions
  setMode: (mode: AppMode) => set({ mode }),

  setCurrentStep: (step: WorkflowStep) => set({ currentStep: step }),

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
        currentStep: "picking",
        picks: [],
        remainingQuantity: request.quantity,
        verificationConfirmed: false,
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
      picks: [],
      remainingQuantity: 0,
      verificationConfirmed: false,
      highlightedZoneId: null,
    }),

  // Picking Actions
  selectZone: (zoneId: string | null) =>
    set({ selectedZoneId: zoneId, highlightedZoneId: zoneId }),

  selectStructure: (structureId: string | null) =>
    set({ selectedStructureId: structureId }),

  selectLevel: (levelId: string | null) =>
    set({ selectedLevelId: levelId }),

  addPick: (pick: PickState) =>
    set((state) => ({
      picks: [...state.picks, pick],
      remainingQuantity: Math.max(0, state.remainingQuantity - pick.pickedQuantity),
    })),

  removePick: (partitionId: string) =>
    set((state) => {
      const pick = state.picks.find((p) => p.partitionId === partitionId);
      return {
        picks: state.picks.filter((p) => p.partitionId !== partitionId),
        remainingQuantity: pick
          ? state.remainingQuantity + pick.pickedQuantity
          : state.remainingQuantity,
      };
    }),

  setRemainingQuantity: (quantity: number) =>
    set({ remainingQuantity: quantity }),

  // Verification Actions
  confirmVerification: () =>
    set({ verificationConfirmed: true, currentStep: "verification" }),

  completeWorkflow: (onPartitionUpdate?: (pick: PickState) => void) => {
    const state = get();
    if (state.currentRequestId) {
      // Call callback for each pick to update warehouse data
      state.picks.forEach((pick) => {
        if (onPartitionUpdate) {
          onPartitionUpdate(pick);
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
