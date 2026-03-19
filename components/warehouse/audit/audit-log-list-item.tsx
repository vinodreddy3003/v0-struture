'use client';

import { AuditLog } from '../types';

interface AuditLogListItemProps {
  log: AuditLog;
  isSelected: boolean;
  onSelect: () => void;
}

export function AuditLogListItem({ log, isSelected, onSelect }: AuditLogListItemProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock-in':
        return 'bg-green-50 border-green-200';
      case 'stock-out':
        return 'bg-red-50 border-red-200';
      case 'stock-transfer':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'stock-in':
        return 'bg-green-100 text-green-800';
      case 'stock-out':
        return 'bg-red-100 text-red-800';
      case 'stock-transfer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stock-in':
        return 'Stock In';
      case 'stock-out':
        return 'Stock Out';
      case 'stock-transfer':
        return 'Transfer';
      default:
        return type;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 transition-colors border-l-4 ${
        isSelected
          ? `${getTypeColor(log.type)} border-l-gray-900 bg-opacity-100`
          : 'hover:bg-gray-50 border-l-transparent'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(log.type)}`}>
            {getTypeLabel(log.type)}
          </span>
          <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900">{log.productName}</h3>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{log.user}</span>
          <span className={`font-semibold ${log.sign === '+' ? 'text-green-600' : 'text-red-600'}`}>
            {log.sign}{log.quantity}
          </span>
        </div>
      </div>
    </button>
  );
}
