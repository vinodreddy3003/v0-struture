'use client';

import { AuditLog } from '../types';
import { AuditLogListItem } from './audit-log-list-item';

interface AuditLogsListProps {
  logs: AuditLog[];
  selectedLogId: string | null;
  onSelectLog: (logId: string) => void;
}

export function AuditLogsList({ logs, selectedLogId, onSelectLog }: AuditLogsListProps) {
  if (logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No audit logs found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto border-r border-gray-200">
      <div className="divide-y divide-gray-200">
        {logs.map((log) => (
          <AuditLogListItem
            key={log.id}
            log={log}
            isSelected={selectedLogId === log.id}
            onSelect={() => onSelectLog(log.id)}
          />
        ))}
      </div>
    </div>
  );
}
