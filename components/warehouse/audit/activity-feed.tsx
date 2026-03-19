'use client';

import { AuditLog } from '../types';
import { ActivityCard } from './activity-card';

interface ActivityFeedProps {
  logs: AuditLog[];
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No activity found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <ActivityCard key={log.id} log={log} />
      ))}
    </div>
  );
}
