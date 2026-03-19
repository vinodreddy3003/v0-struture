'use client';

import { useState, useMemo } from 'react';
import { AuditLog, AuditLogType } from '../types';
import { AuditLogsFilters } from './audit-logs-filters';
import { AuditLogsTable } from './audit-logs-table';
import { generateMockAuditLogs } from './mock-data';

interface AuditLogsProps {
  initialLogs?: AuditLog[];
}

export function AuditLogs({ initialLogs }: AuditLogsProps) {
  const [logs] = useState<AuditLog[]>(initialLogs || generateMockAuditLogs(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<AuditLogType | 'all'>('all');

  const filteredLogs = useMemo(() => {
    let result = logs;

    // Filter by type
    if (selectedFilter !== 'all') {
      result = result.filter((log) => log.type === selectedFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.productName.toLowerCase().includes(query) ||
          log.user.toLowerCase().includes(query) ||
          log.referenceId.toLowerCase().includes(query)
      );
    }

    return result;
  }, [logs, searchQuery, selectedFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Audit Logs</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track all stock movements and warehouse operations
        </p>
      </div>

      <AuditLogsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredLogs.length} of {logs.length} logs
        </p>
      </div>

      <AuditLogsTable logs={filteredLogs} />
    </div>
  );
}
