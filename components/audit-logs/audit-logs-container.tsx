"use client";

import { useState, useMemo, useCallback } from "react";
import { AuditLogsTable } from "./audit-logs-table";
import { AuditLogsHeader } from "./audit-logs-header";
import { AuditLogsDrawer } from "./audit-logs-drawer";
import { mockAuditLogs, type AuditLog } from "./mock-data";

const ITEMS_PER_PAGE = 10;

export function AuditLogsContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    module: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    let result = mockAuditLogs;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.user.toLowerCase().includes(query) ||
          log.product.toLowerCase().includes(query) ||
          log.requestId.toLowerCase().includes(query)
      );
    }

    // Action filter
    if (filters.action) {
      result = result.filter((log) => log.action === filters.action);
    }

    // Module filter
    if (filters.module) {
      result = result.filter((log) => log.module === filters.module);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((log) => log.status === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((log) => new Date(log.timestamp) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((log) => new Date(log.timestamp) <= endDate);
    }

    return result;
  }, [searchQuery, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // Reset to first page when filters change
  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      setCurrentPage(1);
    },
    []
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Timestamp",
      "User",
      "Action",
      "Module",
      "Product",
      "Quantity",
      "Status",
      "Request ID",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          new Date(log.timestamp).toLocaleString(),
          log.user,
          log.action,
          log.module,
          log.product,
          log.quantity,
          log.status,
          log.requestId,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [filteredLogs]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AuditLogsHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onExportCSV={handleExportCSV}
        totalRecords={filteredLogs.length}
      />

      <div className="flex-1 overflow-auto px-6 py-6">
        <AuditLogsTable
          logs={paginatedLogs}
          isLoading={false}
          onRowClick={setSelectedLog}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <AuditLogsDrawer
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
