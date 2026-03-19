'use client';

import { useState, useMemo } from 'react';
import { AuditLog, AuditLogType } from '../types';
import { AuditLogsFilters } from './audit-logs-filters';
import { AuditLogsList } from './audit-logs-list';
import { AuditLogDetailsPanel } from './audit-log-details-panel';
import { generateMockAuditLogs } from './mock-data';

interface AuditLogsProps {
  initialLogs?: AuditLog[];
}

export function AuditLogs({ initialLogs }: AuditLogsProps) {
  const [logs] = useState<AuditLog[]>(initialLogs || generateMockAuditLogs(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<AuditLogType | 'all'>('all');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (selectedFilter !== 'all') {
      result = result.filter((log) => log.type === selectedFilter);
    }

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

  const selectedLog = logs.find((log) => log.id === selectedLogId);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
        <p className="text-gray-600">Track all stock movements and warehouse operations</p>
      </div>

      <div className="border-b border-gray-200 px-6 py-4">
        <AuditLogsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        <p className="text-sm text-gray-600 mt-4">
          Showing {filteredLogs.length} of {logs.length} logs
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <AuditLogsList 
          logs={filteredLogs}
          selectedLogId={selectedLogId}
          onSelectLog={setSelectedLogId}
        />
        
        {selectedLog && (
          <AuditLogDetailsPanel 
            log={selectedLog}
            onClose={() => setSelectedLogId(null)}
          />
        )}
      </div>
    </div>
  );
}
