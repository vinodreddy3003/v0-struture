'use client';

import { useState, useMemo } from 'react';
import { AuditLog, AuditLogType } from '../types';
import { AuditLogsFilters } from './audit-logs-filters';
import { ActivityFeed } from './activity-feed';
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="px-6 py-8 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recent Activity</h1>
          <p className="text-gray-600">Track all stock movements and warehouse operations</p>
        </div>

        <div className="px-6 py-6 border-b border-gray-200">
          <AuditLogsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredLogs.length} of {logs.length} activities
          </p>
        </div>

        <div className="px-6 py-8">
          <ActivityFeed logs={filteredLogs} />
        </div>
      </div>
    </div>
  );
}
