"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WarehouseCanvas } from "@/components/warehouse/warehouse-canvas";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactFlowProvider>
        <WarehouseCanvas />
      </ReactFlowProvider>
    </Suspense>
  );
}
