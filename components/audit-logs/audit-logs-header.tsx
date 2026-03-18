"use client";

import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLogsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    action: string;
    module: string;
    status: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filters: {
    action: string;
    module: string;
    status: string;
    startDate: string;
    endDate: string;
  }) => void;
  onExportCSV: () => void;
  totalRecords: number;
}

export function AuditLogsHeader({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onExportCSV,
  totalRecords,
}: AuditLogsHeaderProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filters.action !== "" ||
    filters.module !== "" ||
    filters.status !== "" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  const handleClearFilters = () => {
    onSearchChange("");
    onFilterChange({
      action: "",
      module: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="border-b border-border bg-card">
      {/* Title and Export */}
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total records: <span className="font-medium">{totalRecords}</span>
          </p>
        </div>
        <Button
          onClick={onExportCSV}
          variant="outline"
          className="gap-2"
          disabled={totalRecords === 0}
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by user, product, or request ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Action Filter */}
          <Select value={filters.action} onValueChange={(value) => {
            onFilterChange({ ...filters, action: value });
          }}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              <SelectItem value="STOCK_IN_ALLOCATED">Stock In</SelectItem>
              <SelectItem value="STOCK_OUT_PICKED">Stock Out</SelectItem>
              <SelectItem value="TRANSFER_COMPLETED">Transfer</SelectItem>
            </SelectContent>
          </Select>

          {/* Module Filter */}
          <Select value={filters.module} onValueChange={(value) => {
            onFilterChange({ ...filters, module: value });
          }}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Modules</SelectItem>
              <SelectItem value="Request">Request</SelectItem>
              <SelectItem value="Allocation">Allocation</SelectItem>
              <SelectItem value="Picking">Picking</SelectItem>
              <SelectItem value="Completion">Completion</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => {
            onFilterChange({ ...filters, status: value });
          }}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              onFilterChange({ ...filters, startDate: e.target.value })
            }
            className="text-xs px-3 py-2 border border-border rounded-md bg-card text-foreground"
          />

          {/* End Date */}
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              onFilterChange({ ...filters, endDate: e.target.value })
            }
            className="text-xs px-3 py-2 border border-border rounded-md bg-card text-foreground"
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
