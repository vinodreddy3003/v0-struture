"use client";

import { X, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AuditLog } from "./mock-data";

interface AuditLogsDrawerProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<
  string,
  { bg: string; text: string }
> = {
  Success: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300" },
  Failed: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
  Pending: { bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300" },
};

const actionColors: Record<string, { bg: string; text: string }> = {
  STOCK_IN_ALLOCATED: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  STOCK_OUT_PICKED: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  TRANSFER_COMPLETED: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
};

function LocationHierarchy({ location }: { location: AuditLog["location"] }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
        {location.zone}
      </span>
      <ChevronRight size={14} className="text-muted-foreground" />
      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
        {location.rack}
      </span>
      <ChevronRight size={14} className="text-muted-foreground" />
      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
        {location.section}
      </span>
    </div>
  );
}

export function AuditLogsDrawer({
  log,
  isOpen,
  onClose,
}: AuditLogsDrawerProps) {
  if (!log) return null;

  const statusColor = statusColors[log.status];
  const actionColor =
    actionColors[log.action] ||
    { bg: "bg-gray-50 dark:bg-gray-900", text: "text-gray-700 dark:text-gray-300" };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl">
        <DrawerHeader className="flex items-start justify-between pb-0">
          <div>
            <DrawerTitle className="text-xl">Log Details</DrawerTitle>
            <DrawerDescription className="mt-1 text-xs">
              Request ID: {log.requestId}
            </DrawerDescription>
          </div>
          <DrawerClose className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <X size={18} className="text-muted-foreground" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="space-y-6 px-6 py-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {/* Overview Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">User</p>
                <p className="text-sm font-medium text-foreground">{log.user}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Timestamp</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Action</p>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`${actionColor.bg} ${actionColor.text} border-0 text-xs`}
                  >
                    {log.action}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={`${statusColor.bg} ${statusColor.text} border-0 text-xs`}
                  >
                    {log.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product & Inventory Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Product & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="text-sm font-medium text-foreground">{log.product}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Module</p>
                <p className="text-sm font-medium text-foreground">{log.module}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="text-sm font-medium text-foreground">{log.quantity} units</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SKU</p>
                <p className="text-sm font-medium text-foreground">{log.sku}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Hierarchy */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Location Hierarchy</h3>
            <LocationHierarchy location={log.location} />
          </div>

          <Separator />

          {/* State Changes */}
          <div>
            <h3 className="text-sm font-semibold mb-3">State Changes</h3>
            <div className="space-y-4">
              {/* Before State */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Before</p>
                <div className="bg-muted/50 border border-border rounded p-3">
                  <pre className="text-xs overflow-x-auto text-foreground font-mono">
                    {JSON.stringify(log.beforeState, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronRight size={20} className="text-muted-foreground rotate-90" />
              </div>

              {/* After State */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">After</p>
                <div className="bg-muted/50 border border-border rounded p-3">
                  <pre className="text-xs overflow-x-auto text-foreground font-mono">
                    {JSON.stringify(log.afterState, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Request ID</p>
                <p className="text-xs font-mono text-foreground break-all">{log.requestId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Source</p>
                <p className="text-sm font-medium text-foreground">{log.source}</p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
