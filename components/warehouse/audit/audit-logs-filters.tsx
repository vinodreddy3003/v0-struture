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
    { id: 'all', label: 'All' },
    { id: 'stock-in', label: 'Stock In' },
    { id: 'stock-out', label: 'Stock Out' },
    { id: 'stock-transfer', label: 'Transfer' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by product, user, or reference ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id as AuditLogType | 'all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedFilter === filter.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
