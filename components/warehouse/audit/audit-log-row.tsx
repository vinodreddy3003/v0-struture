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
        className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200"
      >
        <td className="px-4 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Toggle details"
          >
            <ChevronDown
              size={18}
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-600`}
            />
          </button>
        </td>
        <td className="px-4 py-3">
          <span className="font-medium text-gray-900">{log.productName}</span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className={`text-base font-semibold ${log.sign === '+' ? 'text-green-600' : 'text-red-600'}`}>
            {log.sign}{log.quantity}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-sm text-gray-600">{log.sourceLocation || '—'}</span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="text-sm text-gray-600">{log.destinationLocation || '—'}</span>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <span className="text-sm text-gray-600">{log.user}</span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {formatDate(log.timestamp)}
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            log.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : log.status === 'failed'
                ? 'bg-red-100 text-red-700'
                : log.status === 'picked'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
          }`}>
            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50 border-b border-gray-200">
          <td colSpan={8} className="p-0">
            <AuditLogDetails log={log} />
          </td>
        </tr>
      )}
    </>
  );
}
