"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { WarehouseCanvas } from "@/components/warehouse/warehouse-canvas";
import { AuditLogsContainer } from "@/components/audit-logs/audit-logs-container";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [view, setView] = useState<"warehouse" | "auditlogs">("warehouse");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen">
        {/* View Switcher */}
        <div className="flex gap-2 p-3 border-b border-border bg-card">
          <Button
            variant={view === "warehouse" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("warehouse")}
          >
            Warehouse
          </Button>
          <Button
            variant={view === "auditlogs" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("auditlogs")}
          >
            Audit Logs
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {view === "warehouse" ? (
            <ReactFlowProvider>
              <WarehouseCanvas />
            </ReactFlowProvider>
          ) : (
            <AuditLogsContainer />
          )}
        </div>
      </div>
    </Suspense>
  );
}
