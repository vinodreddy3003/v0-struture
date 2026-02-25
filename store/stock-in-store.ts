"use client";

import { create } from "zustand";

export type AppMode = "design" | "stock-in";

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
  
  setMode: (mode: AppMode) => void;
  selectPartition: (structureId: string, levelId: string, partition: any) => void;
  clearSelection: () => void;
  resetToDesignMode: () => void;
}

export const useStockInStore = create<StockInStore>((set) => ({
  mode: "design",
  selectedStructureId: null,
  selectedLevelId: null,
  selectedPartition: null,
  
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
}));
