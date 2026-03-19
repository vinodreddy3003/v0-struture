'use client';

import { Search } from 'lucide-react';
import { AuditLogType } from '../types';

interface AuditLogsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: AuditLogType | 'all';
  onFilterChange: (filter: AuditLogType | 'all') => void;
}

export function AuditLogsFilters({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}: AuditLogsFiltersProps) {
  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'stock-in', label: 'Stock In', icon: null },
    { id: 'stock-out', label: 'Stock Out', icon: null },
    { id: 'stock-transfer', label: 'Transfer', icon: null },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-600" size={18} />
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id as AuditLogType | 'all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFilter === filter.id
                ? 'bg-blue-600 text-white dark:bg-blue-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
