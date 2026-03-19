'use client';

import { AuditLog } from '../types';
import { Package, ArrowUp, ArrowDown, ArrowRightLeft, AlertCircle } from 'lucide-react';

interface ActivityCardProps {
  log: AuditLog;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'stock-in':
      return <ArrowUp className="w-5 h-5 text-white" />;
    case 'stock-out':
      return <ArrowDown className="w-5 h-5 text-white" />;
    case 'stock-transfer':
      return <ArrowRightLeft className="w-5 h-5 text-white" />;
    default:
      return <Package className="w-5 h-5 text-white" />;
  }
}

function getIconBackgroundColor(type: string) {
  switch (type) {
    case 'stock-in':
      return 'bg-green-500';
    case 'stock-out':
      return 'bg-orange-500';
    case 'stock-transfer':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

function getActionBadgeStyle(type: string) {
  switch (type) {
    case 'stock-in':
      return 'bg-green-100 text-green-700';
    case 'stock-out':
      return 'bg-orange-100 text-orange-700';
    case 'stock-transfer':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getActionLabel(type: string) {
  switch (type) {
    case 'stock-in':
      return 'Stock In';
    case 'stock-out':
      return 'Stock Out';
    case 'stock-transfer':
      return 'Transfer';
    default:
      return 'Activity';
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function ActivityCard({ log }: ActivityCardProps) {
  const iconBgColor = getIconBackgroundColor(log.type);
  const badgeStyle = getActionBadgeStyle(log.type);
  const actionLabel = getActionLabel(log.type);
  const relativeTime = formatRelativeTime(log.timestamp);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-150 cursor-default">
      {/* Circular Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
        {getActivityIcon(log.type)}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <p className="font-semibold text-gray-900">{log.productName}</p>
          <span className="text-gray-400">•</span>
          <p className="text-sm text-gray-600">
            {Math.abs(log.quantity)} {log.quantity === 1 ? 'liter' : 'liters'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <p className="text-sm text-gray-600">by {log.user}</p>
          <span className="text-gray-300">•</span>
          <p className="text-sm text-gray-600">{relativeTime}</p>
        </div>
      </div>

      {/* Action Badge */}
      <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${badgeStyle}`}>
        {actionLabel}
      </div>
    </div>
  );
}
