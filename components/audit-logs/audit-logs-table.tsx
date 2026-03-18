"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AuditLog } from "./mock-data";

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onRowClick: (log: AuditLog) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const actionColors: Record<string, { bg: string; text: string }> = {
  STOCK_IN_ALLOCATED: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" },
  STOCK_OUT_PICKED: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" },
  TRANSFER_COMPLETED: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-300" },
};

const statusColors: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Success: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
  Failed: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  Pending: { bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-500" },
};

function AuditLogSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="py-3">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground text-sm font-medium">
            No audit logs found
          </p>
          <p className="text-muted-foreground text-xs">
            Try adjusting your filters or search query
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AuditLogsTable({
  logs,
  isLoading,
  onRowClick,
  totalPages,
  currentPage,
  onPageChange,
}: AuditLogsTableProps) {
  const actionDisplayNames = useMemo(
    () => ({
      STOCK_IN_ALLOCATED: "Stock In",
      STOCK_OUT_PICKED: "Stock Out",
      TRANSFER_COMPLETED: "Transfer",
    }),
    []
  );

  const formatQuantity = (quantity: number, action: string) => {
    if (action === "STOCK_IN_ALLOCATED") {
      return `+ ${quantity}`;
    } else if (action === "STOCK_OUT_PICKED") {
      return `- ${quantity}`;
    }
    return quantity;
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Module</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold text-right">Qty</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AuditLogSkeleton />
            ) : logs.length === 0 ? (
              <EmptyState />
            ) : (
              logs.map((log) => {
                const statusColor = statusColors[log.status];
                const actionColor =
                  actionColors[log.action] ||
                  { bg: "bg-gray-50 dark:bg-gray-900", text: "text-gray-700 dark:text-gray-300" };

                return (
                  <TableRow
                    key={log.id}
                    onClick={() => onRowClick(log)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-sm text-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {log.user}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${actionColor.bg} ${actionColor.text} border-0`}>
                        {actionDisplayNames[log.action as keyof typeof actionDisplayNames] || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {log.module}
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {log.product}
                    </TableCell>
                    <TableCell className="text-sm text-foreground text-right font-medium">
                      {formatQuantity(log.quantity, log.action)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${statusColor.dot}`}
                        />
                        <Badge
                          variant="outline"
                          className={`${statusColor.bg} ${statusColor.text} border-0 text-xs`}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && logs.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
