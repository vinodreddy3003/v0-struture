'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AuditLog } from '../types';
import { AuditLogBadge } from './audit-log-badge';
import { AuditLogDetails } from './audit-log-details';

interface AuditLogRowProps {
  log: AuditLog;
}

export function AuditLogRow({ log }: AuditLogRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <tr
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors border-b border-slate-200 dark:border-slate-700"
      >
        <td className="px-4 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label="Toggle details"
          >
            <ChevronDown
              size={18}
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-slate-600 dark:text-slate-400`}
            />
          </button>
        </td>
        <td className="px-4 py-3">
          <AuditLogBadge type={log.type} status={log.status} />
        </td>
        <td className="px-4 py-3">
          <span className="font-medium text-slate-900 dark:text-slate-100">{log.productName}</span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className={`text-base font-semibold ${log.sign === '+' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {log.sign}{log.quantity}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-sm text-slate-600 dark:text-slate-400">{log.sourceLocation || '—'}</span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-sm text-slate-600 dark:text-slate-400">{log.destinationLocation || '—'}</span>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <span className="text-sm text-slate-600 dark:text-slate-400">{log.user}</span>
        </td>
        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
          {formatDate(log.timestamp)}
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <td colSpan={8} className="p-0">
            <AuditLogDetails log={log} />
          </td>
        </tr>
      )}
    </>
  );
}
